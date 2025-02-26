import {Injectable, UnauthorizedException} from '@nestjs/common';
import * as process from 'node:process';
import { google } from 'googleapis';
import * as path from 'path';
import * as fs from 'node:fs';
import { OAuth2Client } from 'googleapis-common';
import { authenticate } from './auth.googleAuthenticate';
import { RedisService } from '../redis/redis.service';
import * as crypto from 'crypto';
import { AuthI } from '../types/auth';
import { SessionObject } from '../types/SessionObject';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

const fsp = fs.promises;

// Credential object
type Credential = {
  web: Web;
  installed: Web;
};
type Web = {
  auth_provider_x509_cert_url: string;
  auth_uri: string;
  client_id: string;
  client_secret: string;
  javascript_origins: Array<string>;
  project_id: string;
  redirect_uris: Array<string>;
  token_uri: string;
};
@Injectable()
export class AuthService {
  constructor(private readonly redisService: RedisService) {}
  /**
   * Reads previously authorized credentials from Redis record.
   *
   * @return {Promise<OAuth2Client|null>}
   */
  async loadSavedCredentialsIfExist(
    uuid: string = null,
  ): Promise<OAuth2Client> {
    try {
      const sessionObjectString = await this.redisService.getKey(uuid);
      let result: OAuth2Client;
      if (!sessionObjectString) {
        return null;
      }
      let sessionObject: SessionObject | object = {};
      if (typeof sessionObjectString === 'string') {
        sessionObject = JSON.parse(sessionObjectString);
      }
      if ('auth' in sessionObject && sessionObject?.auth) {
        result = google.auth.fromJSON(
          sessionObject.credentials,
        ) as unknown as OAuth2Client;
      }
      return result;
    } catch (error) {
      process.stdout.write(
        `Session Expired failed ${error} ${new Error().stack}`,
      );
      throw new UnauthorizedException('Session Expired failed');
    }
  }

  /**
   * Serializes credentials to a Redis record compatible with GoogleAuth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @param {email} user's email address
   * @return {Promise<void>}
   */
  async saveCredentials(client: OAuth2Client, email: string): Promise<string> {
    let keys: Credential | null = null;
    const buff: Buffer<ArrayBufferLike> = await fsp.readFile(CREDENTIALS_PATH);
    const content: string = buff.toString();
    if (typeof content === 'string') {
      keys = JSON.parse(content);
    }
    const key: Web = keys?.installed || keys?.web;
    const payload: string = JSON.stringify({
      email: email,
      auth: client,
      credentials: {
        type: 'authorized_user',
        client_id: key.client_id,
        client_email: email,
        client_secret: key.client_secret,
        refresh_token: client?.credentials?.refresh_token,
        access_token: client?.credentials?.access_token,
      },
    } as SessionObject);
    const uuid: string = crypto.randomUUID();
    await this.redisService.setKey(uuid, payload);
    return uuid;
  }

  /**
   * Load or request or authorization to call APIs.
   *
   */
  async authorize(_uuid: string = null, email: string): Promise<AuthI> {
    let client: unknown = await this.loadSavedCredentialsIfExist(_uuid);
    if (client) {
      return { uuid: _uuid };
    }
    // exchange credentials for token, user authenticates via web redirect
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    let uuid: string = '';
    if (client) {
      uuid = await this.saveCredentials(client as OAuth2Client, email);
    }
    return { uuid };
  }

  async getAuth(email: string): Promise<AuthI> {
    return await this.authorize(null, email);
  }

  async testRedisKey(key: string): Promise<string> {
    return this.redisService.getKey(key);
  }
}
