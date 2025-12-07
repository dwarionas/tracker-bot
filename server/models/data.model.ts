import mongoose from "mongoose";

const DataModel = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    proteinValue: { type: Number, required: true },
});

export default mongoose.model('DataModel', DataModel);