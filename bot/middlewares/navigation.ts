import type { NextFunction } from "grammy";
import type { MyContext, SessionContext, SessionData, States } from "../types/types.js";
import type { Conversation } from "@grammyjs/conversations";
import { getKeyboard } from "../keyboards/index.js";

export function navigate<T extends MyContext>(to: States) {
    return async (ctx: T, next: NextFunction) => {
        const states = ctx.session.states;
        if (!states) ctx.session.states = ['INIT'];

        if (states.includes(to)) {
            return ctx.reply('Action forbidden')
        }

        const currentState = states.at(-1)!;

        if (currentState !== 'INIT' && currentState === to) {
            return ctx.reply("Ви вже в цьому стані");
        }

        states.push(to);
        await next();
    };
}

export function back<T extends MyContext>() {
    return async (ctx: T, next: NextFunction) => {
        ctx.session.states.pop();

        if (!ctx.session.states.length) ctx.session.states = ['INIT'];

        if (ctx.session.states.length == 1) {
            ctx.session.navOptions.msg = 'Ви в головному меню'
        };

        ctx.session.navOptions.msg = 'Ви повернулись назад';
        await next();
    };
}

export function exitConv<T extends MyContext>(conversation: Conversation) {
    return async (ctx: T) => {
        if (ctx.message?.text == 'Назад') {
            await conversation.external((ctx: SessionContext) => ctx.session.states.pop());
            const sess = await conversation.external((ctx: SessionContext) => ctx.session);
            await ctx.reply(sess.navOptions.msg, { reply_markup: getKeyboard(sess) });
            await conversation.halt();
        } else {
            ctx.reply('Number expected')
        }
    }
}