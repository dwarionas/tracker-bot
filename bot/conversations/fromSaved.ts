import type { Conversation } from "@grammyjs/conversations";
import { Bot, Keyboard, type Context } from "grammy";
import type { MyContext, SessionContext } from "../types/types.js";
import onlyState from "../middlewares/onlyState.js";
import { navigate } from "../middlewares/navigation.js";
import { keyboards, getKeyboard } from "../keyboards/index.js";

export function fromSaved(bot: Bot<MyContext>) {
    bot.hears('Додати продукт або страву', onlyState(['FROM_SAVED']), navigate('ADD_PRODUCT'), async ctx => {
        await ctx.conversation.enter("addProduct");
    });
}

export async function addProduct(conversation: Conversation, ctx: Context) {
    const session = await conversation.external((ctx: MyContext) => ctx.session);

    await ctx.reply('Введіть назву продукту або страви:', { reply_markup: getKeyboard(session) });
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
// ДОПРАЦЮВАТИ ЦЕЙ ФАЙЛ
    await ctx.reply('Введіть кількість білку на ', { reply_markup: getKeyboard(session) });
    const { match: count } = await conversation.waitForHears(/^\d+$/, {
        otherwise: ctx => ctx.reply('Number expected')
    });

    await conversation.external((ctx: SessionContext) => {
        ctx.session.frequentlyUsedProducts[name.text] = {
            type: type === 'Поштучно' ? 'stuck' : 'gram',
            value: +count,
        };
    });

    await ctx.reply(`Продукт "${name.text}" збережено ✅`, { reply_markup: getKeyboard(session) });
    await conversation.halt();
}