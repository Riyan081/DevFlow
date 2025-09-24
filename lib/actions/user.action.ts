"use server";

import { FilterQuery, PipelineStage, Types } from "mongoose";
import action from "../handlers/action";
import { GetUserSchema, GetUsersTagSchema, PaginationSearchSchema } from "../validations";
import { GetUserParams, GetUserTagsParams, PaginationSearchParams } from "@/types/global";
import User from "@/database/user.model";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import { GetUserQuestionsParams, GetUserAnswersParams } from "@/types/global";
import { GetUserAnswersSchema } from "../validations";


export async function getUsers(params: PaginationSearchParams) {
  const validationResult = await action({
    params,
    schema: PaginationSearchSchema,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: validationResult.message };
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<typeof User> = {};

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
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

    case "popular":
      sortCriteria = { reputation: -1 };
      break;

    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalUsers = await User.countDocuments(filterQuery);

    const users = await User.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean();

    const isNext = skip + users.length < totalUsers;

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        isNext,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: "Failed to fetch users. Please try again later.",
    };
  }
}

export async function getUser(params: GetUserParams) {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
    authorize: true,
  });

  const userId = validationResult.params?.userId;

  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        totalQuestions,
        totalAnswers,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        (error as Error).message ||
        "Failed to fetch user. Please try again later.",
    };
  }
}

export async function getUserQuestions(params: GetUserQuestionsParams) {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
    authorize: true,
  });

  const userId = validationResult.params?.userId;

  const { page = 1, pageSize = 10 } = params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  try {
    const totalQuestions = await Question.countDocuments({
      author: userId
    });

    const questions = await Question.find({
      author: userId,
    })
      .populate("tags", "name")
      .populate("author", "_id name image")
      .skip(skip)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

      const isNext = totalQuestions > skip + questions.length;
    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
        totalQuestions
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        (error as Error).message ||
        "Failed to fetch user. Please try again later.",
    };
  }
}






export async function getUserAnswers(params: GetUserAnswersParams) {
  const validationResult = await action({
    params,
    schema: GetUserAnswersSchema,
    authorize: true,
  });

  const userId = validationResult.params?.userId;

  const { page = 1, pageSize = 10 } = params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  try {
    const totalAnswers = await Answer.countDocuments({
      author: userId
    });

    const answers = await Answer.find({
      author: userId,
    }).populate("author", "_id name image")
      .skip(skip)
      .limit(limit)
      .lean();

      const isNext = totalAnswers > skip + answers.length;
    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
        totalAnswers
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        (error as Error).message ||
        "Failed to fetch user. Please try again later.",
    };
  }
}



export async function getUserTopTags(params: GetUserTagsParams) {
  const validationResult = await action({
    params,
    schema: GetUsersTagSchema,
    authorize: true,
  });

  const userId = validationResult.params?.userId;

 
  try {
  const pipeline = [
  { $match: { author: new Types.ObjectId(userId) } },
  { $unwind: "$tags" },
  { $group: { _id: "$tags", count: { $sum: 1 } } },
  { $lookup: {
      from: "tags",
      localField: "_id",
      foreignField: "_id",
      as: "tagDetails"
    }
  },
  { $unwind: "$tagDetails" },
  { $sort: { count: -1 } },
  { $limit: 10 },
  { $project: {
      _id: "$tagDetails._id",
      name: "$tagDetails.name",
      count: 1
    }
  }
];

    const tags = await Question.aggregate(pipeline);

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
      },
    };
    
  } catch (error) {
    return {
      success: false,
      error:
        (error as Error).message ||
        "Failed to fetch user. Please try again later.",
    };
  }
}
