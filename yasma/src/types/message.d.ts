export interface Message extends MimePart {
  parts: MimePart[];
}

export interface MimePart {
  partId: string;
  mimeType: string;
  filename: string;
  headers: Header[];
  body: Body;
}

export interface Header {
  key: string;
  value: string;
}

export interface Body {
  size: number;
  data: string;
}

export interface MessageAsciiText {
  messageText: string;
  messageTextLen: number;
  decodedMessage: string;
};
