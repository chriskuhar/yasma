import { RiParagraph } from "react-icons/ri";
import React, {useCallback, useState} from "react";
import { ToolbarProps } from "@/types/composer";
import { Button } from "./Button";
import styles from "@/app/components/ComposeEditor/Toolbar.module.css";

export function ParagraphButton({ editor }: ToolbarProps ) {
  const [paragraphActive, setParagraphActive] = useState(false);
  const toggleControl = useCallback(() => {
    editor.chain().focus().setParagraph().run();
    // TODO this is problematic, this inserts a paragraph, different semantic
    setParagraphActive(editor.isActive('paragraph'));
  }, [editor]);

  return (
      <>
        <Button active={paragraphActive} onClick={toggleControl}>
          <RiParagraph/>
        </Button>
      </>
  );
}
