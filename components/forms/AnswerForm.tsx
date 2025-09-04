"use client";

import React, { useRef, useState, useTransition } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { AnswerSchema } from "@/lib/validations";
import { createAnswer } from "@/lib/actions/answer.action";
import Image from "next/image";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";

const Editor = dynamic(() => import("../editor"), { ssr: false });

// ✅ Helper: auto-wrap code if looks like raw code
function autoFenceIfLooksLikeCode(input: string) {
  const looksLikeCode = /^\s*(import|export|const|let|var|function|class|interface)\b/m.test(
    input
  );

  // Wrap if looks like code and isn’t already fenced
  if (looksLikeCode && !input.trim().startsWith("")) {
    return "tsx\n" + input.trim() + "\n```";
  }

  return input;
}

const AnswerForm = ({ questionId, questionTitle, questionContent }: { questionId: string, questionTitle: string, questionContent: string }) => {

  console.log("=== AnswerForm Props ===");
  console.log("questionId:", questionId);
  console.log("questionTitle:", questionTitle);
  console.log("questionContent:", questionContent);
  console.log("questionTitle length:", questionTitle?.length);
  console.log("questionContent length:", questionContent?.length);
  
  const editorRef = useRef<MDXEditorMethods>(null);
  const [editorValue, setEditorValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const [isAnswer, startAnsweringTransition] = useTransition();
  const session = useSession();

  // Dummy AI handler
 const handleAIGenerate = async () => {
  if(session.status !== "authenticated") {
    toast.error("You must be logged in to use AI generation.");
    return;
  }
  
  setIsAISubmitting(true);
  
  try {
    // Direct fetch instead of using api.ai.getAnswer
    const response = await fetch('/api/ai/answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: questionTitle,
        content: questionContent
      })
    });

    const result = await response.json();
    console.log("Direct fetch result:", result);

    if(!result.success){
      toast.error(`Failed to generate AI answer: ${result.error || 'Unknown error'}`);
      return;
    }

    let formattedAnswer = result.data.replace(/<br>/g," ").toString().trim();
    formattedAnswer = autoFenceIfLooksLikeCode(formattedAnswer);
    
    if(editorRef.current){
      editorRef.current.setMarkdown(formattedAnswer);
      setEditorValue(formattedAnswer);
    }

    toast.success("AI answer generated. Please review and submit.");

  } catch(error){
    console.error("Direct fetch error:", error);
    toast.error("Failed to generate AI answer.");
  } finally{
    setIsAISubmitting(false);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    startAnsweringTransition(async () => {
      e.preventDefault();
      setError("");

      let markdown = editorRef.current?.getMarkdown() || editorValue;
      markdown = autoFenceIfLooksLikeCode(markdown);

      if (!AnswerSchema.safeParse({ content: markdown }).success) {
        setError("Answer must be at least 30 characters long.");
        return;
      }
      if (!markdown.trim()) {
        setError("Answer cannot be empty.");
        return;
      }

      setLoading(true);
      try {
        const result = await createAnswer({
          questionId,
          content: markdown,
        });
        if (result.success) {
          toast("Answer posted successfully!");
        }

        setEditorValue("");
        if (editorRef.current) {
          editorRef.current.setMarkdown("");
        }
      } catch (err) {
        setError("Failed to post answer.");
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className="w-full mx-auto">
      <h4 className="text-lg font-semibold mb-4">Write Your Answer Here</h4>
      <button
        type="button"
        className="mt-2 mb-6 w-full flex items-center justify-center gap-2 bg-[#0D1117] hover:bg-gray-700 text-orange-400 px-4 py-2 rounded transition disabled:opacity-50"
        disabled={loading || isAISubmitting}
        onClick={handleAIGenerate}
      >
        {isAISubmitting ? (
          "Generating..."
        ) : (
          <>
            <Image
              src="/icons/stars.svg"
              alt="Generate Ai Answer"
              width={16}
              height={16}
              className="object-contain"
            />
            Generate AI Answer
          </>
        )}
      </button>
      <form onSubmit={handleSubmit}>
        <Editor
          value={editorValue}
          editorRef={editorRef}
          onChange={setEditorValue}
          markdown=""
        />
        {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Post Answer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;