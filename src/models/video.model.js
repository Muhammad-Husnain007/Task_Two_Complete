import mongoose, { Schema, model } from "mongoose";

const videoSchema = new Schema({
    videoFile: {
        type: String,
        required: true,

    },
    description:{
        type: String,
        required:true
    },
    duration: {
        type: Number,
        required: true,

    },
    views: {
        type: Number,
        default: 0,

    },
    isPublished: {
        type: Boolean,
        default: true,

    },

}, { timestamps: true })



export const Video = model('Video', videoSchema)