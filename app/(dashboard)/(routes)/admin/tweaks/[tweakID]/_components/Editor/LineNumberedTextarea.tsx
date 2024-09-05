"use client";
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LineNumberedTextareaProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  className?: string;
}

export default function LineNumberedTextarea({
  value,
  onChange,
  className,
  isEditing,
}: LineNumberedTextareaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const onScroll = () => {
    if (lineNumbersRef.current && textAreaRef.current) {
      lineNumbersRef.current.scrollTop = textAreaRef.current.scrollTop;
    }
  };

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.addEventListener("scroll", onScroll);
      return () => {
        textarea.removeEventListener("scroll", onScroll);
      };
    }
  }, [textAreaRef]);

  const onRenderLineNumbers = () => {
    const lines = value.split("\n").map((_, i) => (
      <p key={i + 1} className="text-right pr-2">
        {i + 1}
      </p>
    ));
    return lines;
  };

  return (
    <div className="mb-2 mt-2 relative flex max-h-[75vh] min-h-[75vh]">
      {!isEditing ? (
        <div
          id="highlighted-content"
          className="w-full cursor-default overflow-scroll whitespace-pre-wrap p-2 text-sm"
        >
          {value.split("\n").map((line, index) => {
            const isPath = line.trim().startsWith("[");
            return (
              <div key={index} className="flex">
                <span className="text-muted text-sm pr-4">{index + 1}</span>
                <span
                  className={cn(
                    "text-muted-foreground",
                    isPath ? "font-bold" : "font-normal"
                  )}
                >
                  {line}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {/* Textarea */}
          <textarea
            ref={textAreaRef}
            value={value}
            spellCheck={false}
            onChange={onInputChange}
            className={cn(
              "flex-grow border-none max-h-[75vh] bg-transparent min-h-[75vh] text-muted-foreground text-sm h-full w-full focus-visible:ring-0 focus-visible:outline-none resize-none",
              className
            )}
          />
        </>
      )}
    </div>
  );
}
