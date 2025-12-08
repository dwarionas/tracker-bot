import { InlineKeyboard, Keyboard } from "grammy";
import type { States, SessionData } from "../types/types.js";
import renderKeyboard from "../middlewares/pagination.js";

type Fields = 'productTypes';

export const keyboards: Record<Fields, Keyboard> = {
    productTypes: new Keyboard()
        .text('Per item')
        .text('Per grams')
        .persistent()
        .resized()
}

export const staticKeyboards: Record<States, Keyboard> = {
  INIT: new Keyboard()
    .text('Add protein').row()
	  .text('Settings')
    .persistent()
    .resized(),

  FROM_SAVED: new Keyboard()
      .text('Add product or meal').row()
      .text('Choose from popular').row()
      .text('Back')
      .persistent()
      .resized(),

  ADD_PROTEIN: new Keyboard()
  	.text("Choose from saved").row()
  	.text('Back').persistent().resized(),

  ADD_FROM_SAVED: new Keyboard()
    .text('Remove from saved').row()
    .text('Back').persistent().resized(),

  ADD_PRODUCT: new Keyboard().text('Back').persistent().resized(),
  CHOOSE_PRODUCT: new Keyboard().text('Back').persistent().resized(),

  STATS: new Keyboard().text('Test').persistent().resized(),
  SYNC: new Keyboard().text('Test').persistent().resized(),
};

export function getKeyboard(data: SessionData) {
  const kb = staticKeyboards[data.states.at(-1)!];
  return kb;
}