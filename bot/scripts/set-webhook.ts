import bot from "../bot.js";
import "dotenv/config";

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const BOT_KEY = process.env.BOT_KEY;

if (!WEBHOOK_URL) {
  console.error("WEBHOOK_URL не встановлено в змінних оточення");
  process.exit(1);
}

if (!BOT_KEY) {
  console.error("BOT_KEY не встановлено в змінних оточення");
  process.exit(1);
}

async function setWebhook() {
  try {
    const baseUrl = WEBHOOK_URL.replace(/\/$/, '');
    const url = `${baseUrl}/api`;
    console.log(`Встановлюю webhook на: ${url}`);
    
    await bot.api.setWebhook(url);
    console.log("✅ Webhook успішно встановлено!");
    
    const info = await bot.api.getWebhookInfo();
    console.log("Webhook info:", JSON.stringify(info, null, 2));
  } catch (error) {
    console.error("❌ Помилка при встановленні webhook:", error);
    process.exit(1);
  }
}

setWebhook();

