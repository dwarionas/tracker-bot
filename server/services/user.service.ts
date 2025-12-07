import UserModel from "../models/user.model.js";
import { type User } from "../types/user.js";

class UserService {
    async create(data: User) {
        const candidate = await UserModel.findOne({ id: data.id });
        if (candidate) {
            throw new Error('User already exist');
        }

        const user = await UserModel.create(data);

        return user;
    }
}

export default new UserService();