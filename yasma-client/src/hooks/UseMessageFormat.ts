import {Message, MessageHeader, MimeMediaObj} from "@/types/mbox";
import UseApi from "@/hooks/UseApi";
import UseB64 from "@/hooks/useB64";

function useMessageFormat() {
  const { getMessageAttachment } = UseApi();
  const { b64ToString } = UseB64();
  const messageRender = async (message: Message, messageId: string) => {
    let html: string = "";
    try {
      const parts: string[] = [];
      const renderedParts = await linearizeParts(message, parts, messageId);
      html += renderedParts.join(" ");
    } catch (error) {
      console.log(error);
    }
    return html;
  };

  // Convert the MIME parts into an HTML document (string)
  const linearizeParts = async (mimePart: Message, parts: string[], messageId: string): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
      let isMultipartAlternative = false;
      // Multi-part mixed, stitch in data parts
      if (
          mimePart.mimeType &&
          mimePart.mimeType.toLowerCase() === "multipart/mixed"
      ) {
        const textHtmlParts: string[] = [];
        const mediaParts: MimeMediaObj[] = [];
        if (mimePart.parts && mimePart.parts.length > 0) {
          for (const part of mimePart.parts) {
            if (
                part?.mimeType &&
                part.mimeType.length > 0 &&
                part.mimeType.toLowerCase() === "text/html" &&
                part?.body?.data &&
                part.body.data.length > 0
            ) {
              textHtmlParts.push(b64ToString(part.body.data));
            }
            if (
                part?.mimeType &&
                part.mimeType.length > 0 &&
                part.mimeType.toLowerCase() === "image/jpeg" &&
                part?.body?.attachmentId &&
                part.body.attachmentId.length > 0
            ) {
              const xAttachmentId: MessageHeader = part.headers.find(
                  (x) => x.name === "X-Attachment-Id",
              ) as MessageHeader;
              // fetch message attachment
              const result = await getMessageAttachment(messageId, part.body.attachmentId);
              console.log(result);

              mediaParts.push({
                cid: xAttachmentId.value,
                media: result.data
              });
            }
          }
          // stitch media into html
          let tmpHtmlPart: string = '';
          for(const textHtmlPart of textHtmlParts) {
            for(const media of mediaParts) {
              tmpHtmlPart = textHtmlPart.replace(`cid:${media.cid}`, `data:image/jpeg;base64,${media.media}`)
            }
            parts.push(tmpHtmlPart);
          }
        }
      }
      if (
          mimePart.mimeType &&
          mimePart.mimeType.toLowerCase() === "multipart/alternative"
      ) {
        isMultipartAlternative = true;
      }
      if (mimePart && mimePart.parts && mimePart.parts.length) {
        for (const part of mimePart.parts) {
          if (
              part?.body?.data &&
              isMultipartAlternative &&
              part.mimeType.toLowerCase() === "text/html"
          ) {
            parts.push(b64ToString(part.body.data));
          } else if (part.parts?.length) {
            for (const subPart of part.parts) {
              await linearizeParts(subPart, parts);
            }
          }
        }
      } else if (
          mimePart &&
          mimePart.body &&
          mimePart.mimeType.toLowerCase() === "text/html"
      ) {
        parts.push(b64ToString(mimePart.body.data));
      }
      resolve(parts);
    })
  };
  return { messageRender };
}

export default useMessageFormat;
