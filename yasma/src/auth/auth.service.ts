import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import { google } from 'googleapis';
import * as path from 'path';
import * as fs from 'node:fs';
import { OAuth2Client, JWTInput } from 'google-auth-library';
import { authenticate } from '@google-cloud/local-auth';
import { RedisService } from '../redis/redis.service';
import * as crypto from 'crypto';
import { AuthI } from '../types/auth';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
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
   * Reads previously authorized credentials from the save file.
   *
   * @return {Promise<OAuth2Client|null>}
   */
  async loadSavedCredentialsIfExist(
    uuid: string = null,
  ): Promise<OAuth2Client | null> {
    try {
      //const buff: Buffer<ArrayBufferLike> = await fsp.readFile(TOKEN_PATH);
      const result = await this.redisService.getKey(uuid);
      if (!result) {
        return null;
      }

      //const content: string = buff.toString();
      let credentials: object = null;
      if (typeof result === 'string') {
        credentials = JSON.parse(result);
      }
      return google.auth.fromJSON(credentials) as OAuth2Client;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /**
   * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @return {Promise<void>}
   */
  async saveCredentials(client: OAuth2Client): Promise<string> {
    let keys: Credential | null = null;
    const buff: Buffer<ArrayBufferLike> = await fsp.readFile(CREDENTIALS_PATH);
    const content: string = buff.toString();
    if (typeof content === 'string') {
      keys = JSON.parse(content);
    }
    const key: Web = keys?.installed || keys?.web;
    const payload: string = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client?.credentials?.refresh_token,
      access_token: client?.credentials?.access_token,
    });
    const uuid: string = crypto.randomUUID();
    await this.redisService.setKey(uuid, payload);
    //await fsp.writeFile(TOKEN_PATH, payload);
    return uuid;
  }

  /**
   * Load or request or authorization to call APIs.
   *
   */
  async authorize(_uuid: string = null): Promise<AuthI> {
    let client: OAuth2Client = await this.loadSavedCredentialsIfExist(_uuid);
    if (client) {
      return { uuid: _uuid };
    }
    // exchange credentials for token after user successfully authenticates
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    let uuid: string = '';
    if (client.credentials) {
      uuid = await this.saveCredentials(client);
    }
    return { uuid };
  }

  async getAuth(): Promise<AuthI> {
    return await this.authorize(null);
  }

  async testRedisKey(key: string): Promise<string> {
    return this.redisService.getKey(key);
  }
}
