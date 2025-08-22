import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";

import { z } from "zod";
import Account from "@/database/account.model";
import { AccountSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const validateData = AccountSchema.parse(body);
    if (!validateData) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const { userId, name, image, provider, providerAccountId, password } =
      validateData;

    const existingAccount = await Account.findOne({
      provider: provider,
      providerAccountId: providerAccountId,
    });
    if (existingAccount) {
      throw new Error(
        "Account with this provider and providerAccountId already exists "
      );
    }

    const newAccount = await Account.create({
      ...validateData,
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        data: newAccount,
      },
      { status: 201 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log("Error creating Account:", e);
    return NextResponse.json(
      { message: e.message || "Internal Server Error while Account Creation" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const accounts = await Account.find();

    return NextResponse.json(
      {
        sucess: true,
        data: accounts,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error connecting to database:", error);
    return NextResponse.json(
      { message: "Internal Server Error while connecting to database" },
      { status: 500 }
    );
  }
}
