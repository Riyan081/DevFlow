import { FilterQuery } from "mongoose";
import { GetTagQuestionParams, PaginationSearchParams } from "@/types/global";
import { getTagQuestionsSchema, PaginationSearchSchema } from "../validations";
import action from "../handlers/action";
import Tag from "@/database/tag.model";
import { Question } from "@/database";

export const getTags = async (params: PaginationSearchParams) => {
  const validationResult = await action({
    params,
    schema: PaginationSearchSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: validationResult.message };
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<typeof Tag> = {};

  if (query) {
    filterQuery.$or = [{ name: { $regex: query, $options: "i" } }];
  }

  let sortCriteria = {};

  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;

    case "recent":
      sortCriteria = { createdAt: -1 };
      break;

    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;

    case "name":
      sortCriteria = { name: 1 };
      break;

    default:
      sortCriteria = { questions: -1 };
      break;
  }

  try {
    const totalTags = await Tag.countDocuments(filterQuery);

    const tags = await Tag.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean();

    const isNext = totalTags > skip + tags.length;

    return {
      success: true,
      data: { tags, isNext },
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || "Failed to get tags",
    };
  }
};

export const getTagsQuestions = async (params: GetTagQuestionParams) => {
  const validationResult = await action({
    params,
    schema: getTagQuestionsSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: validationResult.message };
  }

  const { page = 1, pageSize = 10, query, tagId } = validationResult.params!;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  try {
    const tag = await Tag.findById(tagId);
    if (!tag) {
      return { success: false, error: "Tag not found" };
    }

    const filterQuery: FilterQuery<typeof Question> = {
      tags: { $in: [tag._id] },
    };

    if (query) {
      filterQuery.title = { $regex: query, $options: "i" };
    }

    const tatalQuestions = await Question.countDocuments(filterQuery);

    const questions = await Question.find(filterQuery)
      .skip(skip)
      .populate([
        { path: "author", select: "name  image" },
        { path: "tags", select: "name" },
      ])
      .limit(limit)
      .lean();

    const isNext = tatalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    }
      
    
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || "Failed to get tags",
    };
  }
};


export const getTopTags = async()=>{
  try{
   const tags = await Tag.find().sort({questions:-1}).limit(5);
   return {
    success:true,
    data: JSON.parse(JSON.stringify(tags))
   }
  }catch(error){
    return {
      success: false,
      error: (error as Error).message || "Failed to get top tags",
    }
  }
}