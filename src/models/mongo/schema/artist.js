import { Schema, Model } from "mongoose";

const artistSchema = new Schema({
    firstName: String,
    secondName: String,
    description: String,
    countPaintings: Number,
});

export const Artist = new Model("Artist", artistSchema);
