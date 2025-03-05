export interface ApiResult {
  error?: Error;
  data?: T;
}

export interface Error {
  code?: number;
  message?: string;
}
