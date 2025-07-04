'use client'
import React, {useCallback, useEffect, useRef, useState} from "react";
import {ApiResult, MessageMetaData, MessageMetaDataPayload} from "@/types/mbox";
import { useMailStore } from "@/stores/mail-store";
import useFormatDateTime from "@/hooks/UseFormatDateTime"
import useMessageListFormatting from "@/hooks/UseMessageListFormatting";
import UseApi from "@/hooks/UseApi";
import { Spinner } from "@material-tailwind/react";


export function MessageList() {
  const setCurrentMessage = useMailStore((state) => state.setCurrentMessage);
  const curMailbox = useMailStore((state) => state.mailboxState);
  const { formatDateTime } = useFormatDateTime();
  const { formatMessageFrom, formatMessageSubject } = useMessageListFormatting();
  const { listMessages } = UseApi();
  const [metadata, setMetadata] = useState<MessageMetaData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [curMessageID, setCurMessageID] = useState("");
  const observerRef = useRef();
  const pageRef = useRef(1); // Keeps track of the current page
  const nextPageToken = useRef('');

  const setMessageRead = (messageID: string): void => {
    const copy: MessageMetaData[] = [...metadata];
    let msgCopy: MessageMetaData;
    for (let i = 0; i < metadata.length; i++) {
      if(copy[i].MessageID === messageID) {
        msgCopy = {...copy[i]}
        msgCopy.Read = true;
        copy[i] = msgCopy;
      }
    }
    setMetadata(copy);
  }

  const handleSetCurrentMessage = (message : MessageMetaData) => {
    setCurMessageID(message.MessageID);
    setCurrentMessage(message);
    // set message read in local copy
    setMessageRead(message.MessageID);
  }

  // infinite scroll
  const loadMoreItems = useCallback(async () => {
    const mboxName = curMailbox?.name || 'INBOX';
    const result: ApiResult = await listMessages(mboxName, nextPageToken.current);
    const data : MessageMetaDataPayload = result?.data as MessageMetaDataPayload;
    const messageList: MessageMetaData[] = data?.messages;
    if ( messageList ) {
      setMetadata((prevMessages) => [...prevMessages, ...data.messages]);
      nextPageToken.current = data.nextPageToken;
    } else {
      setHasMore(false);
    }
  }, []);

  useEffect(() => {
    async function  callLoadMoreItems (){
      await loadMoreItems();
    }
    callLoadMoreItems();
  }, [loadMoreItems]);

  const lastItemRef = useCallback((node) => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        pageRef.current += 1;
        loadMoreItems();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [hasMore, loadMoreItems]);

  const calcRowBackgroundColor = (index: number, message: MessageMetaData): string => {
    let classes: string = '';
    if(message.MessageID === curMessageID) {
      classes += ' bg-blue-300 ';
    } else if(message.Read) {
      classes += ' bg-blue-100 ';
    } else {
      classes +=  (index % 2 === 0) ? 'bg-white font-bold' : "bg-blue-50 font-bold"
    }
    return classes
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
                      <tr key={index} onClick={() => handleSetCurrentMessage(message)} className={`border border-white ${calcRowBackgroundColor(index, message)}`}>
                        <td className={`cursor-pointer truncate whitespace-nowrap text-sm`}>{formatMessageFrom(message.From)}</td>
                        <td className={`cursor-pointer truncate whitespace-nowrap text-sm`}>{formatMessageSubject(message.Subject)}</td>
                        <td className={`cursor-pointer text-sm whitespace-nowrap`}>{formatDateTime(message.DateTime)}</td>
                      </tr>
                  ))}
                  {hasMore && <tr ref={lastItemRef}><td colSpan={3}>Fetching messages...</td></tr>}
                  </tbody>
                </table>
            )
        }
      </>
  );
}
