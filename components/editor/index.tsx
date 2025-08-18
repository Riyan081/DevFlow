"use client";
//npm install cm6-theme-basic-dark
import React, { ForwardedRef } from "react";
import { basicDark } from "cm6-theme-basic-dark";
import "@mdxeditor/editor/style.css";
import "./dark-editor.css";
import { useTheme } from "next-themes";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  linkPlugin,
  MDXEditor,
  MDXEditorMethods,
  MDXEditorProps,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  CodeToggle,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  linkDialogPlugin,
  tablePlugin,
  imagePlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor";
import { Bold } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";


// Define props interface for type safety
interface EditorProps extends MDXEditorProps {
  value: string;
  editorRef: ForwardedRef<MDXEditorMethods> | null;
}

const Editor = ({ editorRef, value, onChange }: EditorProps) => {
  const {resolvedTheme} = useTheme();
  const theme = resolvedTheme ==="dark" ? [basicDark]:[];
  return (
    <div className="relative">
      <MDXEditor
      key={resolvedTheme}
        ref={editorRef}
        markdown={value}
        onChange={onChange}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          tablePlugin(),
          imagePlugin(),

          codeBlockPlugin(),
      codeMirrorPlugin({
        codeBlockLanguages: { js: "JavaScript", ts: "TypeScript", python: "Python" , css:"css", txt:"txt",sql:"sql",html:"html",saas:"saas",scss:"scss",bash:"bash",json:"json", "":"unspecified", tsx:"TypeScript (React)", jsx:"JavaScript (React)"},
        codeMirrorExtensions: theme,
        autoLoadLanguageSupport: true,
      }),
      diffSourcePlugin({viewMode:"rich-text", diffMarkdown:""}),
          linkPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <div className="custom-toolbar text-gray-100 p-1 flex gap-1">
             <ConditionalContents
             options={[
              {
                when:(editor)=>editor?.editorType ==="codeblock",
                contents: () => <ChangeCodeMirrorLanguage/>
              },{
                fallback:()=>(
                  <>
                  <UndoRedo/>
                   <BoldItalicUnderlineToggles/>
                   <ListsToggle/>
                   <Separator/>
                   <CreateLink/>
                   <InsertImage/>
                   <Separator/>
                   <InsertTable/>
                   <InsertThematicBreak/>
                   <InsertCodeBlock/>
                  </>
                )
              }
             ]}
             />
             </div>
            ),
          }),
        ]}
        contentEditableClassName="bg-[#18181b] dark-editor   !text-gray-100 border border-gray-700 rounded-b-md p-3 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-orange-400 prose prose-invert"
      />
     
    </div>
  );
};

export default Editor;