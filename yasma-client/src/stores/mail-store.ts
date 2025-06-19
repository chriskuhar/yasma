import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import {produce} from "immer";
import {Mbox} from "@/types/mbox";

export type MailboxState = {
  id: string;
  name: string;
  type: string;
  messageListVisibility: string;
  labelListVisibility: string;
}

export type MessageState = {
  MessageID: string;
  To: string;
  From: string;
  ReplyTo: string;
  DateTime: string;
  Subject: string;
}

export type ComposeDialogState = {
  composeModalDialogOpen: boolean;
}

export type UserState = {
  firstName: string;
  lastName: string;
}

export type MailState = {
  mailboxState: MailboxState;
  messageState: MessageState;
  composeDialogState: ComposeDialogState;
  userState: UserState;
}

export type MailActions = {
  setCurrentMailbox: () => void
  setCurrentMessage: () => void
  setComposeModalDialogOpen: () => void
}

export type MailStore = MailState & MailActions
export const useMailStore = create(
  combine({
            mailboxState:  {
              id: '',
              name: '',
              type: '',
              messageListVisibility: '',
              labelListVisibility: '',
            },
            messageState: {
              MessageID: '',
              To: '',
              From: '',
              ReplyTo: '',
              DateTime: '',
              Subject: '',
            },
            composeDialogState: {
              composeModalDialogOpen: false,
            },
            userState: {
              firstName: '',
              lastName: '',
            },
          },
          (set, get) => {
              return {
                setCurrentMailbox: (mailbox: Mbox) => {
                  set(produce((state: MailStore) => {state.mailboxState = mailbox}))
                },
                setCurrentMessage: (message: MessageState) => {
                  set(produce((state: MailStore) => {state.messageState = message}))
                },
                setComposeModalDialogOpen: (open: boolean) => {
                  set(produce((state: MailStore) => {state.composeDialogState.composeModalDialogOpen = open}))
                },
              }
            }
          )
);
