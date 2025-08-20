
import mongoose from "mongoose";
import { models, Types } from "mongoose";

export interface Icollection{
   author: Types.ObjectId;
   question: Types.ObjectId;
}


const CollectionSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
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

const Collection = models?.Collection || mongoose.model<Icollection>("Collection",CollectionSchema);
export default Collection;