import type { Conversation } from "@grammyjs/conversations";
import { Keyboard, type Context } from "grammy";
import type { SessionContext } from "../../types/types.js";

const addMealKeyboard = new Keyboard()
    .text("Вибрати зі збережених").row()
    .text("Вийти")
    .persistent()
    .resized()

export async function addMeal(conversation: Conversation, ctx: Context) {
    const session = await conversation.external((ctx: SessionContext) => ctx.session);

    await ctx.reply('Введіть кількість протеїну:', { reply_markup: addMealKeyboard });
    const { match } = await conversation.waitForHears(/^\d+$/, {
        otherwise: ctx => ctx.reply('Number expected')
    });

    await conversation.external((ctx: SessionContext) => {
        ctx.session = session;
    });

    await ctx.reply(`Показниз прийнято: ${match} грами білка`);

    await conversation.halt();
}