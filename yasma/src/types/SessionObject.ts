export interface SessionObject {
  email: string;
  auth: unknown;
  credentials: Credentials;
}

export interface Credentials {
  type: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
  access_token: string;
}
