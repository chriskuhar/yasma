'use client';
import { redirect } from "next/navigation";
import { isAuthenticated, ListMbox } from "@/services/api/api";
import { MailboxList } from "@/app/main/MailboxList/page";
import {MessageList} from "@/app/main/MessageList/page";
import {MessageView} from "@/app/main/MessageView/page";
import {useSelector} from "react-redux";

export default function Home() {
  console.log("XDEBUG Home page");
  const testval = isAuthenticated();
  console.log(testval);
  if (isAuthenticated() === false) {
    //redirect('/login');
  }
  return (
      <div className="flex flex-col h-screen w-screen bg-blue-700"  >
        {/* Header */}
        <header className="w-screen h-24 bg-purple-500">Yasma Mail</header>
        {/* outer container for LHS mailbox list and main content */}
        <div className="flex w-screen h-full px-3 py-0 bg-pink-400">
        {/* LHS mailbox list */}
          <div className="flex-grow-0 flex-shrink-0 w-40 h-full bg-amber-600">
            <MailboxList />
          </div>
          {/* main content, list of messages on top of rendered message */}
          <div className="flex flex-col h-ful w-full b-green-700">
            {/* List of message subjects */}
            <div className="basis-1/2 bg-yellow-100">
              <MessageList />
            </div>
            {/* Content of message */}
            <div className="basis-1/2  bg-blue-200">
              <MessageView />
            </div>
          </div>
        </div>
        <footer className="bg-gray-800 w-screen h-24"></footer>
      </div>
  )
      ;
}
