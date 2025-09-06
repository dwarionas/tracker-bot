import { Keyboard } from "grammy";

export const initialKeyboard = new Keyboard()
    .text('Додати білок')
    .text("Вибрати зі збережених").row()
    .text("Статистика").row()
    .text("Синхронізація")
    .persistent()
    .resized()

export const fromSavedKeyboard = new Keyboard()
    .text('Додати продукт або страву').row()
    .text('Вибрати з популярного').row()
    .text('Назад')
    .persistent()
    .resized()

export const backKeyboard = new Keyboard()
    .text('Назад')
    .persistent()
    .resized()

export const productTypeKeyboard = new Keyboard()
    .text('Поштучно')
    .text('В грамах')
    .persistent()
    .resized()