import { Bot} from "grammy";
import type { MyContext, SessionContext } from "../types/types.js";
import { onlyStateSoft } from "../middlewares/onlyState.js";
import renderKeyboard from "../middlewares/pagination.js";
import default_products from "../default_products.js";
import { getKeyboard } from "../helpers/keyboards.js";
import { messages } from "../helpers/handlers.js";
import { navigate } from "../middlewares/navigation.js";

export function fromSaved(bot: Bot<MyContext>) {
    bot.on("callback_query:data", onlyStateSoft(['CHOOSE_PRODUCT'], async (ctx) => {
        const data = ctx.callbackQuery.data;
console.log('1')
        if (data.startsWith("page:")) {
            const page = parseInt(String(data.split(":")[1]), 10);
            await ctx.editMessageReplyMarkup({
                reply_markup: renderKeyboard(page, default_products),
            });
        } else { 
            const product = default_products.filter(el => el.name == data)[0];

            if (product && !ctx.session.products.filter((el: { name: string; }) => el.name == product.name).length) {
                ctx.session.products.push(product);
                await ctx.answerCallbackQuery('Added');
            } else {
                await ctx.answerCallbackQuery('Product already added');
            }
        }
    }));

    bot.on("callback_query:data", onlyStateSoft(['FROM_SAVED'], async (ctx) => {
        const data = ctx.callbackQuery.data;
console.log('2')
        if (data.startsWith("page:")) {
            const page = parseInt(String(data.split(":")[1]), 10);
            await ctx.editMessageReplyMarkup({
                reply_markup: renderKeyboard(page, ctx.session.products),
            });
        } else { 
            const index = ctx.session.products.findIndex(el => el.name == data);
// ctx.deleteMessage()
            ctx.session.currentProductIndex = index;
            ctx.session.states.push('ADD_FROM_SAVED');
        }
    }));
}