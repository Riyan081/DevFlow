"use server";
import mongoose, { FilterQuery, Types } from "mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import TagQuestion, { ITagQuestion } from "@/database/tag-question.model";
import {
  CreateQuestionParams,
  EditQuestionParams,
  GetQuestionParams,
  IncrementViewParams,
  PaginationSearchParams,
} from "@/types/global";
import {
  AskQuestionSchema,
  GetQuestionSchema,
  IncrementViewSchema,
  PaginationSearchSchema,
} from "../validations";
import { ActionResponse } from "../handlers/fetch";
import action from "../handlers/action";
import User from "@/database/user.model"; // Add this import at the top
import { EditQuestionSchema } from "@/lib/validations";
import { Action } from "sonner";
import { revalidatePath } from "next/cache";

export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,

    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: validationResult.message };
  }

  const { title, content, tags } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ✅ Create the question
    const userEmail = validationResult.session?.user?.email;
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const [question] = await Question.create(
      [
        {
          title,
          content,
          author: user._id, // ✅ Use ObjectId from MongoDB
          // ...other fields
        },
      ],
      { session }
    );

    if (!question) {
      throw new Error("Failed to create question");
    }

    const tagIds: Types.ObjectId[] = [];
    const tagQuestionDocuments: {
      tag: Types.ObjectId;
      question: Types.ObjectId;
    }[] = [];

    // ✅ Create or update tags
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { new: true, upsert: true, session }
      );

      if (!existingTag) continue;

      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    // ✅ Insert into TagQuestion
    if (tagQuestionDocuments.length > 0) {
      await TagQuestion.insertMany(tagQuestionDocuments, { session });
    }

    // ✅ Add tags to Question
    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );

    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (e) {
    await session.abortTransaction();
    return {
      success: false,
      error: (e as Error).message || "Failed to create question",
    };
  } finally {
    session.endSession();
  }
}

export const editQuestion = async function (params: EditQuestionParams) {
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: validationResult.message };
  }

  const { title, content, tags, questionId } = validationResult.params!;
  const userEmail = validationResult.session?.user?.email;

  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).session(session);
    if (!question) {
      return { success: false, error: "Question not found" };
    }

    if (question.author.toString() !== user._id.toString()) {
      return {
        success: false,
        error: "You are not authorized to edit this question",
      };
    }

    if (question.title != title && question.content != content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    const tagstoadd = tags.filter(
      (tag) =>
        !question.tags
          .map((t: mongoose.Types.ObjectId) => t.toString().toLowerCase())
          .includes(tag.toLowerCase())
    );

    const tagstoremove = question.tags.filter(
      (tagId: mongoose.Types.ObjectId) =>
        !tags.includes(tagId.toString().toLowerCase())
    );

    const newTagDocuments = [];

    if (tagstoadd.length > 0) {
      for (const tag of tagstoadd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: `^${tag}$`, $options: "i" } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { new: true, upsert: true, session }
        );

        if (existingTag) {
          newTagDocuments.push({
            tag: existingTag._id,
            question: question._id,
          });
          question.tags.push(existingTag._id);
        }
      }
    }

    if (tagstoremove.length > 0) {
      const tagIdsToRemove = tagstoremove.map((tag) => tag._id);

      await Tag.updateMany(
        {
          _id: { $in: tagIdsToRemove },
        },
        {
          $inc: { questions: -1 },
        },
        { session }
      );

      await TagQuestion.deleteMany({
        tag: { $in: tagIdsToRemove },
        question: question._id,
      });

      question.tags = question.tags.filter(
        (tagId: mongoose.Types.ObjectId) => !tagIdsToRemove.includes(tagId)
      );
    }

    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    await question.save({ session });
    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (e) {
    await session.abortTransaction();
    return {
      success: false,
      error: (e as Error).message || "Failed to edit question",
    };
  } finally {
    session.endSession();
  }
};

export async function getQuestion(params: GetQuestionParams) {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: validationResult.message };
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const question = await Question.findById(questionId)
      .populate("tags")
      .populate("author", "name image")
      .lean();
    if (!question) {
      return { success: false, error: "Question not found" };
    }
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || "Failed to get question",
    };
  }
}

export async function getQuestions(
  params: PaginationSearchParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginationSearchSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: { message: validationResult.message } };
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize) + 1; // Fetch one extra to check for next page

  const filterQuery: FilterQuery<typeof Question> = {};

  if (filter === "recommended") {
    return { success: true, data: { questions: [], isNext: false } };
  }

  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { content: { $regex: new RegExp(query, "i") } },
    ];
  }
 
  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "unanswered":
      filterQuery.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;

    case "popular":
      sortCriteria = { upvotes: -1 };
      break;

    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const totalQuestions = await Question.countDocuments(filterQuery);
    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: (error as Error).message || "Failed to get questions" },
    };
  }
}

export async function incrementView(params: IncrementViewParams) {
  const validationResult = await action({
    params,
    schema: IncrementViewSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: validationResult.message };
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findByIdAndUpdate(
      questionId,
      {
        $inc: { views: 1 },
      },
      { new: true }
    );

    
    


    if (!question) {
      return { success: false, error: "Question not found" };
    }

    return { success: true, data: null };
  } catch (e) {
    return {
      success: false,
      error: (e as Error).message || "Failed to increment view count",
    };
  }
}

export async function getHotQuestions(){
  try{
     
    const questions = await Question.find().sort({views:-1,upvotes:-1}).limit(3);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(questions))
    }

  }catch(error){
    return{
      success: false,
      error: (error as Error).message || "Failed to fetch hot questions"
    }
  
  }
}


