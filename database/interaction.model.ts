import mongoose, { models } from "mongoose";
import {Types} from "mongoose";
import { InteractionActionEnums } from "@/lib/constants";

export interface IInteraction {
    user: Types.ObjectId;
    action: string;
    actionId: Types.ObjectId; // question/answer
    actionType: "question" | "answer";
}

const interactionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    action:{
        type: String,
        required: true,
        enum: InteractionActionEnums
    
    },
    actionId:{ //question/answer
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    actionType: {
        type:String,
        enum: ["question", "answer"],
        required: true
    }
},{
    timestamps:true,
})


const Interaction = models.Interaction || mongoose.model<IInteraction>("Interaction", interactionSchema);
export default Interaction;