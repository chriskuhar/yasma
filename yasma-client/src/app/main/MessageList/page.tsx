'use client'
import React, { useEffect, useRef } from "react";
import {ApiResult, MessageMetaData} from "@/types/mbox";
import { ListMessages } from "@/services/api/api";
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentMessage } from "@/features/mail/mailboxSlice";

export function MessageList() {
  const curMailbox = useSelector((state : any) => state?.mailbox?.currentMailbox);
  //let metadata : MessageMetaData[] = []
  const dispatch = useDispatch()
  let  metadata : React.RefObject<MessageMetaData[]> = useRef([]);
  useEffect(() => {
    async function fetchData(mboxName: string) {
      const result: ApiResult = await ListMessages(mboxName);
      if ( result?.data ) {
        const messageList: MessageMetaData[] = result.data;
        metadata.current =(messageList.length) ? result.data : [];
      }
    }
    const mailbox = curMailbox?.name || 'INBOX';
    fetchData(mailbox);
  }, [curMailbox]);

  const handleSetCurrentMessage = (message : MessageMetaData) => {
    console.log(`XDEBUG handleSetCurrentMessage: ${message.Subject}`);
    dispatch(setCurrentMessage(message));
  }
  const formatFrom = (fromStr: string) => {
    const bits = fromStr.split('<');
    if(bits.length > 1){
      return bits[0];
    }
    return fromStr;
  }

  return (
      <>
        <table className="w-full">
          <thead>
          {metadata.current.length > 0 &&
              <tr>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Date</th>
              </tr>
          }
          </thead>
          <tbody>
          {metadata.current.map((message, index) => (
              <tr key={index} onClick={() => handleSetCurrentMessage(message)}>
                <td className="cursor-pointer">{formatFrom(message.From)}</td>
                <td className="cursor-pointer">{message.Subject}</td>
                <td className="cursor-pointer">{message.DateTime}</td>
              </tr>
          ))}
          </tbody>
        </table>
      </>
  );
}
