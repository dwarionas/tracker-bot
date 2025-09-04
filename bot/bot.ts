import { Bot } from "grammy";
import 'dotenv/config'
import type { MyContext } from "./types/types.js";

const key = process.env.BOT_KEY || '';

const bot = new Bot<MyContext>(key);

export default bot;