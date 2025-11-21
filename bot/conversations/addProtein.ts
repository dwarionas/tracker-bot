import type { Conversation } from "@grammyjs/conversations";
import { type Context } from "grammy";
import type { MyContext, SessionContext } from "../types/types.js";
import { getKeyboard } from "../keyboards/index.js";
import { exitConv } from "../middlewares/navigation.js";

export async function addProtein(conversation: Conversation, ctx: Context) {
    const session = await conversation.external((ctx: MyContext) => ctx.session);

    await ctx.reply('Введіть кількість протеїну:', { reply_markup: getKeyboard(session) });
    const { match } = await conversation.waitForHears(/^\d+$/, { otherwise: exitConv(conversation) });

    await conversation.external((ctx: SessionContext) => {
        ctx.session.proteinToday += +match;
    });

    // коментар до їжі

    await ctx.reply(`Прийнято: ${match} г білка ✅`);
    await conversation.halt();
}