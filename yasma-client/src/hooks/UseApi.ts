import { ApiInterface } from "@/types/api";
import { ApiResult, Message } from "@/types/mbox";

function useApi() {

  const BASE_URL = 'http://localhost:3001'

  const testApi = async () : Promise<ApiInterface> => {
    const result: ApiInterface = await api(`${BASE_URL}/api/testRedisKey`, 'GET')
    return result;
  }

  const authenticate = async (email: string, password: string) : Promise<ApiInterface> => {
    const result: ApiInterface = await api(`${BASE_URL}/api/auth`, 'POST', {email, password})
    if(result?.data?.uuid) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('token', result.data.uuid);
      }
    }
    return result.data;
  }
  const listMbox = async (): Promise<ApiResult> => {
    const result: ApiInterface = await api(`${BASE_URL}/api/mbox/list`, 'GET')
    if(result) {
      return result as ApiResult;
    }
    return [];
  }

  const isAuthenticated = (): boolean | string => {
    return getAuthToken();
  }

  const listMessages = async (mbox: string): Promise<ApiResult> => {
    const result: ApiInterface = await api(`${BASE_URL}/api/mbox/messages/${mbox}`, 'GET')
    if(result) {
      return result as ApiResult;
    }
    return [];
  }

  const getMessage = async (messageID: string): Promise<Message> => {
    const result: ApiInterface = await api(`${BASE_URL}/api/mbox/message/${messageID}`, 'GET')
    if(result) {
      try {
        if( result.data ) {
          return result.data;
        }
        return {};
      }
      catch(error) {
        console.log(error);
      }
      return result.data as Message;
    }
    return [];
  }

  const getAuthToken = (): boolean => {
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = sessionStorage.getItem('token');
    }

    return !!token ? token : false;
  }

  const api = async (url : string, method : string, body : object | null = null) : Promise<Api> => {
    const result : Api = {} as Api;
    const options : RequestInit = {
      url,
      method,
    }
    const headers = new Headers({ 'Content-Type': 'application/json' });
    options.headers = headers;
    const token = getAuthToken();
    if(token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    switch (method) {
      case 'POST':
      case 'PUT':
        if(body) {
          options.body = JSON.stringify(body);
        }
    }
    try {
      const request = new Request(url, options);
      const response = await fetch(request);
      result.data = await response.json();
    } catch (error) {
      if (error instanceof Error) {
        result.message = error.message;
      } else if (typeof error === 'string') {
        result.message = error;
      } else {
        result.message = 'there was an error fetching data.';
      }
    }
    return result;
  };
  return { getMessage, listMessages, listMbox, authenticate, isAuthenticated };

}
export default useApi;
