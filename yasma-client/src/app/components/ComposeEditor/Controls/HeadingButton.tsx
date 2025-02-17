import { RiH1 } from "react-icons/ri";
import React, {useCallback, useState} from "react";
import { ToolbarProps } from "@/types/composer";
import { Button } from "./Button";

export function HeadingButton({ editor }: ToolbarProps ) {
  const [headingActive, setHeadingActive] = useState(false);
  const toggleControl = useCallback(() => {
    editor.chain().focus().toggleHeading({level: 1}).run();
    setHeadingActive(editor.isActive('heading', {level: 1}));
  }, [editor]);

  return (
      <>
        <Button active={headingActive} onClick={toggleControl} >
          <RiH1/>
        </Button>
      </>
  );
}
