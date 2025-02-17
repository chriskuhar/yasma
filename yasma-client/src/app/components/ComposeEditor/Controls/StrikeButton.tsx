import { RiStrikethrough } from "react-icons/ri";
import React, {useCallback, useState} from "react";
import { ToolbarProps } from "@/types/composer";
import { Button } from "./Button";

export function StrikeButton({ editor }: ToolbarProps ) {
  const [strikeActive, setStrikeActive] = useState(false);
  const toggleControl = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
    setStrikeActive(editor.isActive('strike'));
  }, [editor]);

  return (
      <>
        <Button active={strikeActive} onClick={toggleControl} >
          <RiStrikethrough/>
        </Button>
      </>
  );
}
