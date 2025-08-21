/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { z } from "zod";
import User from "@/database/user.model";

export async function POST(req:NextRequest){
    const body = await req.json();

    const {email} = body;
    if(!email){
        return NextResponse.json(
            { message: "Email is required" },
            { status: 400 }
        );
    }

    const requirebody = z.object({
        email: z.string().email({ message: "Please provide a valid email" }),
    });

    const parseDataWithSuccess = requirebody.safeParse(body);
    if (!parseDataWithSuccess.success) {
        return NextResponse.json(
            { message: parseDataWithSuccess.error.issues },
            { status: 400 }
        );
    }

    try{
        await dbConnect();
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "User found",
            data:user
        },{
            status: 200
        }
        )

    }catch(e:any){
        console.log("Error connecting to database:", e);
        return NextResponse.json(
            { message: "Internal Server Error while connecting to database" },
            { status: 500 }
        );
    }

}