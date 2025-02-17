import { RiBold } from "react-icons/ri";
import React, {useCallback, useState} from "react";
import { ToolbarProps } from "@/types/composer";
import { Button } from "./Button";

export function BoldButton({ editor }: ToolbarProps ) {
  const [boldActive, setBoldActive] = useState(false);
  const toggleControl = useCallback(() => {
    editor.chain().focus().toggleBold().run();
    setBoldActive(editor.isActive('bold'));
  }, [editor]);

  return (
      <>
        <Button active={boldActive} onClick={toggleControl} >
          <RiBold/>
        </Button>
      </>
  );
}
