import { Schema, Model } from "mongoose";

const artistSchema = new Schema({
    firstName: String,
    secondName: String,
    description: String,
    countPaintings: Number,
});

export const User = new Model("Artist", artistSchema);
