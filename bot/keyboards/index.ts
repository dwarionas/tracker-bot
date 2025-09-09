import { Keyboard } from "grammy";
import type { States, SessionData } from "../types/types.js";

type Fields = 'productTypes';

export const keyboards: Record<Fields, Keyboard> = {
    productTypes: new Keyboard()
        .text('Поштучно')
        .text('В грамах')
        .persistent()
        .resized()
}

export const staticKeyboards: Record<States, Keyboard | ((data: SessionData) => Keyboard)> = {
  INIT: new Keyboard()
    .text('Додати білок')
    .text("Вибрати зі збережених").row()
    .text("Статистика").row()
    .text("Синхронізація")
    .persistent()
    .resized(),

  FROM_SAVED: (data) => {
    const hasProducts = Object.keys(data.frequentlyUsedProducts).length > 0;
    return new Keyboard()
    .text('Додати продукт або страву').row()
    .text('Вибрати з популярного').row()
    .text('Назад')
    .persistent()
    .resized()
  },

  ADD_PROTEIN: new Keyboard().text('Назад').persistent().resized(),
  ADD_PRODUCT: new Keyboard().text('Назад').persistent().resized(),
  STATS: new Keyboard().text('test button').persistent().resized(),
  SYNC: new Keyboard().text('test button').persistent().resized(),
};

export function getKeyboard(data: SessionData) {
  const kb = staticKeyboards[data.states.at(-1)!];
  return typeof kb === "function" ? kb(data) : kb;
}