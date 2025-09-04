import type { ConversationFlavor } from "@grammyjs/conversations";
import type { Context, SessionFlavor } from "grammy";

export type SessionContext = Context & SessionFlavor<SessionData>;
type ConversationsContext = ConversationFlavor<Context>
export type MyContext = SessionContext & ConversationsContext;

type FrequentlyUsedProducts = Record<string, number>;
export type States = "initial" | "addMeal" | "stats" | "sync";

export interface SessionData {
    frequentlyUsedProducts: FrequentlyUsedProducts,
    proteinToday: number;
    states: States[];
}