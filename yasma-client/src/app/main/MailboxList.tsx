'use client'
import {ApiResult, Mbox} from "@/types/mbox";
import { useState, useEffect } from "react";
import UseApi from "@/hooks/UseApi";
import useFilterMailboxes from "@/hooks/UseFilterMailboxes";
import  { useMailStore } from "@/stores/mail-store";
import { MdOutlineReplay } from "react-icons/md";

export function MailboxList() {
  const setCurrentMailbox = useMailStore((state) => state.setCurrentMailbox);
  const [mailboxes, setMailboxes] = useState([]);
  const [selectedMailboxIdx, setSelectedMailboxIdx] = useState(2);
  const { listMbox } = UseApi();
  const { filterMailboxes } = useFilterMailboxes();
     async function fetchData() {
     const result: ApiResult = await listMbox();
      const mboxes: Mbox[] = (result?.data && result.data.length) ? result.data : [];
      setMailboxes(filterMailboxes(mboxes));
    }
  useEffect(() => {
    fetchData();
  }, []);

  const handleSetCurrentMailbox = (_curMailbox: Mbox, index: number) => {
    setSelectedMailboxIdx(index);
    setCurrentMailbox(_curMailbox);
  }
  const handleReload = (mbox: Mbox) => {
    fetchData();
  }
  return (
      <div className="overflow-auto h-full">
        <ul>
          {mailboxes.map((mailbox, index) => (
              <li
                  key={index}
                  onClick={() => handleSetCurrentMailbox(mailbox, index)}
                  className={`cursor-pointer flex flex-row flex-nowrap group ${index === selectedMailboxIdx ? 'font-bold' : ''}`}
              >{
                mailbox.name}
                {index === selectedMailboxIdx &&
                  (<span
                      className={`hidden group-hover:inline ml-2 mt-1`}
                    onClick={() => handleReload(mailbox)}
                ><MdOutlineReplay/></span>)}
              </li>
          ))}
        </ul>
      </div>
  );
}
