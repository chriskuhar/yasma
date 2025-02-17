import { RiListUnordered } from "react-icons/ri";
import React, {useCallback, useState} from "react";
import { ToolbarProps } from "@/types/composer";
import { Button } from "./Button";

export function ListBulletButton({ editor }: ToolbarProps ) {
  const [listBulletActive, setListBulletActive] = useState(false);
  const toggleControl = useCallback(() => {
    editor.chain().focus().toggleBulletList().run();
    setListBulletActive(editor.isActive('ordered-list'));
  }, [editor]);

  return (
      <>
        <Button active={listBulletActive} onClick={toggleControl} >
          <RiListUnordered/>
        </Button>
      </>
  );
}
