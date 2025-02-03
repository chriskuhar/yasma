'use client'
import { ListMbox } from "@/services/api/api";
import {ApiResult, Mbox} from "@/types/mbox";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'

import { setCurrentMailbox } from "@/features/mail/mailboxSlice";

export function MailboxList() {
  const curMailbox = useSelector((state : any) => state?.mailbox?.currentMailbox)
  const dispatch = useDispatch()
  const [mailboxes, setMailboxes] = useState([]);
  useEffect(() => {
     async function fetchData() {
      //const result : Mbox[] = await ListMbox();
     const result: ApiResult = await ListMbox();
      const mboxes = (result?.data && result.data.length) ? result.data : [];
      setMailboxes(mboxes);
    }
    fetchData();
  }, []);

  const handleSetCurrentMailbox = (_curMailbox: Mbox) => {
    dispatch(setCurrentMailbox(_curMailbox));
  }
  return (
      <div className="overflow-auto h-full">
        <h1>Mailbox {curMailbox?.name}</h1>
        <ul>
          {mailboxes.map((mailbox, index) => (
              <li key={index} onClick={() => handleSetCurrentMailbox(mailbox)} className="cursor-pointer">{mailbox.name}</li>
          ))}
        </ul>
      </div>
  );
}
