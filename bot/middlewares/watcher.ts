import type { NextFunction } from "grammy";
import type { MyContext, States } from "../types/types.js";
import { handlers } from "../helpers/handlers.js";

export default async function watch(ctx: MyContext, next: NextFunction) {
  	const prevState: States | null = ctx.session.states?.at(-1) ?? null;

  	await next();

  	const currentState: States | null = ctx.session.states?.at(-1) ?? null;

	if (currentState !== prevState && currentState) {
		const handler = handlers[currentState];
        if (handler) {
            await handler(ctx);
		}
	}
}