'use client'
import {ApiResult, Mbox} from "@/types/mbox";
import { useState, useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux'
import UseApi from "@/hooks/UseApi";
import { setCurrentMailbox } from "@/features/mail/mailboxSlice";
import useFilterMailboxes from "@/hooks/UseFilterMailboxes";
import {AppStore} from "@/lib/store";

export function MailboxList() {
  const dispatch = useDispatch()
  const [mailboxes, setMailboxes] = useState([]);
  const [selectedMailboxIdx, setSelectedMailboxIdx] = useState(2);
  const { listMbox } = UseApi();
  const { filterMailboxes } = useFilterMailboxes();
  useEffect(() => {
     async function fetchData() {
     const result: ApiResult = await listMbox();
      const mboxes: Mbox[] = (result?.data && result.data.length) ? result.data : [];
      setMailboxes(filterMailboxes(mboxes));
    }
    fetchData();
  }, []);

  const handleSetCurrentMailbox = (_curMailbox: Mbox, index: number) => {
    setSelectedMailboxIdx(index);
    dispatch(setCurrentMailbox(_curMailbox));
  }
  return (
      <div className="overflow-auto h-full">
        <ul>
          {mailboxes.map((mailbox, index) => (
              <li key={index} onClick={() => handleSetCurrentMailbox(mailbox, index)} className={`cursor-pointer ${index == selectedMailboxIdx ? 'font-bold' : ''}`}>{mailbox.name}</li>
          ))}
        </ul>
      </div>
  );
}
