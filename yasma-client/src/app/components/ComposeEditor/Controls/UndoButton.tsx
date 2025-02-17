import { RiArrowGoBackLine } from "react-icons/ri";
import React, { useCallback } from "react";
import { ToolbarProps } from "@/types/composer";
import { Button } from "./Button";

export function UndoButton({ editor }: ToolbarProps ) {
  const toggleControl = useCallback(() => {
    editor.chain().focus().undo().run()
  }, [editor]);

  return (
      <>
        <Button onClick={toggleControl} >
          <RiArrowGoBackLine/>
        </Button>
      </>
  );
}
