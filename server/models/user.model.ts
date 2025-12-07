import mongoose from "mongoose";
import ProductModel from "./product.model.js";
import DataModel from "./data.model.js";

const UserModel = new mongoose.Schema({
    username: { type: String, unique: true },
    id: { type: String, required: true, unique: true },
    language_code: { type: String, required: true },
    first_name: { type: String },
    products: [ProductModel.schema],
    data: [DataModel.schema]
});

export default mongoose.model('UserModel', UserModel);