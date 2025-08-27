import mongoose from "mongoose";
//  npm i slugify - help us to follow a specific pattern for username
import slugify from "slugify";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";
import User from "@/database/user.model";
import Account from "@/database/account.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { provider, providerAccountId, user } = await request.json();
  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validateData = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    if (!validateData) {
      throw new Error("Invalid request data");
    }

    const { name, username, email, image } = user;
    const sluggifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    let existingUser = await User.findOne({ email }).session(session);
    if (!existingUser) {
      [existingUser] = await User.create(
        [{ name, username, sluggifiedUsername, email, image }],
        { session }
      );
    } else {
      const updateData: { name?: string; image?: string } = {};
      if (existingUser.name !== name) updateData.name = name;
      if (existingUser.image !== image) updateData.image = image;

      if (Object.keys(updateData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updateData }
        ).session(session);
      }
    }

    const existingAccount = await Account.findOne({
      userId: existingUser?._id,
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser?._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    return NextResponse.json({
          
      success: true,  
    })
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  } finally {
    session.endSession();
  }
}
