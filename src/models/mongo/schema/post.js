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
    painting: {
        type: Schema.Types.PaintingId,
        ref: "Painting",
    },
});

export const Post = new Model("Post", postSchema);
