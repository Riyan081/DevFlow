import { models, Types } from "mongoose";
import mongoose from "mongoose"

export interface ITagQuestion{
      tag:Types.ObjectId;
      question:Types.ObjectId;

}

const TagQuestionSchema = new mongoose.Schema({
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tag",
        required:true
    },
    question:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Question",
        required:true
    }
},{
    timestamps:true
})

const TagQuestion = models.TagQuestion || mongoose.model<ITagQuestion>("TagQuestion",TagQuestionSchema);
export default TagQuestion;