"use server";

import { CreateAnsewerParams, GetAnswersParams } from "@/types/global";
import { AnswerServerSchema } from "../validations";
import User from "@/database/user.model";
import action from "../handlers/action";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { Question, Answer } from "@/database";
import { revalidatePath } from "next/cache";
import { GetAnswersSchema } from "./../validations";
import { createInteraction } from "./interaction.action";
import { after } from "next/server";
import { Interaction } from "@/database";

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

    const [newAnswer] = await Answer.create(
      [
        {
          author: userId,
          question: questionId,
          content,
        },
      ],
      {
        session,
      }
    );

    question.answers += 1;
    await question.save({ session });
      after(async () => {
      await createInteraction({
        action: "post",
        actionId: newAnswer._id.toString(),
        actionTarget: "answer",
        authorId: userId as string,
      });
    });
    await session.commitTransaction();

    revalidatePath(`/questions/${questionId}`);
    return { success: true, data: JSON.stringify(newAnswer) };
  } catch (e) {
    await session.abortTransaction();
    return {
      success: false,
      error: (e as Error).message || "Failed to create answer",
    };
  } finally {
    session.endSession();
  }
}

export async function GetAnswers(params: GetAnswersParams) {
  const validateResult = await action({
    params,
    schema: GetAnswersSchema,
    authorize: true,
  });

  if (validateResult instanceof Error) {
    return { success: false, error: validateResult.message };
  }

  const {
    page = 1,
    pageSize = 10,
    query = "",
    questionId,
    filter,
  } = validateResult.params!;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  let sortCriteria = {};

  switch (filter) {
    case "latest":
      sortCriteria = { createdAt: -1 };
      break;

    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;

    case "popular":
      sortCriteria = { upvotes: -1 };
      break;

    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalAnswers = await Answer.countDocuments({ question: questionId });

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id name username avatar")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean();

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: { answers: answers, isNext, totalAnswers },
    };
  } catch (e) {
    return {
      success: false,
      error: (e as Error).message || "Failed to fetch answers",
    };
  } finally {
    // session.endSession();
  }
}
