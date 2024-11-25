"use client";

import React from "react";

import {
  BoldItalicUnderlineToggles,
  MDXEditor,
  MDXEditorMethods,
  UndoRedo,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import { FC } from "react";
import "@/styles/markdown-editor.css";
import { ScrollShadow } from "@nextui-org/react";
// import '@mdxeditor/editor/style.css';

interface EditorProps {
  markdown: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
  onChange?: (value: string) => void;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const MarkdownEditor: FC<EditorProps> = ({ markdown, editorRef, onChange }) => {
  return (
    <ScrollShadow
      hideScrollBar
      isEnabled={false}
      orientation="vertical"
      className="w-content h-[300px] border-medium border-default-200 data-[hover=true]:border-default-400 group-data-[focus=true]:border-default-foreground rounded-medium"
    >
      <MDXEditor
        onChange={onChange}
        ref={editorRef}
        className="bg-content1 rounded-lg"
        markdown={markdown}
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <div className="bg-content2 rounded-lg p-1 w-full flex items-center gap-1 justify-between">
                <div className="flex gap-1">
                  <BoldItalicUnderlineToggles />
                </div>
                <UndoRedo />
              </div>
            ),
          }),
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
        ]}
      />
    </ScrollShadow>
  );
};

export default MarkdownEditor;
