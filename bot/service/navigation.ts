import type { NextFunction } from "grammy";
import type { MyContext, States } from "../types/types.js";

type BackParams = { toBegin?: boolean };

export function navigate<T extends MyContext>(to: States) {
    return async (ctx: T, next: NextFunction) => {
        if (!ctx.session.states) ctx.session.states = ['initial'];

        const currentState = ctx.session.states.at(-1)!;

        if (currentState !== 'initial' && currentState === to) {
            return ctx.reply("Ви вже в цьому стані");
        }

        ctx.session.states.push(to);
        await next();
    };
}

export function back<T extends MyContext>(params?: BackParams) {
    return async (ctx: T, next: NextFunction) => {
        if (!ctx.session.states) ctx.session.states = ['initial'];

        if (params?.toBegin) {
            ctx.session.states = ['initial'];
        } else {
            ctx.session.states.pop();
        }

        await next();
    };
}