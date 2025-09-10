import type { Conversation } from "@grammyjs/conversations";
import { type Context } from "grammy";
import type { MyContext, SessionContext } from "../types/types.js";
import { getKeyboard } from "../keyboards/index.js";

export async function addProtein(conversation: Conversation, ctx: Context) {
    const session = await conversation.external((ctx: MyContext) => ctx.session);

    await ctx.reply('Введіть кількість протеїну:', { reply_markup: getKeyboard(session) });
    const { match } = await conversation.waitForHears(/^\d+$/, {
        otherwise: async ctx => {
            if (ctx.message?.text == 'Назад') {
                await conversation.external((ctx: SessionContext) => ctx.session.states.pop());
                const sess = await conversation.external((ctx: SessionContext) => ctx.session);
                return await ctx.reply('Ви в головному меню', { reply_markup: getKeyboard(sess) });
            } else {
                ctx.reply('Number expected')
            }
        }
    });

    await conversation.external((ctx: SessionContext) => {
        ctx.session.proteinToday += +match;
    });

    // коментар до їжі

    await ctx.reply(`Прийнято: ${match} г білка ✅`);
    await conversation.halt();
}