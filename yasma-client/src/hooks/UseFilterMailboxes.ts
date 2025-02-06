import { Mbox } from "@/types/mbox";
import {list} from "postcss";

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
    console.log(mbox.name)
    if(mbox.name.indexOf('[Imap]/') >= 0) {
      return false
    }
    else if(mbox.labelListVisibility && mbox.labelListVisibility.toLocaleLowerCase() === LABEL_SHOW.toLowerCase()) {
      return true;
    }
    else if(mbox.name.indexOf('CATEGORY_') >= 0) {
      return false
    }

    return true;
  }

  return { filterMailboxes };
}

export default useFilterMailboxes;
