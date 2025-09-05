
"use server";

import { CreateVoteParams, UpdateVoteCountParams } from "@/types/global";
import { CreateVoteSchema } from "../validations";
import { UpdateVoteSchema } from './../validations';
import User from "@/database/user.model";
import action from "../handlers/action";
import mongoose from "mongoose";
import { Vote } from "@/database";
import { Question, Answer } from "@/database";


export async function updateVoteCount(params: UpdateVoteCountParams, session?: mongoose.ClientSession) {
  const validationResult = await action({
    params,
    schema:UpdateVoteSchema,
   
  });

  if (validationResult instanceof Error) {
    return { success: false, error: validationResult.message };
  }

  const { targetId, targetType, voteType, change } = validationResult.params!;

     const Model = targetType === 'question' ? Question : Answer;
     const voteField = voteType === 'upvote' ? 'upvotes' : 'downvotes';


     try{
        const result = await Model.findByIdAndUpdate(targetId,
            {$inc: { [voteField]: change }},
          { new: true, session}
        );

         if(!result){
            throw new Error(`${targetType} not found`);
         }

         return { success: true, data: result };


     }catch(error){
        return { success: false, error: "Failed to update vote count. Please try again later." };

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
    const existngVote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    }).session(session);

    if (existngVote) {
      if (existngVote.voteType === voteType) {
        // Same vote → remove it
        await Vote.deleteOne({ _id: existngVote._id }).session(session);
        await updateVoteCount({ targetId, targetType, voteType, change: -1 }, session);
      } else {
        // Different vote → switch
        await Vote.findByIdAndUpdate(existngVote._id, { voteType }, { new: true, session });
        await updateVoteCount({ targetId, targetType, voteType: existngVote.voteType, change: -1 }, session);
        await updateVoteCount({ targetId, targetType, voteType, change: 1 }, session);
      }
    } else {
      // New vote
      await Vote.create([{
        author: userId,
        actionId: targetId,
        actionType: targetType,
        voteType
      }], { session });

      await updateVoteCount({ targetId, targetType, voteType, change: 1 }, session);
    }

    await session.commitTransaction();
    return { success: true };

  } catch (err) {
    console.error("Vote error:", err);
    await session.abortTransaction();
    return { success: false, error: "Failed to create vote. Please try again later." };
  } finally {
    session.endSession();
  }
}
