import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    password: String,
    rank: Number,
    countPosting: Number,
});

export const User = Mongoose.model("User", userSchema);
