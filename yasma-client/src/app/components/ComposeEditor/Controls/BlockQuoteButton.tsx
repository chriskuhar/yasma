import { RiDoubleQuotesL } from "react-icons/ri";
import React, {useCallback, useState} from "react";
import { ToolbarProps } from "@/types/composer";
import { Button } from "./Button";

export function BlockQuoteButton({ editor }: ToolbarProps ) {

  const [blockQuoteActive, setBlockQuoteActive] = useState(false);
  const toggleControl = useCallback(() => {
    editor.chain().focus().toggleBlockQuote().run();
    setBlockQuoteActive(editor.isActive('blockQuote'));
  }, [editor]);

  return (
      <>
        <Button active={blockQuoteActive} onClick={toggleControl} >
          <RiDoubleQuotesL/>
        </Button>
      </>
  );
}
