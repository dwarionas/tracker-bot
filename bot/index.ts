import bot from "./bot.js";
import { session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";

import { startCommand } from "./commands/start.js";
import { crudHandler } from "./handlers/crud.js";

import type { SessionData, MyContext } from "./types/types.js";
import { addProtein } from "./conversations/addProtein.js";
import { fromSaved } from "./handlers/fromSaved.js";
import { addFromSaved } from "./conversations/addFromSaved.js";
import addProduct from "./conversations/addProduct.js";
import watch from "./middlewares/watcher.js";

bot.use(
	session<SessionData, MyContext>({
		initial: () => ({ 
			proteinToday: 0,
			products: [],
			currentProductIndex: 0,
			states: ['INIT'],
			log: {}
		}),
	}),
);

bot.use((ctx, next) => {
	console.log(ctx.session.states);
	next();
})

bot.use(conversations());
bot.use(createConversation(addProtein));
bot.use(createConversation(addProduct));
bot.use(createConversation(addFromSaved));
bot.use(watch);

crudHandler(bot);
fromSaved(bot);
startCommand(bot);

bot.catch((err) => console.error(err));

export default bot;

if (!process.env.WEBHOOK_URL) {
	bot.start();
}