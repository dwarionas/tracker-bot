import default_products from "../default_products.js";
import renderKeyboard from "../middlewares/pagination.js";
import type { MyContext, States } from "../types/types.js"
import { getKeyboard } from "./keyboards.js";

export const messages: Record<States, string> = {
    INIT: 'Welcome! Choose an action below.',
    ADD_PROTEIN: 'Add protein for today:',
    FROM_SAVED: 'Choose a saved product to add protein',
    ADD_FROM_SAVED: 'Enter protein amount:',
    CHOOSE_PRODUCT: 'Tap a product to add it to saved',
    ADD_PRODUCT: 'Enter product or meal name:',
    STATS: 'stats',
    SYNC: 'sync',
}

export const handlers: Partial<Record<States, (ctx: MyContext) => Promise<void>>>  = {
    INIT: async ctx => {
            await ctx.reply(messages.INIT, { reply_markup: getKeyboard(ctx.session) });
        },
    
    ADD_PROTEIN: async ctx => {
            await ctx.reply(messages.ADD_PROTEIN, { reply_markup: getKeyboard(ctx.session) });
            await ctx.conversation.enter("addProtein"); 
        },

    FROM_SAVED: async ctx => {
            await ctx.reply(messages.CHOOSE_PRODUCT, { reply_markup: renderKeyboard(0, default_products) });
        },

    ADD_FROM_SAVED: async ctx => {
            const product = ctx.session.products.find((el, i) => i == ctx.session.currentProductIndex);
            await ctx.reply(`Enter protein amount for ${product?.name}`, { reply_markup: getKeyboard(ctx.session) });
            await ctx.conversation.enter("addFromSaved"); 
        },

    CHOOSE_PRODUCT: async ctx => {
            await ctx.reply('Choose an action', { reply_markup: getKeyboard(ctx.session) });
            await ctx.reply(messages.CHOOSE_PRODUCT, { reply_markup: renderKeyboard(0, default_products) });
        },

    ADD_PRODUCT: async ctx => {
            await ctx.reply(messages.ADD_PRODUCT, { reply_markup: getKeyboard(ctx.session) });
            await ctx.conversation.enter("addProduct");
        },

}