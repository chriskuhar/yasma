import { RiListOrdered } from "react-icons/ri";
import React, {useCallback, useState} from "react";
import { ToolbarProps } from "@/types/composer";
import { Button } from "./Button";

export function ListOrderedButton({ editor }: ToolbarProps ) {
  const [listOrderedActive, setListOrderedActive] = useState(false);
  const toggleControl = useCallback(() => {
    editor.chain().focus().toggleOrderedList().run();
    setListOrderedActive(editor.isActive('ordered-list'));
  }, [editor]);

  return (
      <>
        <Button active={listOrderedActive} onClick={toggleControl} >
          <RiListOrdered/>
        </Button>
      </>
  );
}
