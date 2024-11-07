import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import EditorToolbar from "./EditorToolbarOptions/EditorToolbar";

interface EditorProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const Editor = ({ value, placeholder, onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    autofocus: false,
    immediatelyRender: false,
  });

  if (!editor) return <></>;

  return (
    <div className="prose max-w-none w-full border border-input bg-background dark:prose-invert p-2 rounded">
      <EditorToolbar editor={editor} />
      <div className="focus-visible:ring-0 focus:outline-none min-h-40">
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  );
};

export default Editor;
