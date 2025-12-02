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

// middlewares
bot.use(
	session<SessionData, MyContext>({
		initial: () => ({ 
			proteinToday: 0,
			products: [
				{
					name: 'string',
					type: 'gram',
					value: 24,
					amountToday: 24
				},
				{
					name: 'gaaga',
					type: 'gram',
					value: 24,
					amountToday: 24
				},
				{
					name: 'qtqtqt',
					type: 'gram',
					value: 24,
					amountToday: 24
				},
				{
					name: 'etetete',
					type: 'gram',
					value: 24,
					amountToday: 24
				},
				{
					name: 'wrrrwrwr',
					type: 'gram',
					value: 24,
					amountToday: 24
				},
				{
					name: 'sdfgdfgasg',
					type: 'gram',
					value: 24,
					amountToday: 24
				},
				{
					name: '111111',
					type: 'gram',
					value: 24,
					amountToday: 24
				},
				{
					name: 'svkkkvkkkk',
					type: 'gram',
					value: 24,
					amountToday: 24
				},
				{
					name: 'ppwpwppwpw',
					type: 'gram',
					value: 24,
					amountToday: 24
				},
				{
					name: 'r;r;r;r;',
					type: 'gram',
					value: 24,
					amountToday: 24
				},
				{
					name: 'ammmsdmmd',
					type: 'gram',
					value: 24,
					amountToday: 24
				},
				{
					name: 'qdkfnsdjfk',
					type: 'gram',
					value: 24,
					amountToday: 24
				},

			],
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

// state machine
bot.use(watch)

// handlers
crudHandler(bot);
fromSaved(bot);

// commands
startCommand(bot);

bot.catch((err) => console.error(err));
bot.start()