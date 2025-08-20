import mongoose from "mongoose";
import { models,Types } from "mongoose";



export interface IVote{
    author:Types.ObjectId;
    id:Types.ObjectId;
    type: "question" | "answer";
    voteType:"upvote" | "downvote";
}

const VoteSchema = new mongoose.Schema({

author:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},
id:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
},

type:{
    type: String,
    enum: ["question", "answer"],
    required: true
}
,

voteType :{
    type:String,
    enum:["upvote", "downvote"],
    required:true
},

},{
    timestamps:true
});

const Vote = models.Vote || mongoose.model("Vote",VoteSchema);
export default Vote;