import { Schema, Model } from "mongoose";

const epochSchema = new Schema({
    name: String,
    description: String,
    yearSpan: String,
});

export const User = new Model("Epoch", epochSchema);
