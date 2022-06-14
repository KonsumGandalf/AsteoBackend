import Mongoose from "mongoose";

const { Schema } = Mongoose;

const postSchema = new Schema({
  headline: String,
  comment: String,
  time: Date,
  rating: Number,
  gallery: {
    type: Schema.Types.ObjectId,
    ref: "Gallery",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Post = Mongoose.model("Post", postSchema);
