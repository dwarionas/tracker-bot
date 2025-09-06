import { Bot } from "grammy";
import type { MyContext } from "../types/types.js";
import { initialKeyboard } from "../keyboards/index.js";

export function startCommand(bot: Bot<MyContext>) {
    bot.command('start', async (ctx) => {
        ctx.session.states = ['INIT'];

        //const isKeyboardVisible = ctx.session.isKeyboardVisible;

        await ctx.reply('Вітаю в боті', { 
            reply_markup: initialKeyboard
        });
    });

    bot.hears('Статистика', async ctx => {
        // ctx.session.state = "stats";
        await ctx.reply('Protein today: ' + ctx.session.proteinToday);
    });

    // sync
}