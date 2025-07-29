import base64js from "base64-js";

// utility functions to encode / decode B64 encoding to a string

function useB64() {
  const b64ToString = (b64: string): string | null => {
    let result: string | null = null;
    try {
      const buffer = base64js.toByteArray(b64);
      const decoder = new TextDecoder("utf-8");
      result = decoder.decode(buffer);
    } catch (error) {
      console.log(error);
    }
    return result;
  };

  const stringToB64 = (htmlData: string): string => {
    let result: string = "";
    try {
      const byteArray: Uint8Array = stringToByteArray(htmlData);
      result = base64js.fromByteArray(byteArray);
    } catch (error) {
      console.log(error);
    }
    return result;
  };

  const stringToByteArray = (str: string): Uint8Array => {
    return new TextEncoder().encode(str);
  };

  return { b64ToString, stringToB64 };
}
export default useB64;
