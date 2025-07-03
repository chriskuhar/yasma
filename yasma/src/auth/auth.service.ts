import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as process from 'node:process';
import { google } from 'googleapis';
import * as path from 'path';
import * as fs from 'node:fs';
import { OAuth2Client } from 'googleapis-common';
import {
  authenticate,
  authenticateGoogleRedirect,
  getGoogleAuthenticateURL, processCode,
} from './auth.googleAuthenticate';
import { RedisService } from '../redis/redis.service';
import * as crypto from 'crypto';
import { AuthI } from '../types/auth';
import { SessionObject } from '../types/SessionObject';
import { User } from '../types/user';
import { UserDbService } from '../mongo/userdb.service';
import { Result } from '../types/result';
import * as bcrypt from 'bcrypt';

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://mail.google.com/',
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
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
  constructor(
    private readonly redisService: RedisService,
    private readonly userDbService: UserDbService,
  ) {}
  /**
   * Reads previously authorized credentials from Redis record.
   *
   * @return {Promise<OAuth2Client|null>}
   */
  async loadSavedCredentialsIfExist(
    uuid: string = null,
    email: string = null,
  ): Promise<OAuth2Client> {
    try {
      const sessionObjectString = await this.redisService.getKey(uuid);
      let result: OAuth2Client;
      if (!sessionObjectString) {
        return null;
      }
      let sessionObject: SessionObject;
      if (typeof sessionObjectString === 'string') {
        sessionObject = JSON.parse(sessionObjectString);
      }
      if ('auth' in sessionObject && sessionObject?.auth) {
        const refreshToken =
          await this.userDbService.getRefreshTokenFromEmail(email);
        if (refreshToken) {
          sessionObject.credentials.refresh_token = refreshToken;
        }
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
   * @param email
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
    // if creds do not have refresh token (fresh login)
    // get save refresh_token from user DB record
    let refreshToken: string | null = client?.credentials?.refresh_token;
    if (!refreshToken) {
      refreshToken = await this.userDbService.getRefreshTokenFromEmail(email);
    }
    const payload: string = JSON.stringify({
      email: email,
      auth: client,
      credentials: {
        type: 'authorized_user',
        client_id: key.client_id,
        client_email: email,
        client_secret: key.client_secret,
        refresh_token: refreshToken,
        access_token: client?.credentials?.access_token,
      },
    } as SessionObject);
    const uuid: string = crypto.randomUUID();
    await this.redisService.setKey(uuid, payload);

    // save refresh token if there is one
    if (client?.credentials?.refresh_token) {
      await this.userDbService.putUserRefreshKey(
        email,
        client?.credentials?.refresh_token,
      );
    }
    return uuid;
  }

  /**
   * Load or request or authorization to call APIs.
   *
   */
  async authorize(_uuid: string = null, email: string): Promise<AuthI> {
    let client: OAuth2Client;
    if (_uuid) {
      client = await this.loadSavedCredentialsIfExist(_uuid);
      if (client) {
        return { uuid: _uuid };
      }
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

  async authenticateFromGoogleRedirect(
    email: string,
    url: string,
  ): Promise<AuthI> {
    const client: OAuth2Client = await authenticateGoogleRedirect(email, url);
    let uuid: string = '';
    if (client) {
      uuid = await this.saveCredentials(client as OAuth2Client, email);
    }
    return { uuid };
  }

  async testRedisKey(key: string): Promise<string> {
    return this.redisService.getKey(key);
  }

  async addUser(user: User): Promise<Result> {
    process.stdout.write(`ENV SALT ${process.env.LOCAL_SALT}`);
    user.password = await bcrypt.hash(
        user.password,
        process.env.LOCAL_SALT,
    );
    return await this.userDbService.create(user);
  }

  async checkLocalAuth(email: string, password: string): Promise<boolean> {
    const user: User = await this.userDbService.getUser(email);
    return await bcrypt.compare(password, user.password);
  }

  async getGoogleAuthURL(): Promise<string> {
    // exchange credentials for token, user authenticates via web redirect
    const googleAuthUrl: string = getGoogleAuthenticateURL({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    return googleAuthUrl;
  }
  /**
   * Load or request or authorization to call APIs.
   *
   */
  async authenticateCode(code: string = null, email: string = null): Promise<string> {
    // exchange credentials for token, user authenticates via web redirect
    const client: OAuth2Client = await processCode(code, CREDENTIALS_PATH);
    let uuid: string = '';
    if (client) {
      uuid = await this.saveCredentials(client as OAuth2Client, email);
    }
    return uuid;
  }
}
