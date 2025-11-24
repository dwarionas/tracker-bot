import { Bot } from "grammy";
import type { MyContext } from "../types/types.js";
import onlyState from "../middlewares/onlyState.js";
import { back, navigate } from "../middlewares/navigation.js";
import { clear } from "../middlewares/cleaner.js";
import { getKeyboard } from "../helpers/keyboards.js";
import { getMessage } from "../helpers/messages.js";

export function crudHandler(bot: Bot<MyContext>) {
    bot.hears('Додати білок', onlyState(['INIT']), navigate('ADD_PROTEIN'), async ctx => {
        await ctx.reply(getMessage(ctx.session), { reply_markup: getKeyboard(ctx.session) });
        await ctx.conversation.enter("addProtein"); 
    }); 

    bot.hears('Назад', onlyState(["ADD_PROTEIN", "FROM_SAVED", "ADD_PRODUCT", "CHOOSE_PRODUCT"]), back(), async (ctx) => {
        await ctx.reply(getMessage(ctx.session), { reply_markup: getKeyboard(ctx.session) });
    });
}