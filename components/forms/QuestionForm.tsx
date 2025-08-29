"use client";

import React, { useRef, useState } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../editor"), { ssr: false });
import TagCard from "../cards/TagCard";
import { createQuestion } from "@/lib/actions/question.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Question } from "@/types/global";
import { editQuestion } from "@/lib/actions/question.action";

const QuestionForm = ({question,isEdit=false}:{question?:Question, isEdit?:boolean}) => {
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null);
  const [editorValue, setEditorValue] = useState<string>(question?.content || "");
  const [title, setTitle] = useState<string>(question?.title || "");;
  const [tags, setTags] = useState<string[]>(question?.tags.map(tag => tag.name) || []);
  const [tagInput, setTagInput] = useState<string>("");
  const [tagError, setTagError] = useState<string>("");


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const markdown = editorRef.current?.getMarkdown() || editorValue;

  let result;
  if (isEdit && question) {
    result = await editQuestion({
      questionId: question._id,
      title,
      content: markdown,
      tags,
    });
  } else {
    result = await createQuestion({
      title,
      content: markdown,
      tags,
    });
  }

  if (result.success) {
    // Reset form only if creating
    if (!isEdit) {
      setTitle("");
      setEditorValue("");
      setTags([]);
      setTagInput("");
      setTagError("");
      if (editorRef.current) {
        editorRef.current.setMarkdown("");
      }
    }
    toast("Your question has been " + (isEdit ? "updated" : "posted") + " successfully.");
    router.push(`/questions/${result.data?._id}`);
  } else {
    toast.error(result.error || "Something went wrong");
  }
};



  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();

      if (newTag && newTag.length <= 15 && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput("");
        setTagError("");
      } else if (newTag.length > 15) {
        setTagError("Tag should be less than 15 characters");
      } else if (tags.includes(newTag)) {
        setTagError("Tag already exists");
      } else if (tags.length >= 5) {
        setTagError("Maximum 5 tags allowed");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    setTagError("");
  };

  return (
    <form
      className="w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-0 mt-8 overflow-y-auto"
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
        <div suppressHydrationWarning={true}>
          <Editor 
            value={editorValue}
            editorRef={editorRef}
            onChange={setEditorValue}
            markdown=""
          />
        </div>
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
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          required={tags.length === 0}
        />
        {tagError && (
          <p className="text-xs text-red-400 mt-1">{tagError}</p>
        )}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
             
                <TagCard key={tag} _id={tag} name={tag} removeTag={removeTag} isQuestionTag={true}/>
               
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400/80 mt-1">
          Add up to three tags to describe what your question is about. Press enter to add a tag.
        </p>
      </div>
      <div className="mt-7">
        <button
          type="submit"
          className="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-500 transition-colors mb-10"
        >
           {isEdit ? "Update Question" : "Submit Question"}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;