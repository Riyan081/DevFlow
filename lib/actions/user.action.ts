"use server";

import { FilterQuery } from "mongoose";
import action from "../handlers/action";
import { PaginationSearchSchema } from "../validations";
import { PaginationSearchParams } from "@/types/global";
import User from "@/database/user.model";

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
