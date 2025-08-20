import { renderHook } from '@testing-library/react';
import useFilterMailboxes from '../UseFilterMailboxes';
import { Mbox } from '@/types/mbox';

describe('useFilterMailboxes', () => {
  let hook: ReturnType<typeof useFilterMailboxes>;
  const LABEL_SHOW = 'labelShow';

  beforeEach(() => {
    const { result } = renderHook(() => useFilterMailboxes());
    hook = result.current;
  });

  describe('filterMailboxes', () => {
    it('should filter out mailboxes with [Imap]/ prefix', () => {
      const mailboxes: Mbox[] = [
        { id: '1', name: 'Inbox', type: 'inbox', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '2', name: '[Imap]/Trash', type: 'trash', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '3', name: 'Sent', type: 'sent', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '4', name: '[Imap]/Drafts', type: 'drafts', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
      ];

      const result = hook.filterMailboxes(mailboxes);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: '1', name: 'Inbox', type: 'inbox', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '3', name: 'Sent', type: 'sent', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
      ]);
    });

    it('should filter out mailboxes with CATEGORY_ prefix', () => {
      const mailboxes: Mbox[] = [
        { id: '1', name: 'Inbox', type: 'inbox', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '2', name: 'CATEGORY_PERSONAL', type: 'category', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '3', name: 'Sent', type: 'sent', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '4', name: 'CATEGORY_WORK', type: 'category', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
      ];

      const result = hook.filterMailboxes(mailboxes);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: '1', name: 'Inbox', type: 'inbox', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '3', name: 'Sent', type: 'sent', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
      ]);
    });

    it('should include mailboxes with labelListVisibility set to labelShow (case insensitive)', () => {
      const mailboxes: Mbox[] = [
        { id: '1', name: 'Inbox', type: 'inbox', messageListVisibility: '', labelListVisibility: 'labelShow' },
        { id: '2', name: 'Trash', type: 'trash', messageListVisibility: '', labelListVisibility: 'hide' },
        { id: '3', name: 'Sent', type: 'sent', messageListVisibility: '', labelListVisibility: 'LABELSHOW' },
        { id: '4', name: 'Drafts', type: 'drafts', messageListVisibility: '', labelListVisibility: 'LabelShow' },
      ];

      const result = hook.filterMailboxes(mailboxes);

      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { id: '1', name: 'Inbox', type: 'inbox', messageListVisibility: '', labelListVisibility: 'labelShow' },
        { id: '3', name: 'Sent', type: 'sent', messageListVisibility: '', labelListVisibility: 'LABELSHOW' },
        { id: '4', name: 'Drafts', type: 'drafts', messageListVisibility: '', labelListVisibility: 'LabelShow' },
      ]);
    });

    it('should handle empty mailbox list', () => {
      const mailboxes: Mbox[] = [];

      const result = hook.filterMailboxes(mailboxes);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('should handle mixed filtering conditions', () => {
      const mailboxes: Mbox[] = [
        { id: '1', name: 'Inbox', type: 'inbox', messageListVisibility: '', labelListVisibility: 'labelShow' },
        { id: '2', name: '[Imap]/Trash', type: 'trash', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '3', name: 'CATEGORY_PERSONAL', type: 'category', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '4', name: 'Sent', type: 'sent', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '5', name: 'Drafts', type: 'drafts', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '6', name: 'CATEGORY_WORK', type: 'category', messageListVisibility: '', labelListVisibility: 'labelShow' },
      ];

      const result = hook.filterMailboxes(mailboxes);

      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { id: '1', name: 'Inbox', type: 'inbox', messageListVisibility: '', labelListVisibility: 'labelShow' },
        { id: '4', name: 'Sent', type: 'sent', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '5', name: 'Drafts', type: 'drafts', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
      ]);
    });

    it('should handle mailboxes with undefined or null properties', () => {
      const mailboxes: Mbox[] = [
        { id: '1', name: 'Inbox', type: 'inbox', messageListVisibility: '', labelListVisibility: '' },
        { id: '2', name: 'Trash', type: 'trash', messageListVisibility: '', labelListVisibility: undefined as never },
        { id: '3', name: 'Sent', type: 'sent', messageListVisibility: '', labelListVisibility: null as never },
      ];

      const result = hook.filterMailboxes(mailboxes);

      expect(result).toHaveLength(0);
      // labelListVisibility defaults to hidden if undefined or null
      expect(result).toEqual([]);
      //expect(result).toEqual(mailboxes);
    });

    it('should handle case sensitivity in name filtering', () => {
      const mailboxes: Mbox[] = [
        { id: '1', name: 'Inbox', type: 'inbox', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '2', name: '[IMAP]/Trash', type: 'trash', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '3', name: 'category_PERSONAL', type: 'category', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '4', name: 'CATEGORY_work', type: 'category', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
      ];

      const result = hook.filterMailboxes(mailboxes);

      expect(result).toHaveLength(1);
      expect(result).toEqual([
        { id: '1', name: 'Inbox', type: 'inbox', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
      ]);
    });
  });

  describe('edge cases', () => {
    it('should handle mailboxes with empty names', () => {
      const mailboxes: Mbox[] = [
        { id: '1', name: '', type: 'inbox', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '2', name: 'Inbox', type: 'inbox', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
      ];

      const result = hook.filterMailboxes(mailboxes);

      expect(result).toHaveLength(2);
      expect(result).toEqual(mailboxes);
    });

    it('should handle mailboxes with special characters in names', () => {
      const mailboxes: Mbox[] = [
        { id: '1', name: 'Inbox', type: 'inbox', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '2', name: '[Imap]/Trash & Bin', type: 'trash', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '3', name: 'CATEGORY_Important!', type: 'category', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '4', name: 'Sent Items', type: 'sent', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
      ];

      const result = hook.filterMailboxes(mailboxes);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: '1', name: 'Inbox', type: 'inbox', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
        { id: '4', name: 'Sent Items', type: 'sent', messageListVisibility: '', labelListVisibility: LABEL_SHOW },
      ]);
    });
  });
});

