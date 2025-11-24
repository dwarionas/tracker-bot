import type { NextFunction } from "grammy";
import type { MyContext, States } from "../types/types.js";

export default function onlyState<T extends MyContext>(allowedStates: States[]) {
    return async (ctx: T, next: NextFunction) => {
        const currentState = ctx.session.states?.at(-1) ?? "INIT";

        if (allowedStates.includes(currentState)) {
            return next();
        } else {
            return ctx.reply("Дія недоступна");
        }
    };
}

export function onlyStateSoft<T extends MyContext>(allowedStates: States[], foo: (ctx: T, next: NextFunction) => Promise<void> | void) {
    return async (ctx: T, next: NextFunction) => {
        const currentState = ctx.session.states?.at(-1) ?? "INIT";

        if (!allowedStates.includes(currentState)) {
            return next();
        }
        
        return foo(ctx, next);
    };
}