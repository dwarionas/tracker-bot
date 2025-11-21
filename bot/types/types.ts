import type { ConversationFlavor } from "@grammyjs/conversations";
import type { Context, SessionFlavor } from "grammy";

export type SessionContext = Context & SessionFlavor<SessionData>;
type ConversationsContext = ConversationFlavor<Context>
export type MyContext = SessionContext & ConversationsContext;

export type Product = {
  name: string;
  type: 'stuck' | 'gram';
  value: number;
};

export type States = "INIT" | "ADD_PROTEIN" | "FROM_SAVED" | "ADD_PRODUCT" | "CHOOSE_PRODUCT" | "STATS" | "SYNC";

interface NavOptions {
    msg: string;
    
}

export interface SessionData {
    products: Product[],
    proteinToday: number;
    states: States[];
    messages: number[];
    navOptions: NavOptions;
}