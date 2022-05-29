import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const artistSchema = new Schema({
    firstName: String,
    secondName: String,
    description: String,
    countPaintings: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

export const Artist = Mongoose.model("Artist", artistSchema);
