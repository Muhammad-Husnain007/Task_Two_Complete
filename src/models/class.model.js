import mongoose, { Schema, model } from "mongoose";

const classSchema = new Schema({
    title:{
        type: String,
        required:true,
    },
    picture:{
        type: String,
        required: [true, "Picture is required"],
    },
    description:{
        type: String,
        required:true
    },
    classes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],

}, { timestamps: true })



export const Class = model('Class', classSchema)