import { InlineKeyboard, Keyboard } from "grammy";
import type { States, SessionData } from "../types/types.js";
import renderKeyboard from "../middlewares/pagination.js";

type Fields = 'productTypes';

export const keyboards: Record<Fields, Keyboard> = {
    productTypes: new Keyboard()
        .text('Поштучно')
        .text('В грамах')
        .persistent()
        .resized()
}

export const staticKeyboards: Record<States, Keyboard | ((data: SessionData) => Keyboard | InlineKeyboard)> = {
  INIT: new Keyboard()
    .text('Додати білок').row()
	.text('Налаштування')
    .persistent()
    .resized(),

  FROM_SAVED: (data) => {
    const hasProducts = data.products.length > 0;

    if (hasProducts) return renderKeyboard(0, data.products);

    return new Keyboard()
      .text('Додати продукт або страву').row()
      .text('Вибрати з популярного').row()
      .text('Назад')
      .persistent()
      .resized()
  },

  ADD_PROTEIN: new Keyboard()
  	.text("Вибрати зі збережених").row()
  	.text('Назад').persistent().resized(),

  ADD_PRODUCT: new Keyboard().text('Назад').persistent().resized(),
  CHOOSE_PRODUCT: new Keyboard().text('Назад').persistent().resized(),

  STATS: new Keyboard().text('test button').persistent().resized(),
  SYNC: new Keyboard().text('test button').persistent().resized(),
};

export function getKeyboard(data: SessionData) {
  const kb = staticKeyboards[data.states.at(-1)!];
  return typeof kb === "function" ? kb(data) : kb;
}