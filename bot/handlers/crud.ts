import { Bot } from "grammy";
import type { MyContext } from "../types/types.js";
import onlyState from "../middlewares/onlyState.js";
import { back, navigate } from "../middlewares/navigation.js";

export function crudHandler(bot: Bot<MyContext>) {
    bot.hears('Add protein', onlyState(['INIT']), navigate('ADD_PROTEIN'));

    bot.hears('Choose from saved', onlyState(['ADD_PROTEIN']), navigate('FROM_SAVED'));
    
    bot.hears('Add product or meal', onlyState(['FROM_SAVED']), navigate('ADD_PRODUCT'));
    
    bot.hears('Choose from popular', onlyState(['FROM_SAVED']), navigate('CHOOSE_PRODUCT'));

    bot.hears('Back', onlyState(["ADD_PROTEIN", "FROM_SAVED", "ADD_PRODUCT", "CHOOSE_PRODUCT"]), back());
}

