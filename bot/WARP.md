# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Install dependencies

- `npm install`

### Run the bot in development

- `npm run dev`
  - Runs `tsx watch ./index.ts` with hot-reload.
  - Requires Node 18+ (per `tsx` and `esbuild` engine constraints) and a `.env` file or environment variable `BOT_KEY` with the Telegram bot token.

### Type-check / build TypeScript

There is no dedicated script, but TypeScript is installed and `tsconfig.json` is configured.

- Type-check only: `npx tsc --noEmit`
- Type-check and emit JS: `npx tsc`

### Tests and linting

- No test framework or linter is currently configured in `package.json`. Add and configure a test runner (e.g. Vitest/Jest) or linter (e.g. ESLint) before attempting to run tests or lint commands.

## High-level architecture

### Overview

This project is a Telegram bot built with `grammy` and `@grammyjs/conversations`, written in TypeScript and compiled for NodeNext ESM. The bot tracks a user's daily protein intake and allows managing a list of saved products/foods.

Core concepts:

- **Per-user session state** stored via `grammy`'s `session` middleware (`SessionData` in `types/types.ts`).
- **State-driven navigation** using a stack of `States` in `session.states` plus middleware helpers.
- **Conversation flows** built with `@grammyjs/conversations` for multi-step input.
- **Keyboard layer** that maps logical states to reply and inline keyboards.
- **External API integration** via `axios` to a local backend.

### Entry point and bot wiring

- `bot.ts`
  - Creates a `Bot<MyContext>` instance using `process.env.BOT_KEY` and exports it.
  - Loads environment variables via `dotenv/config`, so the token is typically provided through a `.env` file.

- `index.ts`
  - Imports the shared `bot` instance and configures middleware and handlers.
  - Attaches `session<SessionData, MyContext>` with an `initial` factory that sets up:
    - `proteinToday` (number)
    - `products` (array of saved `Product` items)
    - `states` (navigation stack of `States`)
    - `messages` (for optional message-cleanup logic)
    - `navOptions` (currently contains a `msg` string used for navigation prompts)
  - Registers the `@grammyjs/conversations` plugin and conversation handlers `addProtein` and `addProduct`.
  - Wires up high-level feature handlers:
    - `crudHandler(bot)` for main CRUD-like hears handlers.
    - `fromSaved(bot)` for saved-products interactions and inline keyboard callbacks.
    - `startCommand(bot)` for `/start` and simple statistics.
  - Starts the bot with `bot.start()` and sets a global error handler with `bot.catch`.

### Types and session model

- `types/types.ts`
  - Defines `Product` (name, type, value) used across keyboards, conversations, and pagination.
  - Declares `States` as a string union (`"INIT" | "ADD_PROTEIN" | ...`) representing the navigation states.
  - Defines `SessionData` with `products`, `proteinToday`, `states`, `messages`, and `navOptions`.
  - Composes `MyContext` by combining `grammy`'s `Context` + `SessionFlavor<SessionData>` with `ConversationFlavor`, and exposes helper aliases like `SessionContext`.

This file is the single source of truth for how per-user state is shaped and what navigation states exist; most middleware and keyboards are parameterized by `States` or `SessionData`.

### Keyboard and pagination layer

- `keyboards/index.ts`
  - Exposes `staticKeyboards`, a mapping from `States` to either a `Keyboard` instance or a function `(SessionData) => Keyboard | InlineKeyboard`.
    - `INIT` defines the main menu (add protein, choose from saved, statistics, sync).
    - `FROM_SAVED` is dynamic and either renders a paginated inline keyboard of saved products or a menu of options when none exist.
    - Other states (`ADD_PROTEIN`, `ADD_PRODUCT`, `CHOOSE_PRODUCT`, `STATS`, `SYNC`) map to simple one-row keyboards (e.g. with a `Назад` button).
  - Provides `keyboards.productTypes`, a reusable keyboard for selecting whether a product is counted per-piece or by grams.
  - Implements `getKeyboard(SessionData)` as the central helper to map the current session state to the correct keyboard, handling both static and computed keyboards.

- `middlewares/pagination.ts`
  - Implements `renderPage(page, products)` which builds an `InlineKeyboard` for a slice of `Product` items and adds pagination buttons (`page:<n>` callback data) when more pages are available.
  - Used by both `keyboards/index.ts` (for saved products) and `conversations/fromSaved.ts` (for default products).

Together, these files abstract away the button layout from higher-level flows, so handlers operate in terms of state and product lists rather than raw keyboard construction.

### Navigation and access control middlewares

- `middlewares/navigation.ts`
  - `navigate(to: States)`: pushes a new state onto `session.states` before calling `next()`. Prevents entering the same state twice or re-entering a non-INIT state when already active, and can reply with error messages in those cases.
  - `back()`: pops the current state from `session.states`, ensures the stack never becomes empty (`INIT` fallback), and updates `navOptions.msg` to reflect navigation messages (used when replying after going back).
  - `exitConv(conversation)`: a helper for conversations; if the user sends `Назад`, it pops the state, computes the updated session, and replies with the appropriate keyboard; otherwise it replies with an error message and keeps the conversation running.

- `middlewares/onlyState.ts`
  - Guards handlers so they only execute when the last entry in `session.states` is included in a list of allowed states.
  - If called outside of allowed states, replies with `"Дія недоступна"` and skips the handler.

These middlewares implement a simple stack-based navigation model that many parts of the bot rely on. When adding new flows or commands, the typical pattern is:

1. Add a new `States` member in `types/types.ts`.
2. Update `staticKeyboards` to include the new state if it needs a keyboard.
3. Wrap new handlers with `onlyState([...])` and `navigate("STATE")` or use `back()`/`exitConv` as appropriate.

### Message tracking and cleanup

- `middlewares/cleaner.ts`
  - `log()`: wraps `ctx.reply` to record all message IDs (including replies) into `session.messages` for later cleanup.
  - `clear(ctx)`: iterates over `session.messages` and attempts to delete each message from the chat using `ctx.api.deleteMessage`, then clears the list.

`log()` is currently imported in `index.ts` but commented out; if activated and combined with `clear`, this enables ephemeral-style interactions where outdated messages are removed automatically.

### Conversations and feature handlers

- `conversations/addProtein.ts`
  - Conversation that:
    - Reads `SessionData` via `conversation.external`.
    - Prompts the user to enter a number of grams of protein.
    - Uses `conversation.waitForHears(/^\d+$/)` to validate numeric input (with `exitConv` as the `otherwise` handler).
    - Increments `session.proteinToday` and confirms the addition.

- `conversations/fromSaved.ts`
  - `fromSaved(bot)`: wires handlers to the shared `bot` instance:
    - `"Додати продукт або страву"` (from state `FROM_SAVED`) enters the `addProduct` conversation.
    - `"Вибрати з популярного"` displays a paginated inline keyboard based on `default_products`.
    - Handles `callback_query:data` events to either switch pages (when `data` starts with `"page:"`) or add a selected default product to `session.products`.
  - `addProduct` conversation:
    - Prompts for a product name and allows exit via `Назад` (using `exitConv`/state pop).
    - Asks the user to pick a type (`Поштучно` vs `В грамах`) via `keyboards.productTypes`.
    - Prompts for the protein value and validates it numerically.
    - Writes a new `Product` into `session.products` and confirms.

- `handlers/crud.ts`
  - Wires top-level hears handlers around the navigation system:
    - `"Додати білок"` (from `INIT`) navigates to `ADD_PROTEIN` and enters the `addProtein` conversation.
    - `"Вибрати зі збережених"` (from `INIT`) navigates to `FROM_SAVED` and shows either saved products or options.
    - `"Назад"` handles backward navigation from several states via `back()` and then replies using `getKeyboard(session)` and `navOptions.msg`.

- `commands/start.ts`
  - Defines `/start`:
    - Calls `regUser(ctx.from)` to register the Telegram user in the external API.
    - Seeds `session.states` with `['INIT']` and sends the initial menu keyboard.
  - Also defines a simple `"Статистика"` handler that echoes `session.proteinToday`.

### External API integration

- `api/reg.ts`
  - Exposes `regUser(user)` which posts the Telegram `User` to `http://localhost:7060/api/user/create` using `axios`.
  - Augments the posted payload with `data: []` and `products: []` fields.
  - Logs the response to the console.

This couples the bot to a local backend service running on port 7060. When running the bot locally, ensure the backend is available or handle connection errors appropriately when extending this module.

### Default product data

- `default_products.ts`
  - Exports an array of `Product` objects representing common protein sources (e.g. chicken breast, eggs, cottage cheese).
  - Used exclusively in `conversations/fromSaved.ts` to populate the "popular products" menu and as the source for adding default products to `session.products`.

When extending product-related features, this file is the central place for seeding commonly used items.
