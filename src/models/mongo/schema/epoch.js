import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const epochSchema = new Schema({
    name: String,
    description: String,
    yearSpan: String,
});

export const Epoch = Mongoose.model("Epoch", epochSchema);
