import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { z } from "zod";
// Update the import path below if your User model is located elsewhere
import User from "@/database/user.model";


export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}) {
  const { id } = await params;
  
  if(!id){
    throw new Error("User ID is required");

  }

  try{

    await dbConnect();

    const user = await User.findOne({_id:id})
    if(!user){
        return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(
        {
            message: "User fetched successfully",
            data: user
        },
        { status: 200 }
    )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }catch(e:any){
    console.log("Error fetching user:", e);
    return NextResponse.json(
      { message: e.message || "Internal Server Error while fetching user" },
      { status: 500 }
    );
  }

}



export async function DELETE(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    const { id } = await params;
    if(!id){
        throw new Error("User ID is required");
    }
    try{
        await dbConnect();
        const user = await User.findOneAndDelete({_id:id});
        if(!user){
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            {
                message: "User deleted successfully",
                data: user
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


export async function PUT(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    const { id } = await params;
    if(!id){
        throw new Error("User ID is required");
    }

    const body = await req.json();
    
    const requirebody = z.object({
      name: z.string().min(1, "Name is required"),
      username: z.string().min(1, "Username is required"),
      email: z.string().email("Invalid email format"),
      bio: z.string().optional(),
      image: z.string().optional(),
      location: z.string().optional(),
      portfolio: z.string().optional(),
      reputation: z.number().optional(),
    });
    const parseDataWithSuccess = requirebody.safeParse(body);
    if (!parseDataWithSuccess.success) {
        return NextResponse.json(
            { message: parseDataWithSuccess.error.issues },
            { status: 400 }
        );
        }

    try {
        await dbConnect();
        const user = await User.findByIdAndUpdate(
            { _id: id },
            {
                name: parseDataWithSuccess.data.name,
                username: parseDataWithSuccess.data.username,
                email: parseDataWithSuccess.data.email,
                bio: parseDataWithSuccess.data.bio,
                image: parseDataWithSuccess.data.image,
                location: parseDataWithSuccess.data.location,
                portfolio: parseDataWithSuccess.data.portfolio,
                reputation: parseDataWithSuccess.data.reputation,
            },
            { new: true, runValidators: true }
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
