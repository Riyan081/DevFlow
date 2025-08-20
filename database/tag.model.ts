import mongoose from "mongoose";
import { models } from "mongoose";


interface ITag{
    name:string;
    questions:number;
}



const TagSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },

    questions:{
        Type:Number,
        default:0,
    }
},{
    timestamps:true
})

const Tag = models.Tag || mongoose.model<ITag>("Tag",TagSchema);
export default Tag;