'use client';
import { redirect } from "next/navigation";
import { MailboxList } from "@/app/main/MailboxList/page";
import { MessageList } from "@/app/main/MessageList/page";
import { MessageView } from "@/app/main/MessageView/page";
import useApi from "@/hooks/UseApi";

export default function Home() {
  const { isAuthenticated } = useApi();
  const testval = isAuthenticated();
  console.log(testval);
  if (isAuthenticated() === false) {
    //redirect('/login');
  }
  return (
      <div className="flex flex-col h-screen w-screen bg-blue-100"  >
        {/* Header */}
        <header className="w-screen p-3 h-10 bg-blue-100"></header>
        {/* outer container for LHS mailbox list and main content */}
        <div className="flex w-screen h-full px-3 py-0">
        {/* LHS mailbox list */}
          <div className="flex-grow-0 flex-shrink-0 pr-3 w-52 h-full bg-blue-100">
            <MailboxList />
          </div>
          {/* main content, list of messages on top of rendered message */}
          <div className="flex flex-col h-ful w-full b-green-700">
            {/* List of message subjects */}
            <div className="basis-1/3 overflow-auto border-blue-100 border-4">
              <MessageList />
            </div>
            {/* Content of message */}
            <div className="basis-2/3 pt-3 bg-white overflow-auto">
              <MessageView />
            </div>
          </div>
        </div>
        <footer className="w-screen h-3"></footer>
      </div>
  )
      ;
}
