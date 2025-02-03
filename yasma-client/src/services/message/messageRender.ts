import { Message } from "@/types/mbox";
import base64js from "base64-js"
export const messageRender = (message: Message) => {
  let html: string = '';
  try {
    if(message && message.parts && message.parts.length) {
      for(const part of message.parts) {
        if(part?.body?.data) {
          html += b64ToString(part.body.data)
        }
      }
    }
    else if(message && message.body) {
      html += b64ToString(message.body.data)
    }
  }
  catch (error) {
    console.log(error);
  }
  return html;
}

const b64ToString = (b64: string) => {
  let result: string | null = null;
  try {
    const buffer = base64js.toByteArray(b64);
    const decoder = new TextDecoder("utf-8");
    result = decoder.decode(buffer);
  }
  catch(error) {
    console.log(error);
  }
  return result;

}
