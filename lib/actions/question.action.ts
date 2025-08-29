"use server";
import mongoose, { Types } from "mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import TagQuestion, { ITagQuestion } from "@/database/tag-question.model";
import { CreateQuestionParams, EditQuestionParams, GetQuestionParams } from "@/types/global";
import { AskQuestionSchema, GetQuestionSchema } from "../validations";
import { ActionResponse } from "../handlers/fetch";
import action from "../handlers/action";
import User from "@/database/user.model"; // Add this import at the top
import { EditQuestionSchema } from "@/lib/validations";

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
  const userId = validationResult.session?.user?.id;

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).session(session);
    if (!question) {
      return { success: false, error: "Question not found" };
    }

    if (question.author.toString() !== userId) {
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
      (tag) => !question.Tags.include(tag.toLowerCase())
    );
    const tagstoremove = question.Tags.filter(
      (tag: string) => !tags.includes(tag.toLowerCase())
    );

    const newTagDocuments = [];

    if (tagstoadd.length > 0) {
      for (const tag of tagstoadd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, "i") } },
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


    if(newTagDocuments.length > 0){
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


export async function getQuestion(params: GetQuestionParams){
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
  
  try{

     const question = await Question.findById(questionId).populate('tags');
      if(!question){
        return { success: false, error: "Question not found" };
      }
      return { success: true, data: JSON.parse(JSON.stringify(question)) };


  }catch(error){
    return { success: false, error: (error as Error).message || "Failed to get question" };
  }

}