import { renderHook, act } from '@testing-library/react';
import { useMailStore } from '../mail-store';
import { Mbox } from '@/types/mbox';

describe('mail-store', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useMailStore());
    act(() => {
      result.current.setCurrentMailbox({
        id: '',
        name: '',
        type: '',
        messageListVisibility: '',
        labelListVisibility: '',
      });
      result.current.setCurrentMessage({
        MessageID: '',
        To: '',
        From: '',
        ReplyTo: '',
        DateTime: '',
        Subject: '',
      });
      result.current.setComposeModalDialogOpen(false);
    });
  });

  describe('initial state', () => {
    it('should have correct initial mailbox state', () => {
      const { result } = renderHook(() => useMailStore());
      
      expect(result.current.mailboxState).toEqual({
        id: '',
        name: '',
        type: '',
        messageListVisibility: '',
        labelListVisibility: '',
      });
    });

    it('should have correct initial message state', () => {
      const { result } = renderHook(() => useMailStore());
      
      expect(result.current.messageState).toEqual({
        MessageID: '',
        To: '',
        From: '',
        ReplyTo: '',
        DateTime: '',
        Subject: '',
      });
    });

    it('should have correct initial compose dialog state', () => {
      const { result } = renderHook(() => useMailStore());
      
      expect(result.current.composeDialogState).toEqual({
        composeModalDialogOpen: false,
      });
    });

    it('should have correct initial user state', () => {
      const { result } = renderHook(() => useMailStore());
      
      expect(result.current.userState).toEqual({
        firstName: '',
        lastName: '',
      });
    });
  });

  describe('setCurrentMailbox', () => {
    it('should update mailbox state correctly', () => {
      const { result } = renderHook(() => useMailStore());
      
      const newMailbox: Mbox = {
        id: 'test-id',
        name: 'Test Mailbox',
        type: 'inbox',
        messageListVisibility: 'visible',
        labelListVisibility: 'hidden',
      };

      act(() => {
        result.current.setCurrentMailbox(newMailbox);
      });

      expect(result.current.mailboxState).toEqual(newMailbox);
    });

    it('should update only mailbox state, leaving other states unchanged', () => {
      const { result } = renderHook(() => useMailStore());
      
      const originalMessageState = result.current.messageState;
      const originalComposeState = result.current.composeDialogState;
      const originalUserState = result.current.userState;

      const newMailbox: Mbox = {
        id: 'test-id',
        name: 'Test Mailbox',
        type: 'inbox',
        messageListVisibility: 'visible',
        labelListVisibility: 'hidden',
      };

      act(() => {
        result.current.setCurrentMailbox(newMailbox);
      });

      expect(result.current.mailboxState).toEqual(newMailbox);
      expect(result.current.messageState).toEqual(originalMessageState);
      expect(result.current.composeDialogState).toEqual(originalComposeState);
      expect(result.current.userState).toEqual(originalUserState);
    });
  });

  describe('setCurrentMessage', () => {
    it('should update message state correctly', () => {
      const { result } = renderHook(() => useMailStore());
      
      const newMessage = {
        MessageID: 'msg-123',
        To: 'recipient@example.com',
        From: 'sender@example.com',
        ReplyTo: 'reply@example.com',
        DateTime: '2023-12-25T10:30:00Z',
        Subject: 'Test Subject',
      };

      act(() => {
        result.current.setCurrentMessage(newMessage);
      });

      expect(result.current.messageState).toEqual(newMessage);
    });

    it('should update only message state, leaving other states unchanged', () => {
      const { result } = renderHook(() => useMailStore());
      
      const originalMailboxState = result.current.mailboxState;
      const originalComposeState = result.current.composeDialogState;
      const originalUserState = result.current.userState;

      const newMessage = {
        MessageID: 'msg-123',
        To: 'recipient@example.com',
        From: 'sender@example.com',
        ReplyTo: 'reply@example.com',
        DateTime: '2023-12-25T10:30:00Z',
        Subject: 'Test Subject',
      };

      act(() => {
        result.current.setCurrentMessage(newMessage);
      });

      expect(result.current.messageState).toEqual(newMessage);
      expect(result.current.mailboxState).toEqual(originalMailboxState);
      expect(result.current.composeDialogState).toEqual(originalComposeState);
      expect(result.current.userState).toEqual(originalUserState);
    });
  });

  describe('setComposeModalDialogOpen', () => {
    it('should update compose dialog state to open', () => {
      const { result } = renderHook(() => useMailStore());
      
      act(() => {
        result.current.setComposeModalDialogOpen(true);
      });

      expect(result.current.composeDialogState.composeModalDialogOpen).toBe(true);
    });

    it('should update compose dialog state to closed', () => {
      const { result } = renderHook(() => useMailStore());
      
      // First open it
      act(() => {
        result.current.setComposeModalDialogOpen(true);
      });
      
      // Then close it
      act(() => {
        result.current.setComposeModalDialogOpen(false);
      });

      expect(result.current.composeDialogState.composeModalDialogOpen).toBe(false);
    });

    it('should update only compose dialog state, leaving other states unchanged', () => {
      const { result } = renderHook(() => useMailStore());
      
      const originalMailboxState = result.current.mailboxState;
      const originalMessageState = result.current.messageState;
      const originalUserState = result.current.userState;

      act(() => {
        result.current.setComposeModalDialogOpen(true);
      });

      expect(result.current.composeDialogState.composeModalDialogOpen).toBe(true);
      expect(result.current.mailboxState).toEqual(originalMailboxState);
      expect(result.current.messageState).toEqual(originalMessageState);
      expect(result.current.userState).toEqual(originalUserState);
    });
  });

  describe('state isolation', () => {
    it('should maintain separate state instances for different components', () => {
      const { result: result1 } = renderHook(() => useMailStore());
      const { result: result2 } = renderHook(() => useMailStore());

      const newMailbox: Mbox = {
        id: 'test-id',
        name: 'Test Mailbox',
        type: 'inbox',
        messageListVisibility: 'visible',
        labelListVisibility: 'hidden',
      };

      act(() => {
        result1.current.setCurrentMailbox(newMailbox);
      });

      // Both should reflect the same state (shared store)
      expect(result1.current.mailboxState).toEqual(newMailbox);
      expect(result2.current.mailboxState).toEqual(newMailbox);
    });
  });

  describe('complex state updates', () => {
    it('should handle multiple state updates correctly', () => {
      const { result } = renderHook(() => useMailStore());
      
      const newMailbox: Mbox = {
        id: 'test-id',
        name: 'Test Mailbox',
        type: 'inbox',
        messageListVisibility: 'visible',
        labelListVisibility: 'hidden',
      };

      const newMessage = {
        MessageID: 'msg-123',
        To: 'recipient@example.com',
        From: 'sender@example.com',
        ReplyTo: 'reply@example.com',
        DateTime: '2023-12-25T10:30:00Z',
        Subject: 'Test Subject',
      };

      act(() => {
        result.current.setCurrentMailbox(newMailbox);
        result.current.setCurrentMessage(newMessage);
        result.current.setComposeModalDialogOpen(true);
      });

      expect(result.current.mailboxState).toEqual(newMailbox);
      expect(result.current.messageState).toEqual(newMessage);
      expect(result.current.composeDialogState.composeModalDialogOpen).toBe(true);
    });
  });
});

