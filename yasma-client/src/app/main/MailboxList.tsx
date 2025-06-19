'use client'
import {ApiResult, Mbox} from "@/types/mbox";
import { useState, useEffect } from "react";
import UseApi from "@/hooks/UseApi";
import useFilterMailboxes from "@/hooks/UseFilterMailboxes";
import  { useMailStore } from "@/stores/mail-store";

export function MailboxList() {
  const setCurrentMailbox = useMailStore((state) => state.setCurrentMailbox);
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
    setCurrentMailbox(_curMailbox);
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
