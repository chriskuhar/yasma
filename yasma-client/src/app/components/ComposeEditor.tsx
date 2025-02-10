import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from '@tiptap/react'
import { ComposeEditorToolbar } from "@/app/components/ComposeEditorToolbar";


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
  console.log(`XDEBUG Compose Editor`);

  return (
      <>
        <ComposeEditorToolbar editor={editor} />
        <EditorContent editor={editor} />
      </>
  );
}
