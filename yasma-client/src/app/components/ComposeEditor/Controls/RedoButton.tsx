import { RiArrowGoForwardLine } from "react-icons/ri";
import React, { useCallback } from "react";
import { ToolbarProps } from "@/types/composer";
import { Button } from "./Button";

export function RedoButton({ editor }: ToolbarProps ) {
  const toggleControl = useCallback(() => {
    editor.chain().focus().redo().run()
  }, [editor]);

  return (
      <>
        <Button onClick={toggleControl} >
          <RiArrowGoForwardLine/>
        </Button>
      </>
  );
}
