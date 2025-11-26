import type { NextFunction } from "grammy";
import type { MyContext, SessionData } from "../types/types.js";
import { handlers } from "../helpers/messages.js";

export function handle<T extends MyContext>() {
    return async (ctx: T, next: NextFunction) => {
        const handle = handlers[ctx.session.states.at(-1)!]!; //fix "!"
        await handle(ctx);
    }
}