import { Bot, Keyboard } from "grammy";
import type { MyContext } from "../types/types.js";
import { navigate } from "../service/navigation.js";

export const initialKeyboard = new Keyboard()
    .text('Додати прийом їжі').row()
    .text("Статистика").row()
	.text("Синхронізація")
	.persistent()
	.resized()

export function startCommand(bot: Bot<MyContext>) {
    bot.command('start', navigate('initial'), async (ctx) => {
        await ctx.reply('Вітаю в боті', { reply_markup: initialKeyboard });
    });

    bot.hears('Статистика', async ctx => {
        // ctx.session.state = "stats";
        await ctx.reply('Protein today: ' + ctx.session.proteinToday);
    });

    // sync
}