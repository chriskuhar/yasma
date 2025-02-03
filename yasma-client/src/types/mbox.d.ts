
export type ApiResult = {
  data?: object;
  error?: object;
}

export type MboxPayload = {
  payload: Mbox;
}

export type Mbox = {
  id: string;
  name: string;
  type: MboxType;
  messageListVisibility: MessageListVisibility;
  labelListVisibility: LabelListVisibility;
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

export type MessageMetaDataPayload = {
  payload: MessageMetaData;
}
export type MessageMetaData = {
  MessageID: string;
  To: string;
  From: string;
  ReplyTo: string;
  DateTime: string;
  Subject: string;
}

export type MessageHeader = {
  name: string;
  value: string;
}

export type MessageBody = {
  size: int;
  data: string;
}

export type  MessageMimeType = {
  partId: string;
  mimeType: string;
  filename: string;
  headers: MessageHeader[];
  body: MessageBody;
}

export type Message = {
  partId?: string;
  mimeType:? string;
  filename?: string;
  headers?: MessageHeader[];
  body?: MessageBody;
  parts?: MessageMimeType[];
}
