export interface ApiInterface {
  message?: string;
  error?: string;
  status?: string;
  data?: object;
}

export interface Options {
  url: string;
  method: string;
  body?: object;
}
