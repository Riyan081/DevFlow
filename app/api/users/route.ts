import User from "@/database/user.model";
import dbConnect from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

export async function POST(req: NextRequest) {
 await dbConnect();

  const requirebody = z.object({
    name: z
      .string()
      .min(2)
      .max(50, { message: "Name must be between 2 and 50 characters" }),
    username: z
      .string()
      .min(3)
      .max(20, { message: "UserName should be in between 3 to 20 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      }),
    email: z.string().email({ message: "Please provide a valid email" }),
    bio: z.string().optional(),
    image: z.string().url({ message: "please provide correct Url" }).optional(),
    location: z.string().optional(),
    portfolio: z
      .string()
      .url({ message: "Please provide a valid URL for portfolio" })
      .optional(),
    reputation: z.number().optional(),
  });

  const body = await req.json();
  const parseDataWithSuccess = requirebody.safeParse(body);
  if (!parseDataWithSuccess.success) {
    return NextResponse.json(
      { message: parseDataWithSuccess.error.issues},
      { status: 400 }
    );
  }
  try {
    const {
      name,
      username,
      email,
      bio,
      image,
      location,
      portfolio,
      reputation,
    } = parseDataWithSuccess.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const existingUserName = await User.findOne({ username });
    if (existingUserName) {
      throw new Error("Username already exists");
    }

    const newUser = await User.create({
      name,
      username,
      email,
      bio,
      image,
      location,
      portfolio,
      reputation,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        data: newUser,
      },
      { status: 201 }
    );
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (e: any) {
  console.log("Error creating user:", e);
  return NextResponse.json(
    { message: e.message || "Internal Server Error while signing in" },
    { status: 500 }
  );
}
}


export async function GET(req:NextRequest){
   
    try{
        await dbConnect();
        const users = await User.find();

        return NextResponse.json({
            sucess:true,
            data:users
        },{
            status:200
        })
    }catch(error){
        console.log("Error connecting to database:", error);
        return NextResponse.json(
            { message: "Internal Server Error while connecting to database" },
            { status: 500 }
        );
    }
}


