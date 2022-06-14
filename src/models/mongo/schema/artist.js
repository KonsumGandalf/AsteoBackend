import Mongoose from "mongoose";

const { Schema } = Mongoose;

const artistSchema = new Schema({
  firstName: String,
  lastName: String,
  description: String,
  countPaintings: Number,
  image: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Artist = Mongoose.model("Artist", artistSchema);
