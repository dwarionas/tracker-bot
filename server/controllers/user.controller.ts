import { type Request, type Response } from 'express';
import UserService from "../services/user.service.js";

class UserController {
    async create(req: Request, res: Response) {
        try {
            const user = await UserService.create(req.body);
            res.json(user);
        } catch (error: any) {
            res.status(500).json(error.message);
        }
    }

    // async getUser(req: Request, res: Response) {
    //     try {
    //         const user = await UserService.getUser(req.body.id);
    //         res.json(user);
    //     } catch (error: any) {
    //         res.status(500).json(error.message);
    //     }
    // }
}

export default new UserController();