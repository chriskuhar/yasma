import { RiTextWrap } from "react-icons/ri";
import React, { useCallback } from "react";
import { ToolbarProps } from "@/types/composer";
import { Button } from "./Button";

export function WrapTextButton({ editor }: ToolbarProps ) {
  const toggleControl = useCallback(() => {
    editor.chain().focus().setHardBreak().run()
  }, [editor]);

  return (
      <>
        <Button onClick={toggleControl} >
          <RiTextWrap/>
        </Button>
      </>
  );
}
