import bot from "./bot.js";
import { session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";

import { log } from "./middlewares/cleaner.js";
import { startCommand } from "./commands/start.js";
import { crudHandler } from "./handlers/crud.js";

import type { SessionData, MyContext } from "./types/types.js";
import { addProtein } from "./conversations/addProtein.js";
import { addProduct, fromSaved } from "./conversations/fromSaved.js";

// middlewares
bot.use(
	session<SessionData, MyContext>({
		initial: () => ({ 
			proteinToday: 0,
			products: [],
			states: ['INIT'],
			messages: [],
		}),
	}),
);
bot.use((ctx, next) => {
	console.log(ctx.session.states);
	next();
})
// bot.use(log())
bot.use(conversations());
bot.use(createConversation(addProtein));
bot.use(createConversation(addProduct));

// handlers
crudHandler(bot);
fromSaved(bot);

// commands
startCommand(bot);

bot.catch((err) => console.error(err));
bot.start()