export type MessageSendApi = {
  message: string;
  recipient: string;
  subject: string;
}

export type ResultApi = {
  error?: string;
  message?: string;
}

interface ListMessagesQuery {
  mbox: string;
  nextPageToken?: string;
}

export interface GetAttachment {
  status: number;
  data: string;
}
