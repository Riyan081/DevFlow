
import mongoose from "mongoose";
import { models } from "mongoose";

export interface IUser{
  id: string | undefined;
 name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;

}

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

    username:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
        unique:true,
    }
    ,
    bio:{
        type:String

    },

    image:{
        type:String,
       

    },

    location:{
        type:String
    },

    portfolio:{
        type:String
    },

    reputation:{
        type:Number,
        default:0
    }


},{
    timestamps:true
})


const User = models.User || mongoose.model<IUser>("User",UserSchema);

export default User;

