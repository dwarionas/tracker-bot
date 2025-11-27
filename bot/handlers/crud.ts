import { Bot } from "grammy";
import type { MyContext } from "../types/types.js";
import onlyState from "../middlewares/onlyState.js";
import { back, navigate } from "../middlewares/navigation.js";

export function crudHandler(bot: Bot<MyContext>) {
    bot.hears('Додати білок', onlyState(['INIT']), navigate('ADD_PROTEIN'));

    bot.hears('Вибрати зі збережених', onlyState(['ADD_PROTEIN']), navigate('FROM_SAVED'));
    
    bot.hears('Додати продукт або страву', onlyState(['FROM_SAVED']), navigate('ADD_PRODUCT'));
    
    bot.hears('Вибрати з популярного', onlyState(['FROM_SAVED']), navigate('CHOOSE_PRODUCT'));

    bot.hears('Назад', onlyState(["ADD_PROTEIN", "FROM_SAVED", "ADD_PRODUCT", "CHOOSE_PRODUCT"]), back());
}

