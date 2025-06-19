import React, { useEffect, useState } from "react";
import useMessageFormat from "@/hooks/UseMessageFormat";
import UseApi from "@/hooks/UseApi";
import {useMailStore} from "@/stores/mail-store";

export function MessageView() {
  const curMessage = useMailStore((state) => state.messageState);
  const { messageRender } = useMessageFormat();
  const [ message, setMessage ] = useState(null);
  const { getMessage } = UseApi();
  useEffect(() => {
    async function fetchData(messageID: string) {
      const result = await getMessage(messageID);
      setMessage(messageRender(result));
    }
    const curMessageID = curMessage?.MessageID;
    if(curMessageID) {
      fetchData(curMessageID);
    }
  }, [curMessage]);

  return (
      <>
        <div dangerouslySetInnerHTML={{__html: message}}/>
      </>
  );
}
