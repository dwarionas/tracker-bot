import type { Conversation } from "@grammyjs/conversations";
import type { Context } from "grammy";
import type { MyContext, SessionContext } from "../types/types.js";
import { getKeyboard, keyboards } from "../helpers/keyboards.js";
import { exitConv } from "../middlewares/navigation.js";

export default async function addProduct(conversation: Conversation, ctx: Context) {
    const session = await conversation.external((ctx: MyContext) => ctx.session);

    const { message: name } = await conversation.waitFor('message:text');
    if (name.text == 'Назад') {
        await conversation.external((ctx: SessionContext) => ctx.session.states.pop());
        const sess = await conversation.external((ctx: SessionContext) => ctx.session);
        return await ctx.reply('Виберіть опцію', { reply_markup: getKeyboard(sess) });
    }

    await ctx.reply('Виберіть тип продукту', { reply_markup: keyboards.productTypes });
    const { match: type } = await conversation.waitForHears(['Поштучно', 'В грамах'], { 
        otherwise: (ctx) => ctx.reply('Виберіть один з наведених варіантів')
    });

    await ctx.reply('Введіть кількість білку на ', { reply_markup: getKeyboard(session) });
    const { match: count } = await conversation.waitForHears(/^\d+$/, { otherwise: exitConv(conversation)});

    await conversation.external((ctx: SessionContext) => {
        ctx.session.products.push({
            name: name.text,
            type: type === 'Поштучно' ? 'stuck' : 'gram',
            value: +count,
        });
    });

    await ctx.reply(`Продукт "${name.text}" збережено ✅`, { reply_markup: getKeyboard(session) });
    await conversation.halt();
}