import { Bot, Keyboard } from "grammy";
import type { MyContext } from "../types/types.js";
import onlyState from "../middlewares/onlyState.js";
import { back, navigate } from "../middlewares/navigation.js";
import { clear } from "../middlewares/cleaner.js";
import { getKeyboard } from "../keyboards/index.js";

export function crudHandler(bot: Bot<MyContext>) {
    bot.hears('Додати білок', onlyState(['INIT']), navigate('ADD_PROTEIN'), async ctx => {
        await ctx.conversation.enter("addProtein");
    }); 

    bot.hears('Вибрати зі збережених', onlyState(['INIT']), navigate('FROM_SAVED'), async (ctx) => {
        const noProducts = 'У вас ще немає збережених продуктів\nДодайте за допомогою кнопки \nТакож ви можете завантажити популярні продукти з нашої БД';
        const text = ctx.session.frequentlyUsedProducts[0] ? 'Збережені продукти' : noProducts;

        await ctx.reply(text, { reply_markup: getKeyboard(ctx.session) });
    });

    bot.hears('Назад', onlyState(["ADD_PROTEIN", "FROM_SAVED", "ADD_PRODUCT"]), back(), async (ctx) => {
        await ctx.reply('Ви в головному меню', {reply_markup: getKeyboard(ctx.session)});
    });
}