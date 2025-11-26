import default_products from "../default_products.js";
import renderKeyboard from "../middlewares/pagination.js";
import type { MyContext, SessionData, States } from "../types/types.js"
import { getKeyboard } from "./keyboards.js";

export const messages: Record<States, string> = {
    INIT: 'Вітаю в боті',
    ADD_PROTEIN: 'Введіть кількість протеїну:',
    FROM_SAVED: 'Введіть назву продукту або страви:',
    CHOOSE_PRODUCT: 'Натисність на продукт щоб додати до списку збережених',
    ADD_PRODUCT: 'add',
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
            await ctx.reply(messages.FROM_SAVED, { reply_markup: getKeyboard(ctx.session) });
            await ctx.conversation.enter("addProduct");
        },

    CHOOSE_PRODUCT: async ctx => {
            await ctx.reply('text', { reply_markup: getKeyboard(ctx.session) });
            await ctx.reply(messages.CHOOSE_PRODUCT, { reply_markup: renderKeyboard(0, default_products) });
        },
}