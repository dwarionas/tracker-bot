import { Bot, Keyboard } from "grammy";
import type { MyContext } from "../types/types.js";
import { staticKeyboards } from "../helpers/keyboards.js";
import regUser from "../api/reg.js";

export function startCommand(bot: Bot<MyContext>) {
    bot.command('start', async (ctx) => {
        try {
            console.log("Start command received from user:", ctx.from?.id);
            // regUser(ctx.from!)
            ctx.session.states = ['INIT'];
            await ctx.reply('Вітаю в боті', { reply_markup: staticKeyboards.INIT as Keyboard });
            console.log("Start command processed successfully");
        } catch (error) {
            console.error("Error in start command:", error);
            throw error;
        }
    });

    bot.hears('Статистика', async ctx => {
        // ctx.session.state = "stats";
        await ctx.reply('Protein today: ' + ctx.session.proteinToday);
    });

    // sync
}