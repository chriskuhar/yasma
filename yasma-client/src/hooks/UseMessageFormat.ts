import {Message} from "@/types/mbox";
import base64js from "base64-js";

function useMessageFormat() {

  const messageRender = (message: Message) => {
    let html: string = '';
    try {
      const parts : string[] = [];
      linearizeParts(message, parts);
      html += parts.join(' ');
    }
    catch (error) {
      console.log(error);
    }
    return html;
  }

  const linearizeParts = (mimePart : Message, parts: string[]) => {
    let isMultipartAlternative = false;
    if(mimePart.mimeType && mimePart.mimeType.toLowerCase() === "multipart/alternative") {
      isMultipartAlternative = true;
    }
    if(mimePart && mimePart.parts && mimePart.parts.length) {
      for(const part of mimePart.parts) {
        if(part?.body?.data && isMultipartAlternative && part.mimeType.toLowerCase() === "text/html") {
          parts.push(b64ToString(part.body.data));
        } else if(part.parts?.length ) {
          for(const subPart of part.parts) {
            linearizeParts(subPart, parts);
          }
        }
      }
    }
    else if(mimePart && mimePart.body  && mimePart.mimeType.toLowerCase() === "text/html") {
      parts.push(b64ToString(mimePart.body.data));
    }

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
