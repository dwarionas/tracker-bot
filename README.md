# Protein Tracker Telegram Bot

Live bot: https://t.me/hyperbolidbot

## What it does
- Add protein quickly (manual input)
- Use saved products or add new ones (per item / per grams)
- Pick from a popular products list
- Track per-product daily totals and overall daily total
- Simple reply-keyboard navigation

## Quick start (local)
```bash
npm install
npm run dev
```

Env:
```
BOT_KEY=your_telegram_bot_token
WEBHOOK_URL=https://your-vercel-app.vercel.app   # only for webhook setup script
```

## Deploy (Vercel)
1) Set `BOT_KEY` in Vercel Project Settings → Environment Variables  
2) Deploy (CLI or GitHub): `vercel --prod`  
3) Set webhook locally (after deploy, with WEBHOOK_URL in .env):  
```bash
npm run set-webhook
```

## Endpoints
- `/api` — Telegram webhook handler
- `/api/test` — health check

## Project structure
```
api/          # webhook + test endpoint
commands/     # /start, etc.
conversations/# multi-step flows
handlers/     # state routing
helpers/      # keyboards, messages
middlewares/  # guards, navigation, pagination
scripts/      # set-webhook
```

