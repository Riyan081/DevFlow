"use server";

import { CreateVoteParams, UpdateVoteCountParams } from "@/types/global";
import { CreateVoteSchema, HasVotedSchema } from "../validations";
import { UpdateVoteSchema } from "./../validations";
import User from "@/database/user.model";
import action from "../handlers/action";
import mongoose from "mongoose";
import { Vote } from "@/database";
import { Question, Answer } from "@/database";
import { HasVotedParams } from "@/types/global";
import { revalidatePath } from "next/cache";


export async function updateVoteCount(
  params: UpdateVoteCountParams,
  session?: mongoose.ClientSession
) {
  const validationResult = await action({
    params,
    schema: UpdateVoteSchema,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: validationResult.message };
  }

  const { targetId, targetType, voteType, change } = validationResult.params!;

  const Model = targetType === "question" ? Question : Answer;
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

  try {
    const result = await Model.findByIdAndUpdate(
      targetId,
      { $inc: { [voteField]: change } },
      { new: true, session }
    );

    if (!result) {
      throw new Error(`${targetType} not found`);
    }

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: "Failed to update vote count. Please try again later.",
    };
  }
}

export async function createVote(params: CreateVoteParams) {
  const validationResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: validationResult.message };
  }

  const { targetId, targetType, voteType } = validationResult.params!;
  const userEmail = validationResult.session?.user?.email;
                
  if (!userEmail) {
    return { success: false, error: "Unauthorized" };
  }

  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return { success: false, error: "User not found" };
  }
  const userId = user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingVote = await Vote.findOne({
      author: userId,
      id: targetId,
      type: targetType,
    }).session(session);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Same vote → remove it
        await Vote.deleteOne({ _id: existingVote._id }).session(session);
        await updateVoteCount(
          { targetId, targetType, voteType, change: -1 },
          session
        );
      } else {
        // Different vote → switch
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session }
        );
        await updateVoteCount(
          { targetId, targetType, voteType: existingVote.voteType, change: -1 },
          session
        );
        await updateVoteCount(
          { targetId, targetType, voteType, change: 1 },
          session
        );
      }
    } else {
      // ✅ Fixed: Use correct field names matching your schema
      await Vote.create(
        [
          {
            author: userId,
            id: targetId,     // ✅ Changed from actionId
            type: targetType, // ✅ Changed from actionType
            voteType,
          },
        ],
        { session }
      );

      await updateVoteCount(
        { targetId, targetType, voteType, change: 1 },
        session
      );
    }
   
    revalidatePath(`/questions/${targetId}`);
    await session.commitTransaction();
    return { success: true };
  } catch (err) {
    console.error("Vote error:", err);
    await session.abortTransaction();
    return {
      success: false,
      error: "Failed to create vote. Please try again later.",
    };
  } finally {
    session.endSession();
  }
}

export async function hasVoted(params: HasVotedParams) {
  const validationResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: validationResult.message };
  }

  const { targetId, targetType } = validationResult.params!;

  const userEmail = validationResult.session?.user?.email;

  if (!userEmail) {
    return { success: false, error: "Unauthorized" };
  }

  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return { success: false, error: "User not found" };
  }
  const userId = user._id;

  try {
    // ✅ Fixed: Use correct field names matching your schema
    const vote = await Vote.findOne({
      author: userId,
      id: targetId,     // ✅ Changed from actionId
      type: targetType, // ✅ Changed from actionType
    });

    if (!vote) {
      return {
        success: false,
        data: { hasUpvoted: false, hasDownvoted: false },
      };
    } else {
      return {
        success: true,
        data: {
          hasUpvoted: vote.voteType === "upvote",
          hasDownvoted: vote.voteType === "downvote",
        },
      };
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to check vote status. Please try again later.",
    };
  }
}