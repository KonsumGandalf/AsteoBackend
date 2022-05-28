import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const gallerySchema = new Schema({
    name: String,
    lat: String,
    lng: String,
    countAllVisitors: Number,
    countCurVisitors: Number,
});

export const Gallery = Mongoose.model("Gallery", gallerySchema);
