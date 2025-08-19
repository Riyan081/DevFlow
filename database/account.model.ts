import mongoose, { Types } from "mongoose";
import { models } from "mongoose";

export interface IAccount{
    userId:Types.ObjectId;
    name:string;
    image?:string;
    provider:string;
    providerAccountId:string;
}

const AccountSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    name:{
        type:String,
        required:true
    },

    image:{
        type:String
    },

    password:{
        type:String,
        required:true
    },

    provider:{
        type:String,
        required:true
    },

    providerAccountId:{
        type:String,
        required:true
    },
},{
    timestamps:true
})


const Account = models.Account || mongoose.model<IAccount>("Account",AccountSchema);
export default Account;