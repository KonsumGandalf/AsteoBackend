import Mongoose from "mongoose";

const { Schema } = Mongoose;

const paintingSchema = new Schema({
  title: String,
  year: Number,
  price: Number,
  image: String,
  epoch: {
    type: Schema.Types.ObjectId,
    ref: "Epoch",
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: "Artist",
  },
  gallery: {
    type: Schema.Types.ObjectId,
    ref: "Gallery",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Painting = Mongoose.model("Painting", paintingSchema);
