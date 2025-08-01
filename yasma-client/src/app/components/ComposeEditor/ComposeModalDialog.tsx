import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { Editor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor'
import FileHandler from '@tiptap/extension-file-handler'
import { ComposeEditorToolbar } from "@/app/components/ComposeEditor/ComposeEditorToolbar";
import { useForm, SubmitHandler } from "react-hook-form"
import useApi from "@/hooks/UseApi";
import { useMailStore } from "@/stores/mail-store";

interface IFormInput {
  subject: string
  recipients: string
}

export function ComposeModalDialog() {
  const setComposeModalDialogOpen = useMailStore((state) => state.setComposeModalDialogOpen);
  const { newMessage } = useApi();
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm<IFormInput>();
  const curOpenState = useMailStore((state) => state.composeDialogState.composeModalDialogOpen);
  const handleClose = async () => {
    reset();
    setComposeModalDialogOpen(false);
    editor.destroy();

  }
  const editor = new Editor({
    //extensions: [StarterKit, Paragraph],
    extensions: [
      StarterKit,
      Image,
      Dropcursor,
      FileHandler.configure({
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        onDrop: (currentEditor, files, pos) => {
          files.forEach(file => {
            const fileReader = new FileReader()

            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
              currentEditor.chain().insertContentAt(pos, {
                type: 'image',
                attrs: {
                  src: fileReader.result,
                },
              }).focus().run()
            }
          })
        },
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach(file => {
            if (htmlContent) {
              // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
              // you could extract the pasted file from this url string and upload it to a server for example
              return false
            }

            const fileReader = new FileReader()

            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
              currentEditor.chain().insertContentAt(currentEditor.state.selection.anchor, {
                type: 'image',
                attrs: {
                  src: fileReader.result,
                },
              }).focus().run()
            }
          })
        },
      }),
    ],
    content: '<p>Hello World <b>Bold</b> Today! 🌎️</p>',
  })
  if(!editor) return null;

  // TODO get HTML
  // editor.getHTML()

  const handleSend: SubmitHandler<IFormInput> = async (data) => {
    const result: string = await newMessage(editor.getHTML(), data.recipients, data.subject);
    if(result?.message === 'Success') {
      reset();
      setComposeModalDialogOpen(false);
      editor.destroy();
    }
  }

  return (
      <div>
        <Dialog open={curOpenState} handler={handleClose} size="md" className={`h-1/2 flex flex-col`}>
          <DialogBody className={`grow overflow-y-auto`}>
            <form
                id={`messageForm`}
                className="mt-0 mb-2"
                onSubmit={handleSubmit(handleSend)}
            >
              <div className="flex flex-col h-full">
                <Input
                    {...register("recipients", {required: 'At least one recipient is required', min: 5, max: 256})}
                    label="To:"
                    size="md"
                    type="email"
                    variant="standard"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                />
                {errors.recipients && <span className="text-red-900">{errors.recipients.message}</span>}
                <Input
                    {...register("subject", {required: 'Subject is required', max: 256})}
                    label="Subject:"
                    type="text"
                    size="md"
                    variant="standard"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                />
                {errors.subject && <span className="text-red-900">{errors.subject.message}</span>}
                <div className="mb-0 mt-9 ml-5 mr-5 flex flex-col h-80">
                  <ComposeEditorToolbar editor={editor}/>
                  <div className="overflow-y-auto">
                    <EditorContent editor={editor}/>
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
                form={`messageForm`}
            >
              <span>Cancel</span>
            </Button>
            <Button
                variant="gradient"
                color="green"
                type="submit"
                form={`messageForm`}
            >
              <span>Send</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
  );
}
