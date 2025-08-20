import { Mbox } from "@/types/mbox";

function useFilterMailboxes() {
  const LABEL_SHOW = 'labelShow';
  const filterMailboxes = (list: Mbox[]): Mbox[] => {
    const filtered: Mbox[] = [];
    for (const mailbox of list) {
      if(filter(mailbox)) {
        filtered.push(mailbox);
      }
    }
    return filtered;
  }

  const filter = (mbox: Mbox): boolean => {
    // Always exclude mailboxes with [Imap]/ prefix
    if(mbox.name.toUpperCase().indexOf('[Imap]/'.toUpperCase()) >= 0) {
      return false;
    }

    // Always exclude mailboxes with CATEGORY_ prefix
    if(mbox.name.toUpperCase().indexOf('CATEGORY_'.toUpperCase()) >= 0) {
      return false;
    }

    // Only include mailboxes with labelListVisibility set to labelShow (case insensitive)
    if(mbox.labelListVisibility && mbox.labelListVisibility.toLowerCase() === LABEL_SHOW.toLowerCase()) {
      return true;
    }

    // Exclude all other mailboxes
    return false;
  }

  return { filterMailboxes };
}

export default useFilterMailboxes;
