import type { Conversation } from "@grammyjs/conversations";
import type { Context } from "grammy";
import { exitConv } from "../middlewares/navigation.js";
import type { MyContext, SessionContext } from "../types/types.js";
import { getKeyboard } from "../helpers/keyboards.js";
import renderKeyboard from "../middlewares/pagination.js";

export async function addFromSaved(conversation: Conversation, ctx: Context) {
    const onExit = exitConv<MyContext>(conversation);
    
    const productIndex = await conversation.external((ctx: SessionContext) => ctx.session.currentProductIndex);
    const product = await conversation.external((ctx: SessionContext) => ctx.session.products[productIndex]);
    const checkpoint = conversation.checkpoint();

    const { match } = await conversation.waitForHears(/^\d+$/, { otherwise: async (ctx: MyContext) => {
        const text = ctx.message?.text;

        if (text === 'Видалити зі збережених') {
            const sess = await conversation.external((ctx: SessionContext) => {
                ctx.session.products = ctx.session.products.filter((el, i) => i !== productIndex);
                return ctx.session;
            });

            await conversation.external((ctx: SessionContext) => ctx.session.states.pop());

            const msg = sess.products.length > 0 ? 'Натисніть на продукт щоб додати білок' : 'Немає збережених продуктів';
            const hasProducts = sess.products.length > 0;

            await ctx.reply('Видалено', { reply_markup: getKeyboard(sess) });
            hasProducts && await ctx.reply('Збережені продукти', { reply_markup: renderKeyboard(0, sess.products) });

            await conversation.halt();
            return;
        }

        return onExit(ctx);
    } });   

    await conversation.external((ctx: SessionContext) => {
        const product = ctx.session.products[productIndex];
        if (!product) return;

        product.amountToday = (product.amountToday ?? 0) + +match;
    });

    const totalForProductToday = await conversation.external((ctx: SessionContext) => ctx.session.products[productIndex]?.amountToday);

    // коментар до їжі

    await ctx.reply(`Прийнято: ${match}г білка для продукту ${product?.name}. Білка за сьогодні ${totalForProductToday}`);
    await ctx.reply(`Введіть к-сть протеїну для ${product?.name}`);
    return await conversation.rewind(checkpoint);
}