'use client'
import React, {useEffect, useRef, useState} from "react";
import {ApiResult, MessageMetaData} from "@/types/mbox";
import { ListMessages } from "@/services/api/api";
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentMessage } from "@/features/mail/mailboxSlice";
const { isToday, format } = require("date-fns");

export function MessageList() {
  const curMailbox = useSelector((state : any) => state?.mailbox?.currentMailbox);
  //let metadata : MessageMetaData[] = []
  const dispatch = useDispatch()
  //let  metadata : React.RefObject<MessageMetaData[]> = useRef([]);
  //let  metadata : MessageMetaData[] = [];
  const [metadata, setMetadata] = useState([]);
  useEffect(() => {
    async function fetchData(mboxName: string) {
      const result: ApiResult = await ListMessages(mboxName);
      if ( result?.data ) {
        const messageList: MessageMetaData[] = result.data;
        const data: MessageMetaData[] =(messageList.length) ? result.data : [];
        setMetadata(data);
      }
    }
    const mailbox = curMailbox?.name || 'INBOX';
    fetchData(mailbox);
  }, [curMailbox]);

  const handleSetCurrentMessage = (message : MessageMetaData) => {
    dispatch(setCurrentMessage(message));
  }
  const formatFrom = (fromStr: string) => {
    const bits = fromStr.split('<');
    if(bits.length > 1){
      return bits[0];
    }
    return fromStr;
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    let result;
    if(isToday(date)) {
      result = format(date, "h:mm a");
    }
    else {
      result = format(date, "M/d/yyyy, h:mm");
    }
    return result;
  }

  return (
      <>
        <table className="w-full">
          <thead>
          {metadata.length > 0 &&
              <tr className="bg-white">
                  <th>From</th>
                  <th>Subject</th>
                  <th>Date</th>
              </tr>
          }
          </thead>
          <tbody>
          {metadata.map((message, index) => (
              <tr key={index} onClick={() => handleSetCurrentMessage(message)}>
                <td className={`cursor-pointer ${index % 2 ? 'bg-white' : 'bg-blue-50'}`}>{formatFrom(message.From)}</td>
                <td className={`cursor-pointer ${index % 2 ? 'bg-white' : 'bg-blue-50'}`}>{message.Subject}</td>
                <td className={`cursor-pointer ${index % 2 ? 'bg-white' : 'bg-blue-50'}`}>{formatDate(message.DateTime)}</td>
              </tr>
          ))}
          </tbody>
        </table>
      </>
  );
}
