import { RiSeparator } from "react-icons/ri";
import React, { useCallback } from "react";
import { ToolbarProps } from "@/types/composer";
import { Button } from "./Button";

export function HorizontalRuleButton({ editor }: ToolbarProps ) {
  const toggleControl = useCallback(() => {
    editor.chain().focus().setHorizontalRule().run()
  }, [editor]);

  return (
      <>
        <Button onClick={toggleControl} >
          <RiSeparator/>
        </Button>
      </>
  );
}
