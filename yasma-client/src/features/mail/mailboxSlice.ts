import { createSlice } from '@reduxjs/toolkit'
import {Mbox, MboxPayload, MessageMetaData, MessageMetaDataPayload } from "@/types/mbox";

export const mailboxSlice = createSlice({
  name: 'mailbox',
  initialState: {
    currentMailbox: {
      id: '',
      name: '',
      type: '',
      messageListVisibility: '',
      labelListVisibility: '',
    },
    currentMessage: {
      MessageID: '',
      To: '',
      From: '',
      ReplyTo: '',
      DateTime: '',
      Subject: '',
    }
  },
  reducers: {
    setCurrentMailbox: (state, mailbox : MboxPayload) => {
      state.currentMailbox = <Mbox>mailbox.payload
    },
    setCurrentMessage: (state, message : MessageMetaDataPayload) => {
      state.currentMessage = <MessageMetaData>message.payload
    },
  },
})

export const { setCurrentMailbox, setCurrentMessage } = mailboxSlice.actions

export default mailboxSlice.reducer
