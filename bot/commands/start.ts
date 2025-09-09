import { Bot, Keyboard } from "grammy";
import type { MyContext } from "../types/types.js";
import { staticKeyboards } from "../keyboards/index.js";

export function startCommand(bot: Bot<MyContext>) {
    bot.command('start', async (ctx) => {
        ctx.session.states = ['INIT'];
        await ctx.reply('Вітаю в боті', { reply_markup: staticKeyboards.INIT as Keyboard });
    });

    bot.hears('Статистика', async ctx => {
        // ctx.session.state = "stats";
        await ctx.reply('Protein today: ' + ctx.session.proteinToday);
    });

    // sync
}