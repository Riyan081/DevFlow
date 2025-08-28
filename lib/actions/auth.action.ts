"use server";

import mongoose from "mongoose"; // Fixed typo: mongooose → mongoose
import { SignupSchema } from "@/lib/validations";
import action from "../handlers/action";
import getUserModel from "@/database/user.model";
import getAccountModel from "@/database/account.model";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import User from "@/database/user.model";
import Account from "@/database/account.model";
import { SigninSchema } from "@/lib/validations";

export async function signUpWithCredentials(params: {
  name: string;
  username: string;
  email: string;
  password: string;
}) {
  const validationResult = await action({ params, schema: SignupSchema });

  if (!validationResult) {
    throw new Error("Invalid parameters");
  }

  const { name, username, email, password } = validationResult.params!;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
  

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const existingUserName = await User.findOne({ username }).session(session);
    if (existingUserName) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await User.create(
      [{ name, username, email, image: "" }], // Provide default image
      { session }
    );

    await Account.create(
      [
        {
          userId: newUser._id.toString(),
          name: newUser.name, // <-- add this line
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    // Sign in the user
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      throw new Error(signInResult.error);
    }

    return { success: true };
  } catch (error: any) {
    await session.abortTransaction();
    throw new Error(error.message || "Failed to sign up");
  } finally {
    session.endSession();
  }
}



export async function signInWithCredentials(params: {

  email: string;
  password: string;
}) {
  const validationResult = await action({ params, schema: SigninSchema });

  if (!validationResult) {
    throw new Error("Invalid parameters");
  }

  const { email, password } = validationResult.params!;
  

  try {
  

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new Error("User with this email donot exists");
    }  

    const existingAccount = await Account.findOne({provider:"credentials",providerAccountId:email});
    if (!existingAccount) {
      throw new Error("Account with this email donot exists");
    }

    const isPasswordValid = await bcrypt.compare(password, existingAccount.password || "");
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

       // Sign in the user
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      throw new Error(signInResult.error);
    }

    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
  
    throw new Error(error.message || "Failed to sign up");
  } 
}