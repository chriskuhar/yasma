import { RiItalic } from "react-icons/ri";
import React, {useCallback, useState} from "react";
import { ToolbarProps } from "@/types/composer";
import { Button } from "./Button";

export function ItalicButton({ editor }: ToolbarProps ) {
  const [italicActive, setItalicActive] = useState(false);
  const toggleControl = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
    setItalicActive(editor.isActive('italic'));
  }, [editor]);

  return (
      <>
        <Button active={italicActive} onClick={toggleControl} >
          <RiItalic/>
        </Button>
      </>
  );
}
