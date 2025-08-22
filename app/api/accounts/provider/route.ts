/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { z } from "zod";
import Account from "@/database/account.model";
import { AccountSchema } from "@/lib/validations";

export async function POST(req:NextRequest){
    const body = await req.json();

    const {providerAccountId} = body;
    if(!providerAccountId){
        return NextResponse.json(
            { message: "ProvideraccountId is required" },
            { status: 400 }
        );
    }

    const validateData = AccountSchema.partial().safeParse({providerAccountId});
    if (!validateData.success) {
        return NextResponse.json(
            { message: validateData.error.issues },
            { status: 400 }
        );
    }   
        try{
        await dbConnect();
        const account = await Account.findOne({providerAccountId});
        if(!account){
            return NextResponse.json(
                { message: "Account not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "User found",
            data:account
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