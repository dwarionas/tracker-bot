import { InlineKeyboard } from "grammy";
import type { Product } from "../types/types.js";

const step = 5;

export default function renderKeyboard(page: number, products: Product[]) {
    const start = page * step;
    const end = start + step;
    const visible = products.slice(start, end);

    const kb = new InlineKeyboard();
    for (const { name, value } of visible) {
        kb.text(`${name}, ${value} білку`, name).row();
    }

    if (page > 0) kb.text("⬅️", `page:${page - 1}`);
    if (end < products.length) kb.text("➡️", `page:${page + 1}`);

    return kb;
}