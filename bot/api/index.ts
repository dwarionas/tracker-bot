import type { VercelRequest, VercelResponse } from "@vercel/node";
import bot from "../index.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const update = req.body;
    
    if (!update) {
      res.status(400).json({ error: "No update data" });
      return;
    }

    await bot.handleUpdate(update);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(200).json({ ok: false, error: String(error) });
  }
}

