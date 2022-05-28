import { Schema, Model } from "mongoose";

const gallerySchema = new Schema({
    lat: String,
    lng: String,
    name: String,
    countAllVisitors: Number,
    countCurVisitors: Number,
});

export const User = new Model("Gallery", gallerySchema);