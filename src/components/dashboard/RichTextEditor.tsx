"use client";

import { FC, useRef, useState } from "react";
import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Label } from "../ui/label";

interface RichTextEditorProps {
  label: string;
  value: string;
  isTouch: boolean | undefined;
  onChange: (value: string) => void;
  setError: (field: string, value: string | undefined) => void;
  setTouch: (field: string, value: boolean | undefined) => void;
}

const RichTextEditor: FC<RichTextEditorProps> = ({
  label,
  value,
  isTouch,
  onChange,
  setError,
  setTouch,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const ref = useRef<any>(null);

  const isEmpty = ref?.current?.unprivilegedEditor.getText().length === 1;

  const quillModules = {
    toolbar: [[{ header: [1, 2, 3] }], ["bold", "italic"]],
  };

  const handleFocus = () => {
    setTouch("content", true);
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (isEmpty) {
      setError("content", "Content is required");
    }
    setIsFocused(false);
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <Label className="text-lg font-semibold capitalize">{label}</Label>
      <QuillEditor
        modules={quillModules}
        value={value}
        onChange={onChange}
        className={`h-[300px] pb-16 ${
          isFocused ? "!border-black dark:!border-white" : ""
        }`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={ref}
      />

      {isEmpty && isTouch && (
        <p className="text-xs text-red-500">{label} is required</p>
      )}
    </div>
  );
};

export default RichTextEditor;
