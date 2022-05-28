import { Schema, Model } from "mongoose";

const postSchema = new Schema({
    headline: String,
    comment: String,
    time: Date,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

export const User = new Model("Post", postSchema);
