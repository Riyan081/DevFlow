import React from "react";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import QuestionForm from "@/components/forms/QuestionForm";
import { getQuestion } from "@/lib/actions/question.action";
import User from "@/database/user.model";

const EditQuestion = async ({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) => {
  const params = await paramsPromise;
  const session = await auth();
  if (!session) {
    console.error("No session found. Redirecting to sign-in.");
    return redirect("/sign-in");
  }

  const { id } = params;
  if (!id) {
    console.error("No question ID provided. Redirecting to home.");
    return redirect("/");
  }

  const { data: question, success } = await getQuestion({ questionId: id });
  if (!success || !question) {
    console.error("Question not found or fetch failed. Showing 404.");
    return notFound();
  }
  console.log("question.author:", question.author?.toString?.());
  console.log("session user id:", session?.user?.id);

  const dbUser = await (User as any).findOne({ email: session?.user?.email });
  if (!dbUser) {
    console.error("User not found in database. Redirecting to sign-in.");
    return redirect("/sign-in");
  }

if (question.author?._id?.toString() !== dbUser._id.toString()) {
  console.warn("User is not the author. Redirecting to question page.");
  return redirect(`/questions/${id}`);
}
  return (
    <main>
      <QuestionForm question={question} isEdit />
    </main>
  );
};

export default EditQuestion;