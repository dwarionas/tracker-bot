import type { ConversationFlavor } from "@grammyjs/conversations";
import type { Context, Keyboard, SessionFlavor } from "grammy";

export type SessionContext = Context & SessionFlavor<SessionData>;
type ConversationsContext = ConversationFlavor<Context>
export type MyContext = SessionContext & ConversationsContext;

export type FrequentlyUsedProducts = Record<string, { type: 'stuck' | 'gram', value: number }>;
export type States = "INIT" | "ADD_PROTEIN" | "FROM_SAVED" | "ADD_PRODUCT" | "STATS" | "SYNC";

export interface SessionData {
    frequentlyUsedProducts: FrequentlyUsedProducts,
    proteinToday: number;
    states: States[];
    messages: number[];
}