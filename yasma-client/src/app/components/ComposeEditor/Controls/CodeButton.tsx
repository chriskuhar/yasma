import { RiCodeSSlashLine } from "react-icons/ri";
import React, {useCallback, useState} from "react";
import { ToolbarProps } from "@/types/composer";
import { Button } from "./Button";

export function CodeButton({ editor }: ToolbarProps ) {
  const [codeActive, setCodeActive] = useState(false);
  const toggleControl = useCallback(() => {
    editor.chain().focus().toggleCode().run();
    setCodeActive(editor.isActive('code'));
  }, [editor]);

  return (
      <>
        <Button active={codeActive} onClick={toggleControl} >
          <RiCodeSSlashLine/>
        </Button>
      </>
  );
}
