import React from "react";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import QuestionForm from "@/components/forms/QuestionForm";
import { getQuestion } from "@/lib/actions/question.action";
// import { User } from 'lucide-react';
import User from "@/database/user.model";

const EditQuestion = async ({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) => {
  const params = await paramsPromise;
  const session = await auth();
  if (!session) return redirect("/sign-in");

  const { id } = params;
  if (!id) return redirect("/");

  const { data: question, success } = await getQuestion({ questionId: id });
  if (!success || !question) return notFound();
  console.log("question.author:", question.author.toString());
  console.log("session user id:", session?.user?.id);

  const dbUser = await User.findOne({ email: session?.user?.email });
  if (!dbUser) return redirect("/sign-in");

  if (question.author.toString() !== dbUser._id.toString())
    return redirect(`/questions/${id}`);
  return (
    <main>
      <QuestionForm question={question} isEdit />
    </main>
  );
};

export default EditQuestion;
