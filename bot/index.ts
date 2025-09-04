import bot from "./bot.js";
import { session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";

import { startCommand } from "./commands/start.js";
import { crudMenu, crudHandler } from "./handlers/addMeal/index.js";

import type { SessionData, MyContext } from "./types/types.js";
import defaultProducts from "./default_products.json" with { type: "json" };
import { addMeal } from "./conversations/addMeal/addMeal.js";

// middlewares
bot.use(
	session<SessionData, MyContext>({
		initial: () => ({ 
			proteinToday: 0,
			frequentlyUsedProducts: defaultProducts,
			states: ['initial']
		}),
	}),
);
bot.use(conversations());
bot.use(createConversation(addMeal));
bot.use(crudMenu);

// handlers
crudHandler(bot);

// commands
startCommand(bot);

bot.catch((err) => console.error(err));
bot.start()


	// await ctx.reply(`Список продуктів: 
	// 	${Object.entries(ctx.session.frequentlyUsedProducts).map(item => {
	// 	    return item[0]+': '+item[1]+'\n'
	// 	})} 
	// `);