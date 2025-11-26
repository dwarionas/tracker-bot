import type { NextFunction } from "grammy";
import type { MyContext, SessionContext, SessionData, States } from "../types/types.js";
import type { Conversation } from "@grammyjs/conversations";
import { getKeyboard } from "../helpers/keyboards.js";
import { messages } from "../helpers/messages.js";

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

function applyBack(session: SessionData): SessionData {
  session.states.pop();
  if (!session.states.length) session.states = ['INIT'];

  return session;
}

export function back<T extends MyContext>() {
    return async (ctx: T, next: NextFunction) => {
        applyBack(ctx.session);
        await next();
    };
}

export function exitConv<T extends MyContext>(conversation: Conversation) {
  return async (ctx: T) => {
    const text = ctx.message?.text;

    if (text === 'Назад' || text === '/start') {
      const sess = await conversation.external((ctx: SessionContext) => applyBack(ctx.session));

      await ctx.reply(messages[sess.states.at(-1)!], { reply_markup: getKeyboard(sess) });
      await conversation.halt();
      return;
    }

    await ctx.reply('Number expected');
  };
}