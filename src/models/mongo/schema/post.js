import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const postSchema = new Schema({
    headline: String,
    comment: String,
    time: Date,
    rating: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    gallery: {
        type: Schema.Types.ObjectId,
        ref: "Gallery",
    },
});

export const Post = Mongoose.model("Post", postSchema);
