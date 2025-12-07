import mongoose from "mongoose";

const ProductModel = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    productID: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    proteinValue: { type: Number, required: true },
});

export default mongoose.model('ProductModel', ProductModel);