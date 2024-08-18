import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface ViewerProps {
  value: string;
}

const EditorPreview = ({ value }: ViewerProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editable: false,
  });

  if (!editor) return <></>;

  return (
    <article>
      <EditorContent editor={editor} readOnly={true} />
    </article>
  );
};

export default EditorPreview;
