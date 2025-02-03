'use client'

import { useSelector } from "react-redux";
import React, { useEffect, useRef } from "react";
import { Message } from "@/types/mbox";
import { getMessage } from "@/services/api/api";
import { messageRender } from "@/services/message/messageRender"

export function MessageView() {
  const curMessage = useSelector((state : any) => state?.mailbox?.currentMessage);
  let  message : React.RefObject<Message> = useRef(null);
  useEffect(() => {
    console.log(`XDEBUG Hello ${JSON.stringify(curMessage)}`);
    async function fetchData(messageID: string) {
      const result = await getMessage(messageID);
      message.current = messageRender(result);
    }
    const curMessageID = curMessage?.MessageID;
    if(curMessageID) {
      fetchData(curMessageID);
    }
  }, [curMessage]);

  return (
      <>
        <div dangerouslySetInnerHTML={{__html: message.current}}/>
      </>
  );
}
