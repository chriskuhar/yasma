'use client'
import React, { useEffect, useState } from "react";
import { ApiResult, MessageMetaData } from "@/types/mbox";
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentMessage } from "@/features/mail/mailboxSlice";
import useFormatDateTime from "@/hooks/UseFormatDateTime"
import useMessageListFormatting from "@/hooks/UseMessageListFormatting";
import UseApi from "@/hooks/UseApi";
import { AppStore } from "@/lib/store";
import { Spinner } from "@material-tailwind/react";


export function MessageList() {
  const curMailbox = useSelector((state : AppStore) => state?.mailbox?.currentMailbox);
  const { formatDateTime } = useFormatDateTime();
  const { formatMessageFrom, formatMessageSubject } = useMessageListFormatting();
  const { listMessages } = UseApi();
  const dispatch = useDispatch()
  const [metadata, setMetadata] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchData(mboxName: string) {
      setLoading(true);
      const result: ApiResult = await listMessages(mboxName);
      if ( result?.data ) {
        const messageList: MessageMetaData[] = result.data;
        const data: MessageMetaData[] =(messageList.length) ? result.data : [];
        setMetadata(data);
      }
      setLoading(false);
    }
    const mailbox = curMailbox?.name || 'INBOX';
    fetchData(mailbox);
  }, [curMailbox]);

  const handleSetCurrentMessage = (message : MessageMetaData) => {
    dispatch(setCurrentMessage(message));
  }

  return (
      <>
        {loading ?
          (
              <div className="grid grid-cols-1 justify-items-center content-center bg-white p-8 h-full">
                <Spinner color="blue" className="h-36 w-36"/>
              </div>
          ) : (
                <table className="w-full">
                  <thead>
                  {metadata.length > 0 &&
                      <tr className="bg-white">
                          <th className="w-40">From</th>
                          <th className="w-auto">Subject</th>
                          <th className="w-40">Date</th>
                      </tr>
                  }
                  </thead>
                  <tbody>
                  {metadata.map((message, index) => (
                      <tr key={index} onClick={() => handleSetCurrentMessage(message)}>
                        <td className={`cursor-pointer ${index % 2 ? 'bg-white' : 'bg-blue-50'}`}>{formatMessageFrom(message.From)}</td>
                        <td className={`cursor-pointer ${index % 2 ? 'bg-white' : 'bg-blue-50'}`}>{formatMessageSubject(message.Subject)}</td>
                        <td className={`cursor-pointer ${index % 2 ? 'bg-white' : 'bg-blue-50'}`}>{formatDateTime(message.DateTime)}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            )
        }
      </>
  );
}
