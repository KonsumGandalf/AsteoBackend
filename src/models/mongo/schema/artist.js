import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const artistSchema = new Schema({
    firstName: String,
    secondName: String,
    description: String,
    countPaintings: Number,
});

export const Artist = Mongoose.model("Artist", artistSchema);
