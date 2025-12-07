import 'dotenv/config';
import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import user_router from "./routers/user.router.js";

const PORT = process.env.PORT
const DB = process.env.DB_URL || '';

const app: Express = express();
app.use(express.json());
app.use(cors());

app.use(user_router);

app.get('/', (_: Request, res: Response) => {
    res.send('t.me/awesomebollox')
});

(async () => {
    try {
        await mongoose.connect(DB)
            .then(() => console.log('Database connected'));
    } catch (error) {
        console.log(error);
    }
})();

app.listen(PORT, () => console.log(`Server started on ${PORT} port`));