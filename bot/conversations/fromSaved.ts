import type { Conversation } from "@grammyjs/conversations";
import { Bot, type Context } from "grammy";
import type { Product, MyContext, SessionContext } from "../types/types.js";
import onlyState from "../middlewares/onlyState.js";
import { exitConv, navigate } from "../middlewares/navigation.js";
import { keyboards, getKeyboard } from "../keyboards/index.js";
import renderPage from "../middlewares/pagination.js";
import default_products from "../default_products.js";

export function fromSaved(bot: Bot<MyContext>) {
    bot.hears('Додати продукт або страву', onlyState(['FROM_SAVED']), navigate('ADD_PRODUCT'), async ctx => {
        await ctx.conversation.enter("addProduct");
    });

    bot.hears('Вибрати з популярного', onlyState(['FROM_SAVED']), navigate('CHOOSE_PRODUCT'), async ctx => {
        await ctx.reply('Натисність на продукт щоб додати до списку збережених', { reply_markup: renderPage(0, default_products) });
    });

    bot.on("callback_query:data", async (ctx) => {
        const data = ctx.callbackQuery.data;

        if (data.startsWith("page:")) {
            const page = parseInt(String(data.split(":")[1]), 10);
            await ctx.editMessageReplyMarkup({
                reply_markup: renderPage(page, default_products),
            });
        } else { 
            const product = default_products.filter(el => el.name = data)[0];

            if (product && !ctx.session.products.filter(el => el.name == product.name).length) {
                ctx.session.products.push(product);
            }
            
            await ctx.reply('Додано до збережених: ' + data);
        }

        await ctx.answerCallbackQuery();
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