import type { Conversation } from "@grammyjs/conversations";
import type { Context } from "grammy";
import type { MyContext, SessionContext } from "../types/types.js";
import { getKeyboard, keyboards } from "../helpers/keyboards.js";
import { exitConv } from "../middlewares/navigation.js";

export default async function addProduct(conversation: Conversation, ctx: Context) {
    const session = await conversation.external((ctx: MyContext) => ctx.session);

    const { message: name } = await conversation.waitFor('message:text');
    if (name.text == 'Back') {
        await conversation.external((ctx: SessionContext) => ctx.session.states.pop());
        const sess = await conversation.external((ctx: SessionContext) => ctx.session);
        return await ctx.reply('Choose an option', { reply_markup: getKeyboard(sess) });
    }

    await ctx.reply('Choose product type', { reply_markup: keyboards.productTypes });
    const { match: type } = await conversation.waitForHears(['Per item', 'Per grams'], { 
        otherwise: (ctx) => ctx.reply('Please choose one of the options')
    });

    await ctx.reply('Enter protein amount', { reply_markup: getKeyboard(session) });
    const { match: count } = await conversation.waitForHears(/^\d+$/, { otherwise: exitConv(conversation)});

    await conversation.external((ctx: SessionContext) => {
        ctx.session.products.push({
            name: name.text,
            type: type === 'Per item' ? 'stuck' : 'gram',
            value: +count,
            amountToday: 0
        });
    });

    await ctx.reply(`Saved product "${name.text}" ✅`, { reply_markup: getKeyboard(session) });
    await conversation.halt();
}