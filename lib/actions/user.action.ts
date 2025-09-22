"use server";

import { FilterQuery } from "mongoose";
import action from "../handlers/action";
import { GetUserSchema, PaginationSearchSchema } from "../validations";
import { GetUserParams, PaginationSearchParams } from "@/types/global";
import User from "@/database/user.model";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";

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

      return{
        success:true,
      data:{
        users: JSON.parse(JSON.stringify(users)),
        isNext,
      }
      
      }
  } catch (err) {
    return {
      success: false,
      error: "Failed to fetch users. Please try again later.",
    };
  }
}


export async function getUser(params: GetUserParams){
  const validationResult = await action({
    params,
    schema: GetUserSchema,
    authorize: true,
  })


  const userId = validationResult.params?.userId;

  try{

    const user = await User.findById(userId).lean();
    if(!user){
      return{
        success:false,
        error:"User not found"
      }
    }

    const totalQuestions = await Question.countDocuments({author:user._id});
    const totalAnswers = await Answer.countDocuments({author:user._id});
  }catch(error){
    return{
      success:false,
      error: (error as Error).message || "Failed to fetch user. Please try again later.",
    }
  }
}
