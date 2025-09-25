import mongoose from "mongoose";

import { Interaction, User } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CreateInteractionParams,
  UpdateReputationParams,
} from "@/types/global";
import { CreateInteractionSchema } from "../validations";

export async function createInteraction(params: CreateInteractionParams) {
  const validationResult = await action({
    params,
    schema: CreateInteractionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return {
      success: false,
      error: validationResult.message,
    };
  }

  const {
    action: actionType,
    actionId,
    actionTarget,
    authorId, // person who owns the content (question/answer)
  } = validationResult.params!;
  const userEmail = validationResult.session?.user?.email;

  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [interaction] = await Interaction.create(
      [
        {
          user: userId,
          action: actionType,
          actionId,
          actionType: actionTarget,
        },
      ],
      { session }
    );

    // Update reputation for both the performer and the content author
    await updateReputation({
      interaction,
      session,
      performerId: userId!,
      authorId,
    });

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(interaction)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

async function updateReputation(params: UpdateReputationParams) {
  const { interaction, session, performerId, authorId } = params;
  const { action, actionType } = interaction;

  let performerPoints = 0;
  let authorPoints = 0;

  switch (action) {
    case "upvote":
      performerPoints = 2; // person who upvoted
      authorPoints = 10;
      break;
    case "downvote":
      performerPoints = -1; // person who downvoted
      authorPoints = -2;
      break;
    case "post":
      authorPoints = actionType === "question" ? 5 : 10;
      break;
    case "delete":
      authorPoints = actionType === "question" ? -5 : -10;
      break;
  }

  if (performerId === authorId) {
    await User.findByIdAndUpdate(
      performerId,
      { $inc: { reputation: performerPoints } },
      { session }
    );
    return;
  }

  await User.bulkWrite([
    {
      updateOne: {
        filter: { _id: performerId },
        update: { $inc: { reputation: performerPoints } },
      },
    },
    {
      updateOne: {
        filter: { _id: authorId },
        update: { $inc: { reputation: authorPoints } },
      },
    },
  ],{session});
}
