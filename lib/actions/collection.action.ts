"use server";
import { CollectionBaseParams, PaginationSearchParams } from "@/types/global";
import { CollectionBaseSchema } from "../validations";
import action from "../handlers/action";
import { User } from "@/database";
import { Question } from "@/database";
import { Collection } from "@/database";
import { revalidatePath } from "next/cache";
import { PaginationSearchSchema } from "../validations";
import { FilterQuery } from "mongoose";

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
    const question = await Question.findById(questionId);
    if (!question) {
      return { success: false, error: "Question not found" };
    }

    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    if (collection) {
      await Collection.deleteOne({ _id: collection._id });
      revalidatePath(`/questions/${questionId}`);
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

export async function hasSavedQuestion(params: CollectionBaseParams) {
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
    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    revalidatePath(`/questions/${questionId}`);
    return {
      success: true,
      data: {
        saved: !!collection, //used to make boolean variable
      },
    };
  } catch (error) {
    return { success: false, error: "Database error" };
  }
}

export async function getSavedQuestion(params: PaginationSearchParams) {
  const validationResult = await action({
    params,
    schema: PaginationSearchSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: validationResult.message };
  }

  const { page = 1, pageSize = 10, filter, query } = validationResult.params!;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

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
    const questionFilter: FilterQuery<typeof Question> = {};

    if (query) {
      questionFilter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    let sortCriteria = {};

    switch (filter) {
      case "newest":
        sortCriteria = { createdAt: -1 };
        break;

      case "oldest":
        sortCriteria = { createdAt: 1 };
        break;

      case "most_voted":
        sortCriteria = { upvotes: -1 };
        break;

      case "most_answered":
        sortCriteria = { answers: -1 };
        break;

      default:
        sortCriteria = { createdAt: -1 };
        break;
    }

     //getting all the questions from collection it will return _id and question 
    const savedCollections = await Collection.find({
      author: userId,
    }).select("question");

    //handle case where user has no saved questions
    if (!savedCollections || savedCollections.length === 0) {
      return {
        success: true,
        data: {
          questions: [],
          isNext: false,
          totalQuestions: 0,
        }
      };
    }

    //getting only question from savedCollections
    const savedQuestionIds = savedCollections.map(
      (collection) => collection.question
    );


    //filter main add kiya like like query e sath id bhe match hona chaheye 
    questionFilter._id = {
      $in: savedQuestionIds,
    };

    const totalQuestions = await Question.countDocuments(questionFilter);

    const questions = await Question.find(questionFilter)
    .populate({path:"author", select:"name image username"})
    .populate({path:"tags", select:"name"})
    .sort(sortCriteria)
    .skip(skip)
    .limit(limit)
    .lean();

    const isNext = skip+ questions.length < totalQuestions;

    return {
      success:true,
      data:{
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
        totalQuestions,
      }
    }


  } catch (error) {
    return { success: false, error: "failed to fetch saved questions" };
  }
}
