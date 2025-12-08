import type { Conversation } from "@grammyjs/conversations";
import { type Context } from "grammy";
import type { MyContext, SessionContext } from "../types/types.js";
import { getKeyboard } from "../helpers/keyboards.js";
import { exitConv } from "../middlewares/navigation.js";
import renderKeyboard from "../middlewares/pagination.js";

export async function addProtein(conversation: Conversation, ctx: Context) {
    const onExit = exitConv<MyContext>(conversation);
    
    const checkpoint = conversation.checkpoint();

    const { match } = await conversation.waitForHears(/^\d+$/, { otherwise: async (ctx: MyContext) => {
        const text = ctx.message?.text;

        if (text === 'Choose from saved') {
            const sess = await conversation.external((ctx: SessionContext) => {
                ctx.session.states.push('FROM_SAVED');
                return ctx.session;
            });
 
            const msg = sess.products.length > 0 ? 'Tap a product to add protein' : 'No saved products';
            const hasProducts = sess.products.length > 0;

            hasProducts && await ctx.reply('Saved products', { reply_markup: renderKeyboard(0, sess.products) });
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

    await ctx.reply(`Logged: ${match}g protein ✅. Total today: ${total}`);
    await ctx.reply(`Enter protein amount:`);
    return await conversation.rewind(checkpoint);
}