'use client'
import { ApiInterface } from "@/types/api";
import { ApiResult, Message, ListMessagesQuery } from "@/types/mbox";
import { UserSignup } from "@/types/auth-types";
import useB64 from "@/hooks/useB64";

function useApi() {
  const { stringToB64 } = useB64();

  const BASE_URL = 'http://localhost:3001'
  const erroredApiResult: ApiResult = {
    data: null,
    error: 'Unknown error occurred.',
  };

  const testApi = async () : Promise<ApiInterface> => {
    const result: ApiInterface = await api(`${BASE_URL}/api/testRedisKey`, 'GET')
    return result;
  }

  const authenticate = async (email: string, password: string) : Promise<ApiInterface> => {
    const result: ApiInterface = await api(`${BASE_URL}/api/auth`, 'POST', {email, password})
    return result.data;
  }
  const validateGoogleCode = async (code: string) : Promise<boolean> => {
    const result: ApiInterface = await api(`${BASE_URL}/api/google-validate-code`, 'POST', {code})
    if(result?.data?.data?.token) {
      // update token, has uuid / redis key now
      sessionStorage.setItem('token', result.data.data.token);
      return true;
    }
    return false;
  }
  const logout = () => {
    sessionStorage.removeItem('token');
  }

  const signup = async (data: UserSignup) : Promise<ApiInterface> => {
    const result: ApiInterface = await api(`${BASE_URL}/api/auth/signup`, 'POST', {email: data.email, password: data.password, firstName: data.firstName, lastName: data.lastName})
    return result;
  }
  const listMbox = async (): Promise<ApiResult> => {
    const result: ApiInterface = await api(`${BASE_URL}/api/mbox/list`, 'GET')
    if(result) {
      return result as ApiResult;
    }
    return erroredApiResult
  }

  const isAuthenticated = (): boolean | string => {
    return getAuthToken();
  }

  const listMessages = async (mbox: string, nextPageToken: string | null): Promise<ApiResult> => {
    const queryObj : ListMessagesQuery = {
      mbox
    }
    if(nextPageToken) {
      queryObj.nextPageToken = nextPageToken;
    }
    const result: ApiInterface = await api(`${BASE_URL}/api/mbox/messages`, 'GET',null,queryObj)
    if(result) {
      return result as ApiResult;
    }
    return erroredApiResult;
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

  const getMessageAttachment = async (messageID: string, attachmentId: string): Promise<Message> => {
    const result: ApiInterface = await api(`${BASE_URL}/api/mbox/message/${messageID}/${attachmentId}`, 'GET')
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

  const deleteMessage = async (messageID: string): Promise<Message> => {
    const result: ApiInterface = await api(`${BASE_URL}/api/mbox/message/${messageID}`, 'DELETE')
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

  const newMessage = async (message: string, recipient: string, subject: string): Promise<string> => {
    const data = {
      recipient,
      subject,
      message: stringToB64(message),
    }
    const result: ApiResult = await api(`${BASE_URL}/api/mbox/message`, 'POST', data)
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

  const getAuthToken = (): boolean | string => {
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = sessionStorage.getItem('token');
    }

    return !!token ? token : false;
  }

  const googleAuthenticate = async (email: string, password: string) : Promise<ApiInterface> => {
    const result: ApiInterface = await api(`${BASE_URL}/api/google-auth`, 'POST', {email, password})
    if(result?.data?.data?.token) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('token', result.data.data.token);
      }
    }
    return result.data;
  }

  const api = async (url : string, method : string, body : object | null = null, queryObj : object | null = null) : Promise<ApiResult> => {
    const result : ApiInterface = {} as ApiInterface;
    if(queryObj) {
      const keys = Object.keys(queryObj);
      const queryElts = [];
      let qStr = '';
      for(let key of keys) {
        if(queryObj[key] !== undefined) {
          qStr = `${key}=${queryObj[key]}`;
          queryElts.push(qStr);
        }
      }
      if(queryElts.length > 0) {
        url += `?${queryElts.join('&')}`;
      }
    }
    const options : RequestInit = {
      url,
      method,
    }
    options.headers = new Headers({ 'Content-Type': 'application/json' });
    const token = getAuthToken();
    if(token) {
      options.headers.append('Authorization', `Bearer ${token}`);
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
      result.status = response.status;
      if(response.status === 401) {
        // a little bombastic ...
        window.location.href = '/login';
      }
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
  return {
    getMessage,
    getMessageAttachment,
    deleteMessage,
    newMessage,
    listMessages,
    listMbox,
    logout,
    authenticate,
    signup,
    isAuthenticated,
    googleAuthenticate,
    validateGoogleCode,
  };

}
export default useApi;
