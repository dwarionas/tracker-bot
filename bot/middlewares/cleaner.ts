import type { NextFunction } from "grammy";
import type { MyContext } from "../types/types.js";

export function log<T extends MyContext>() {
    return async (ctx: T, next: NextFunction) => {
        if (ctx.message?.message_id) {
            ctx.session.messages.push(ctx.message.message_id);
        }

        const oldReply = ctx.reply.bind(ctx);
        ctx.reply = async (...args) => {
            const msg = await oldReply(...args);
            if ("message_id" in msg) {
                ctx.session.messages.push(msg.message_id);
            }
            return msg;
        };

        await next();
    }
}

export async function clear(ctx: MyContext) {
    const chatId = ctx.chat?.id;
    if (!chatId) return;

    for (const id of ctx.session.messages) {
        try {
            await ctx.api.deleteMessage(chatId, id);
        } catch (e) {
            console.log(`Не вдалося видалити ${id}:`, (e as Error).message);
        }
    }

    ctx.session.messages = [];
}