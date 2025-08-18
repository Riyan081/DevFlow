"use client";

import React, { useRef, useState } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Editor from "../editor";

const QuestionForm = () => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const [editorValue, setEditorValue] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Access the editor content
    const markdown = editorRef.current?.getMarkdown() || editorValue;
    console.log("Form Submitted:", { title, markdown, tags });
    // Add your form submission logic here (e.g., API call)
  };

  return (
    <form
      className="w-full  mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-0 mt-8 overflow-y-auto"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-base font-semibold text-gray-100 mb-1">
          Question Title <span className="text-orange-400">*</span>
        </label>
        <input
          className="bg-[#18181b] w-full h-11 rounded-md mt-1 px-3 text-sm text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Enter your question"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <p className="text-xs text-gray-400/80 mt-1">
          Be specific and imagine you are asking a question to another person.
        </p>
      </div>
      <div className="mt-7">
        <label className="block text-base font-semibold text-gray-100 mb-1">
          Detailed explanation of your problem <span className="text-orange-400">*</span>
        </label>
        <Editor
          value={editorValue}
          editorRef={editorRef}
          onChange={setEditorValue}
          markdown="" // Default empty markdown
          
        />
        <p className="text-xs text-gray-400/80 mt-1">
          Introduce the problem and expand on what you put in the title.
        </p>
      </div>
      <div className="mt-7">
        <label className="block text-base font-semibold text-gray-100 mb-1">
          Tags <span className="text-orange-400">*</span>
        </label>
        <input
          type="text"
          placeholder="Add tags..."
          className="bg-[#18181b] w-full h-11 rounded-md mt-1 px-3 text-sm text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          required
        />
        <p className="text-xs text-gray-400/80 mt-1">
          Add up to three tags to describe what your question is about. Press enter to add a tag.
        </p>
      </div>
      <div className="mt-7">
        <button
          type="submit"
          className="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-500 transition-colors"
        >
          Submit Question
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;