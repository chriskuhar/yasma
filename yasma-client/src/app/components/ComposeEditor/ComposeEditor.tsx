import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from '@tiptap/react'
import { ComposeEditorToolbar } from "./ComposeEditorToolbar";

type TiptapProps = {
    content?: string
    editable?: boolean
    placeholder?: string
    withToolbar?: boolean
    withPopover?: boolean
    withTypographyExtension?: boolean
    withLinkExtension?: boolean
    withCodeBlockLowlightExtension?: boolean
    withTaskListExtension?: boolean
    withPlaceholderExtension?: boolean
    withMentionSuggestion?: boolean
    withEmojiSuggestion?: boolean
    withEmojisReplacer?: boolean
    withHexColorsDecorator?: boolean
}

export function ComposeEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World! 🌎️</p>',
  })
  if(!editor) return null;

  return (
      <div className={`mt-9 ml-5 mr-5 flex flex-col`}>
        <div className="flex-none">
          <ComposeEditorToolbar editor={editor} />
        </div>
        <div className={`grow overflow-auto`}>
          <EditorContent editor={editor} />
        </div>
      </div>
  );
}
