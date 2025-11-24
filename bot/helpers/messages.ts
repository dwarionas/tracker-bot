import type { SessionData, States } from "../types/types.js"

export const messages: Record<States, string> = {
    INIT: 'Вітаю в боті',
    ADD_PROTEIN: 'Введіть кількість протеїну:',
    FROM_SAVED: 'Введіть назву продукту або страви:',
    CHOOSE_PRODUCT: 'Натисність на продукт щоб додати до списку збережених',
    ADD_PRODUCT: 'add',
    STATS: 'stats',
    SYNC: 'sync',
}

export function getMessage(data: SessionData) {
  const kb = messages[data.states.at(-1)!];
  return kb;
}