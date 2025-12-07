import type { VercelRequest, VercelResponse } from "@vercel/node";

// Імпортуємо налаштований бот з index.ts (middleware та handlers вже налаштовані)
import bot from "../index.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Перевіряємо метод запиту
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    // Обробляємо оновлення від Telegram
    await bot.handleUpdate(req.body);
    
    // Відповідаємо Telegram, що оновлення отримано
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

