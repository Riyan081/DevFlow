"use server";

import { CreateAnsewerParams } from "@/types/global";
import { AnswerServerSchema } from "../validations";
import User from "@/database/user.model";
import action from "../handlers/action";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { Question, Answer } from "@/database";
import { revalidatePath } from "next/cache";

export async function createAnswer(params: CreateAnsewerParams) {
  const validateResult = await action({
    params,
    schema: AnswerServerSchema,
    authorize: true,
  });

  if (validateResult instanceof Error) {
    return { success: false, error: validateResult.message };
  }

  const { content, questionId } = validateResult.params!;
  const userEmail = validateResult.session?.user?.email;

  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return { success: false, error: "User not found" };
  }

  const userId = user._id;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const question = await Question.findById(questionId).session(session);
    if (!question) {
      throw new Error("Question not found");
    }

    const [newAnswer] = await Answer.create([
      {
        author: userId,
        question: questionId,
        content,
      },
    ],{
        session
    });


  question.answers += 1;
  await question.save({ session });
    await session.commitTransaction();

   revalidatePath(`/questions/${questionId}`);
   return { success: true, data: JSON.stringify(newAnswer) };
  } catch (e) {

    await session.abortTransaction();
    return { success: false, error: (e as Error).message || "Failed to create answer" };
  } finally {
    session.endSession();
    
  }
}
