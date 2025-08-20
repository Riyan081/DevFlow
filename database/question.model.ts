
import mongoose from "mongoose";
import { models } from "mongoose";
import { Types } from 'mongoose';

export interface IQuestion{
  title:string;
  content:string;
  tags:Types.ObjectId[];
  views:number;
  upvotes:number;
  downvotes:number;
  answers:number;
  author: Types.ObjectId
}

const QuestionSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    tags:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Tag"
    }],
    views:{
        type:Number,
        default:0
    },

    upvotes:{
        type:Number,
        default:0
    },

    downvotes:{
        type:Number,
        default:0
    },
    answers:{
        type:Number,
        default:0
    },

    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    }
},{
    timestamps:true
})



const Question = models.Question || mongoose.model<IQuestion>("Question",QuestionSchema);
export default Question;