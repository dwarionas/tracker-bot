import type { VercelRequest, VercelResponse } from "@vercel/node";
import bot from "../index.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const update = req.body;
    
    if (!update) {
      console.error("No update data received");
      return res.status(400).json({ error: "No update data" });
    }

    console.log("Processing update:", update.update_id, "type:", update.message?.text || update.callback_query?.data || "unknown");
    
    try {
      await bot.handleUpdate(update);
      console.log("Update processed successfully");
    } catch (botError) {
      console.error("Bot error:", botError);
      throw botError;
    }
    
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
    }
    return res.status(200).json({ ok: false, error: String(error) });
  }
}

