import { Bot} from "grammy";
import type { MyContext, SessionContext } from "../types/types.js";
import { onlyStateSoft } from "../middlewares/onlyState.js";
import renderKeyboard from "../middlewares/pagination.js";
import default_products from "../default_products.js";

export function fromSaved(bot: Bot<MyContext>) {
    bot.on("callback_query:data", onlyStateSoft(['CHOOSE_PRODUCT'], async (ctx) => {
        const data = ctx.callbackQuery.data;

        if (data.startsWith("page:")) {
            const page = parseInt(String(data.split(":")[1]), 10);
            await ctx.editMessageReplyMarkup({
                reply_markup: renderKeyboard(page, default_products),
            });
        } else { 
            const product = default_products.filter(el => el.name == data)[0];

            if (product && !ctx.session.products.filter((el: { name: string; }) => el.name == product.name).length) {
                ctx.session.products.push(product);
                await ctx.answerCallbackQuery('Додано');
            } else {
                await ctx.answerCallbackQuery('Продукт вже доданий');
            }
        }
    }));

    bot.on("callback_query:data", onlyStateSoft(['FROM_SAVED'], async (ctx) => {
        const data = ctx.callbackQuery.data;

        console.log('data')
    }));
}