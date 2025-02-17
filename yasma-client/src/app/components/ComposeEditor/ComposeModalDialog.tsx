import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { AppStore } from "@/lib/store";
import { useDispatch } from "react-redux";
import { setComposeModalDialogOpen } from "@/features/mail/mailboxSlice";
import { Editor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ComposeEditorToolbar } from "@/app/components/ComposeEditor/ComposeEditorToolbar";
import Paragraph from '@tiptap/extension-paragraph'


// define your extension array

export function ComposeModalDialog() {
  const curOpenState = useSelector((state : AppStore) => state?.mailbox?.composeModalDialogOpen);
  const dispatch = useDispatch()
  const handleClose = () => {
    dispatch(setComposeModalDialogOpen(false));
    editor.destroy();
  }
  const editor = new Editor({
    extensions: [StarterKit, Paragraph],
    content: '<p>Hello World <b>Bold</b> Today! 🌎️</p>',
  })
  if(!editor) return null;

  // TODO get HTML
  // editor.getHTML()
  // TODO cleanup
  //editor.destroy()



  return (
      <div>
        <Dialog open={curOpenState} handler={handleClose} size="md" className={`h-1/2 flex flex-col`}>
          <DialogBody className={`grow overflow-y-auto`}>
            <form className="mt-0 mb-2">
              <div className="flex flex-col h-full">
                <Input
                    label="To:"
                    size="md"
                    variant="standard"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                />
                <Input
                    label="Subject:"
                    size="md"
                    variant="standard"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                />
                <div className="mb-0 mt-9 ml-5 mr-5 flex flex-col h-80">
                  <ComposeEditorToolbar editor={editor}/>
                  <div className="overflow-y-auto">
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </div>
            </form>
          </DialogBody>
          <DialogFooter className={`flex-none`}>
            <Button
                variant="text"
                color="red"
                onClick={handleClose}
                className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="green" onClick={handleClose}>
              <span>Send</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
  );
}
