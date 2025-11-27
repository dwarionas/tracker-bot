import type { Conversation } from "@grammyjs/conversations";
import { type Context } from "grammy";
import type { MyContext, SessionContext } from "../types/types.js";
import { getKeyboard } from "../helpers/keyboards.js";
import { exitConv } from "../middlewares/navigation.js";

export async function addProtein(conversation: Conversation, ctx: Context) {
    const onExit = exitConv<MyContext>(conversation);
    
    const checkpoint = conversation.checkpoint();

    const { match } = await conversation.waitForHears(/^\d+$/, { otherwise: async (ctx: MyContext) => {
        const text = ctx.message?.text;

        if (text === 'Вибрати зі збережених') {
            const sess = await conversation.external((ctx: SessionContext) => {
                ctx.session.states.push('FROM_SAVED');
                return ctx.session;
            });
 
            const msg = sess.products.length > 0 ? 'Збережені продукти' : 'Немає збережених продуктів';

            await ctx.reply(msg, { reply_markup: getKeyboard(sess) });
            await conversation.halt();
            return;
        }

        return onExit(ctx);
    } });   

    await conversation.external((ctx: SessionContext) => {
        ctx.session.proteinToday += +match;
    });

    const total = await conversation.external((ctx: SessionContext) => ctx.session.proteinToday);

    // коментар до їжі

    await ctx.reply(`Прийнято: ${match} г білка ✅. Білка за сьогодні ${total}`);
    await ctx.reply(`Введіть кількість протеїну:`);
    return await conversation.rewind(checkpoint);
}