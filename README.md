# Protein Tracker Telegram Bot

A Telegram bot for tracking daily protein intake.  
Users can quickly log protein, manage a list of saved foods, and pick from popular products — all from a chat interface.

## Features

- **Track daily protein**
  - Enter protein amount directly in grams.
  - View how much protein you’ve logged today via a simple stats command.

- **Saved products**
  - Add custom products/meals with:
    - Name
    - Type: per-piece or per-gram
    - Protein value
  - Reuse them later instead of typing values every time.

- **Popular products catalogue**
  - Built-in list of common high-protein foods (meat, fish, dairy, eggs, legumes, etc.).
  - Inline keyboard with **pagination** to browse products.
  - Add items from the popular list to your personal saved products in one tap.

- **State-based navigation**
  - Simple finite-state “navigation” system:
    - `INIT`, `ADD_PROTEIN`, `FROM_SAVED`, `ADD_PRODUCT`, `CHOOSE_PRODUCT`, `STATS`, `SYNC`.
  - Middleware that:
    - Restricts actions to allowed states.
    - Handles “Back” transitions and updates navigation messages.
    - Cleanly exits conversations when user presses “Back” or `/start`.

- **Conversations for multi-step flows**
  - `addProtein` and `addProduct` implemented with `@grammyjs/conversations`:
    - step-by-step prompts,
    - validation (e.g. numeric input for protein),
    - graceful cancellation.

- **Prepared backend integration**
  - `regUser` API call to register new users in an external service (`/api/user/create`).
  - Ready to extend into a full backend-powered tracker (historical data, sync across devices, etc.).

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Telegram framework**: [grammY](https://grammy.dev/)
- **Conversations**: `@grammyjs/conversations`
- **Keyboards / menus**: grammY’s `Keyboard` and `InlineKeyboard`
- **HTTP client**: `axios`
- **Config**: `dotenv`
- **Dev tooling**: `tsx` for running TypeScript directly

## Project Structure

- `index.ts` – bot entrypoint, session setup, conversation registration, handlers & commands wiring.
- `bot.ts` – grammY `Bot` initialization with typed context.
- `commands/`
  - `start.ts` – `/start` command, initial menu, basic stats command.
- `handlers/`
  - `crud.ts` – high-level handlers for adding protein, choosing from saved, navigation/back actions.
- `conversations/`
  - `addProtein.ts` – conversation to enter an amount of protein.
  - `fromSaved.ts` – handlers for working with saved and popular products, plus `addProduct` conversation.
- `keyboards/`
  - `index.ts` – static and dynamic reply keyboards, product type selection, state-based menus.
- `middlewares/`
  - `navigation.ts` – state transitions (`navigate`, `back`, `exitConv`).
  - `onlyState.ts` – guard middleware to restrict handlers to specific states.
  - `pagination.ts` – inline keyboard pagination for product lists.
  - `cleaner.ts` – middleware to track messages and utility to delete them from chat.
- `types/`
  - `types.ts` – session, product, and state types; custom `MyContext`.
  - `api.ts` – API-related types.
- `default_products.ts` – curated list of popular protein products (meats, fish, dairy, etc.).
- `api/reg.ts` – user registration via external REST API.

## Getting Started

### Prerequisites

- Node.js (recommended: latest LTS)
- A Telegram bot token from [BotFather](https://t.me/BotFather)

### Installation

```bash
git clone https://github.com/dwarionas/tracker-bot
cd bot
npm install
```
Create a `.env` file in the project root:

```bash
BOT_KEY=your-telegram-bot-token-here
```
### Run in development

```bash
npm run dev
```
The bot will start and connect to Telegram using the token from `BOT_KEY`.

## Usage Overview

In Telegram:

1. Start the bot with `/start`.
2. Use the main menu:
   - **Add protein** – log a specific amount of protein in grams.
   - **Choose from saved** – open menu to work with your saved products:
     - Add new product/meal with type and protein value.
     - Browse popular products and add them to your saved list.
   - **Statistics** – see how much protein you’ve logged today.
   - **Sync** – reserved for future backend synchronization.
3. Use **Back** to navigate between states; the bot updates the message to reflect where you are (main menu vs nested flow).

