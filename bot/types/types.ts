import type { ConversationFlavor } from "@grammyjs/conversations";
import type { Context, SessionFlavor } from "grammy";

export type SessionContext = Context & SessionFlavor<SessionData>;
type ConversationsContext = ConversationFlavor<Context>
export type MyContext = SessionContext & ConversationsContext;

export type Product = {
  name: string;
  type: 'stuck' | 'gram';
  value: number;
  amountToday: number;
};

export type States = "INIT" | 
              "ADD_PROTEIN" | 
              "FROM_SAVED" | 
              "ADD_PRODUCT" |   
          "ADD_FROM_SAVED" |
          "CHOOSE_PRODUCT" | 
                    "STATS" | 
                    "SYNC";


type MsgLog = Partial<Record<States, number[]>>

export interface SessionData {
    products: Product[],
    currentProductIndex: number;
    proteinToday: number;
    states: States[];
    log: MsgLog;
}