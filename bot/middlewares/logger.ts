import type { NextFunction } from "grammy";
import type { MyContext, States } from "../types/types.js";

export function log<T extends MyContext>() {
	return async (ctx: T, next: NextFunction) => {
		if (ctx.message?.message_id) {
			// ctx.session.log[currentState]?.push(ctx.message.message_id);
		}

		const oldReply = ctx.reply.bind(ctx);
		ctx.reply = async (...args) => {
			const msg = await oldReply(...args);
			if ("message_id" in msg) {
				// ctx.session.log[currentState]?.push(msg.message_id);
			}
			return msg;
		};

		await next();
	};
}
