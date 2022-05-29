import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const gallerySchema = new Schema({
    name: String,
    lat: String,
    lng: String,
    countAllVisitors: Number,
    countCurVisitors: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

export const Gallery = Mongoose.model("Gallery", gallerySchema);
