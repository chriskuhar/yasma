import { RiLinkUnlink } from "react-icons/ri";
import React, {useCallback, useState} from "react";
import { ToolbarProps } from "@/types/composer";
import { Button } from "./Button";
import { setLink } from '@/app/components/ComposeEditor/helpers/set-link';

export function UnlinkButton({ editor }: ToolbarProps ) {
  const [linkActive, setLinkActive] = useState(false);
  const toggleControl = useCallback(() => {
    setLink(editor);
    setLinkActive(editor.isActive('link'));
  }, [editor]);

  return (
      <>
        <Button active={linkActive} onClick={toggleControl} >
          <RiLinkUnlink/>
        </Button>
      </>
  );
}
