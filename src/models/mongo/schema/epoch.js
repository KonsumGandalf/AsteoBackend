import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const epochSchema = new Schema({
    name: String,
    description: String,
    yearSpan: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

export const Epoch = Mongoose.model("Epoch", epochSchema);
