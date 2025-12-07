import { Router } from "express";
import UserController from "../controllers/user.controller.js";

const user_router = Router();

user_router.post('/api/user/create', UserController.create);

export default user_router;