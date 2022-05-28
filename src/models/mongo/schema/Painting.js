import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const paintingSchema = new Schema({
    title: String,
    year: Number,
    price: Number,
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
});

export const Painting = Mongoose.model("Painting", paintingSchema);
