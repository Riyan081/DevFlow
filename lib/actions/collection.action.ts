"use server";
import { CollectionBaseParams } from "@/types/global";
import { CollectionBaseSchema } from "../validations";
import action from "../handlers/action";
import { User } from "@/database";
import { Question } from "@/database";
import { Collection } from "@/database";
import { revalidatePath } from "next/cache";

export async function toggleSaveQuestion(params: CollectionBaseParams) {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: validationResult.message };
  }

  const { questionId } = validationResult.params!;
  const email = validationResult.session?.user!.email;

  if (!email) {
    return { success: false, error: "User not authenticated" };
  }

  const user = await User.findOne({ email });
  if (!user) {
    return { success: false, error: "User not found" };
  }
  const userId = user._id;

  try {
    const question = Question.findById(questionId);
    if (!question) {
      return { success: false, error: "Question not found" };
    }

    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    if (collection) {
      await Collection.deleteOne({ _id: collection._id });
      return { success: true, data: { saved: false } };
    }
    await Collection.create({
      question: questionId,
      author: userId,
    });

    revalidatePath(`/questions/${questionId}`);
    return {
      success: true,
      data: {
        saved: true,
      },
    };
  } catch (error) {
    return { success: false, error: "Database error" };
  }
}
