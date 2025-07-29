
export type ApiResult = {
  data?: object | null;
  error?: object | string;
}

interface ListMessagesQuery {
  mbox: string;
  nextPageToken?: string;
}

export type MboxPayload = {
  payload: Mbox;
}

export type Mbox = {
  id: string;
  name: string;
  type?: MboxType;
  messageListVisibility?: MessageListVisibility;
  labelListVisibility?: LabelListVisibility;
}

export enum MboxType {
  System = "system",
  User = "user",
}

export enum MessageListVisibility {
  Show = "show",
  Hide = "hide",
}
export enum LabelListVisibility {
  LabelShow = "labelShow",
  LabelHide = "labelHide",
}

export interface MessageMetaDataPayload {
  messages: MessageMetaData[];
  nextPageToken: string;
}
export interface MessageMetaData {
  MessageID: string;
  To: string;
  From: string;
  ReplyTo: string;
  DateTime: string;
  Subject: string;
  Read: boolean;
}

export interface MimeMediaObj {
  cid: string;
  media: string;
}

export interface MessageHeader {
  name: string;
  value: string;
}

export interface MessageBody {
  size: int;
  data: string;
  attachmentId: string;
}

export interface Message {
  partId?: string;
  mimeType:? string;
  filename?: string;
  headers?: MessageHeader[];
  body?: MessageBody;
  parts?: Message[];
}
