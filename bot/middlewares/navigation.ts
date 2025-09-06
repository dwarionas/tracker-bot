import type { NextFunction } from "grammy";
import type { MyContext, States } from "../types/types.js";

type BackParams = { toBegin?: boolean };

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

export function back<T extends MyContext>(params?: BackParams) {
    return async (ctx: T, next: NextFunction) => {
        const states = ctx.session.states;
        if (!states) ctx.session.states = ['INIT'];

        if (params?.toBegin) {
            ctx.session.states = ['INIT'];
        } else {
            states.pop();
        }

        await next();
    };
}