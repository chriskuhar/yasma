import {authenticate} from "@google-cloud/local-auth";

export interface AuthI {
  uuid?: string;
  error?: string;
}

export interface LoginAPI {
  email: string;
  password: string;
}

export interface Credentials {
  type: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
  access_token: string;
}

export interface UserAuth {
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export interface RefreshToken {
  refresh_token: string;
}
