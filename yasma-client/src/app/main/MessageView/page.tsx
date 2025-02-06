import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import useMessageFormat from "@/hooks/UseMessageFormat";
import UseApi from "@/hooks/UseApi";

export function MessageView() {
  const curMessage = useSelector((state : any) => state?.mailbox?.currentMessage);
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
