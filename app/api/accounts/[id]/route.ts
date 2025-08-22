import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { z } from "zod";
import Account from "@/database/account.model";
import { AccountSchema } from "@/lib/validations";







export async function GET(req:NextRequest,{params}:{params:{id:string}}) {
  const { id } = params;
  
  if(!id){
    throw new Error("User ID is required");
  }

  try{

    await dbConnect();

    const account = await Account.findOne({_id:id})
    if(!account){
        return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(
        {
            message: "Account fetched successfully",
            data: account
        },
        { status: 200 }
    )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }catch(e:any){
    console.log("Error fetching user:", e);
    return NextResponse.json(
      { message: e.message || "Internal Server Error while fetching Account" },
      { status: 500 }
    );
  }

}



export async function DELETE(req:NextRequest,{params}:{params:{id:string}}){
    const { id } = params;
    if(!id){
        throw new Error("User ID is required");
    }
    try{
        await dbConnect();
        const account = await Account.findOneAndDelete({_id:id});
        if(!account){
            return NextResponse.json(
                { message: "Account not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            {
                message: "Account deleted successfully",
                data: account
            },
            { status: 200 }
        );

} 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
catch(e:any)
{
    console.log("Error deleting user:", e);
    return NextResponse.json(
      { message: e.message || "Internal Server Error while deleting user" },
      { status: 500 }
    );
  }
}


export async function PUT(req:NextRequest,{params}:{params:{id:string}}){
    const { id } = params;
    if(!id){
        throw new Error("User ID is required");
    }

    const body = await req.json();
     
    const validateData = AccountSchema.partial().safeParse(body);
    if(!validateData.success){
        return NextResponse.json(
            { message: "Invalid data" },
            { status: 400 }
        );
    }
    try {
        await dbConnect();
        const account = await Account.findByIdAndUpdate(
             id ,
            
               {...validateData.data}
            ,
            { new: true, runValidators: true }
        );

        if (!account) {
            return NextResponse.json(
                { message: "Account not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Account updated successfully",
                data: account
            },
            { status: 200 }
        );
        

// eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch(e:any){
    console.log("Error updating user:", e);
    return NextResponse.json(
      { message: e.message || "Internal Server Error while updating user" },
      { status: 500 }
    );
  }
}
