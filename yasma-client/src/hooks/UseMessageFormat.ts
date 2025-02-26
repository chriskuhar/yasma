import {Message} from "@/types/mbox";
import base64js from "base64-js";

function useMessageFormat() {

  const messageRender = (message: Message) => {
    let html: string = '';
    try {
      let isMultipartAlternative = false;
      if(message.mimeType && message.mimeType.toLowerCase() === "multipart/alternative") {
        isMultipartAlternative = true;
      }
      if(message && message.parts && message.parts.length) {
        for(const part of message.parts) {
          if(part?.body?.data && isMultipartAlternative && part.mimeType.toLowerCase() === "text/html") {
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

  const stringToB64 = (htmlData: string): string => {
    let result: string = '';
    try {
      const byteArray: Uint8Array = stringToByteArray(htmlData);
      result = base64js.fromByteArray(byteArray);
    }
    catch(error) {
      console.log(error);
    }
    return result;
  }

  const stringToByteArray = (str: string): Uint8Array  => {
      return new TextEncoder().encode(str);
  }

  return { messageRender, stringToB64 };
}

export default useMessageFormat;
