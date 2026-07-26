# Telegram Mini App — Crypto Wallet + Bank

Non-custodial crypto wallet, multi-currency fiat view with a virtual card, and a
unified swap. Bilingual EN/RU, auto-detected from Telegram. Visual style is
"liquid glass + holographic", dark-first with a working light theme.

`docs/telegram_app_spec.md` is the source of truth; `docs/mini_app_mockup.html`
is the visual/interaction reference the React build mirrors.

## Stack

| Concern | Choice |
|---|---|
| Framework | React 19 + Vite 8 (TypeScript, strict) |
| Telegram | `@twa-dev/sdk`, wrapped in `src/telegram/telegram.ts` |
| Wallet | TON Connect (`@tonconnect/ui-react`) |
| State | Zustand (`src/store/*`) |
| Styling | Plain CSS with the mockup's custom properties (`src/styles/*`) |
| Typography | System font stack — SF Pro (Apple), Helvetica Neue, Roboto/Segoe UI fallback |
| Prices | CoinGecko (crypto) + open.er-api.com (FX), both polled live |

## Getting started

```bash
npm install
cp .env.example .env     # optional — every key has a public-endpoint fallback
npm run dev
```

`npm run build` runs `tsc --noEmit` before `vite build`, so a type error fails
the build. `npm run typecheck` runs the check alone.

Open `http://localhost:5173` in a browser for design review: above 520px the app
re-applies the mockup's phone framing, below it renders full-bleed the way
Telegram does. Language falls back to the browser locale outside Telegram.

## Layout

```
src/
  components/     shared presentational pieces (Waves, TopBar, ToastView, icons)
  config/env.ts   typed VITE_* surface, every value optional
  data/           crypto + fiat catalogs (rates here are fallback-only)
  features/       one folder per screen
  hooks/          cross-cutting effects
  i18n/           en.ts / ru.ts / useTranslation — en.ts defines the key type
  lib/            small pure helpers (storage, tab metadata)
  store/          zustand stores: settings (persisted), ui (tabs + toast)
  styles/         tokens.css (design tokens) + global.css (component system)
  telegram/       defensive SDK wrapper; works outside Telegram too
  types/          shared domain types
```

Adding a copy string means adding it to `src/i18n/en.ts`; `ru.ts` is typed
against it, so a missing translation is a compile error.

## Data policy

The catalog carries 33 TON-network crypto assets and 13 fiat currencies. Every rate in
`src/data/*Catalog.ts` is named `fallbackRate` and is a real USD snapshot taken
2026-07-25. It exists so the UI has something to render before the first live
response and if that response fails — per spec §8 these are never presented as
live prices.

Live crypto prices come from one batched CoinGecko `simple/price` call; the
Buy/Sell chart pulls a real 7-day `market_chart` series (hourly granularity,
downsampled to 32 points). There is deliberately no synthetic chart fallback —
a generated curve beside a live price reads as market data, so the sheet shows
an explicit loading or unavailable state instead.
FX defaults to `open.er-api.com`, the one provider of the three that still
serves latest rates without an API key.

In production, both calls go through `/api/coingecko/[...path].js` rather than
the browser calling `api.coingecko.com` directly — CoinGecko is unreachable
from some networks and its free tier rate-limits by client IP, and a same-origin
call sidesteps both. `npm run dev` still talks to CoinGecko directly. See
`.env.example` for overriding either side.

## The catalog is TON-network only

TON Connect gives the app exactly one address on one chain, and nothing derives
a Bitcoin or Ethereum address from it. So the catalog holds only assets that
exist on TON: the native coin, liquid-staking tokens, DeFi and ecosystem jettons.
Assets with no TON presence were removed rather than shown against an address
that cannot receive them.

The native coin itself is `GRAM` (Toncoin renamed Gram after a June 2026
community vote — same CoinGecko id, `the-open-network`, so live pricing needed
no change). The network is still The Open Network (TON); only the coin's own
ticker changed, which is why `tonOnly*` strings and TON Connect still say TON.

USD Coin is present as its TON representation, `jUSDC`, pegged 1:1 — its price
reads from the underlying coin's CoinGecko id, and `wrappedOf` records the
relationship so the UI labels the row "USD Coin · wrapped USDC".

Bitcoin and Ether were dropped rather than shown as `tgBTC`/`jETH`: neither's
CoinGecko listing carries a TON platform contract, so there was no address to
verify a real transfer against, and this catalog would rather not carry an
asset than carry one with a guessed contract. `MAJOR` was dropped for the same
reason. See `cryptoCatalog.ts`'s header comment for the full reasoning and the
GRM/ART corrections (two catalog entries that turned out to be mislabeled once
checked against CoinGecko's and TonAPI's own data).

This departs from spec §3, which asks for per-chain addresses. Per-chain key
derivation can restore that later; faking it cannot.

## What's actually on-chain

Connecting a wallet, reading its real GRAM balance, sending GRAM, and sending
any jetton in the catalog are all real, signed TON Connect operations — every
asset here that has a verified `jettonMaster` sends for real, not a local
debit. Everything else that looks like a balance (fiat, the virtual card) is
a plain number this app tracks itself; Buy and Swap adjust that number and
nothing more — they need a real on/off-ramp and DEX integration respectively,
which is a separate piece of work from moving an asset you already hold.

A jetton send resolves the *sender's own* jetton-wallet address first (via
TonAPI, proxied through `api/tonapi.js` in production for the same reason as
the CoinGecko proxy), then builds a standard TEP-74 transfer body (op
`0xf8a7ea5`) with `@ton/core` and sends it there with ~0.05 TON attached for
gas — never straight to the jetton master or the recipient. The recipient's
own jetton wallet is deployed automatically if it doesn't exist yet; unused
gas is refunded. `decimals` matters here more than anywhere else in the app:
it is not always 9 (USDT/jUSDC are 6, GOMINING is 18, WEB3 is 3), and using
the wrong one would send the wrong amount by orders of magnitude — every
value in the catalog was read from TonAPI's on-chain metadata, not assumed.

## Asset icons

Every catalog entry has a vector mark in `src/components/icons/AssetIcons.tsx` —
no text glyphs, no monograms. All are drawn on a 24x24 grid at stroke weight 1.7
and render in a fixed 20x20 box (14x14 in chips, via CSS), so they stay
optically consistent everywhere. The marks are abstract geometry rather than
brand logos, matching the mockup's own stated approach.

## Security model

There is no app-entry lock — spec §10 forbids one, and it was removed from the
design deliberately. Security is per-action instead:

- **Passcode** — a 4-digit code stored as a PBKDF2-SHA256 digest with a random
  per-device salt. Asked when sending crypto and when revealing full card
  details — the one action that moves funds out irreversibly, and the one
  view that exposes the card number and CVV. Offered at the end of onboarding
  and toggleable in Settings › Security.
- **Biometric lock** — Telegram's real `BiometricManager` inside a Telegram
  client; a WebAuthn platform-authenticator prompt (Face ID / Touch ID /
  Windows Hello) when opened as a plain HTTPS page instead. When on, the
  passcode prompt attempts a scan first, so it dismisses the prompt without
  typing and the keypad stays as the fallback. Elsewhere it adds a scan on top
  of the confirm dialog. The WebAuthn path stores only a local credential
  handle — there is no server, so it proves "the same device unlocked this
  again," nothing more.

Honest scope: the passcode protects against someone holding an unlocked phone.
It is not server-verified, so it cannot stop an attacker who can already run
code in this browser profile. Account-level security needs a backend.

## Transaction notifications

Successful receive / send / buy / swap events are relayed to the user's
Telegram chat. The Mini App **cannot** call the Bot API itself: that needs the
bot token, and anything in this bundle is readable by any user — a leaked token
means a hijacked bot. So the client POSTs the event to a relay endpoint and the
token stays server-side.

The relay exists twice, same logic, two hosts:

- **`api/notify.js`** — a Vercel serverless function. The app's default
  `VITE_NOTIFY_ENDPOINT` (`/api/notify`) already points at it, so on Vercel
  there is nothing to configure beyond the token: Project Settings ›
  Environment Variables › add `BOT_TOKEN` (the value from @BotFather), then
  redeploy so the function picks it up.
- **`server/notify-bot.mjs`** — a standalone Node server for any other host
  (`BOT_TOKEN=... node server/notify-bot.mjs`); point `VITE_NOTIFY_ENDPOINT`
  at wherever it runs.

Both verify Telegram's signed `initData` before sending, so nobody can POST
someone else's user id, and both reject payloads older than 24h to block
replay. A deployment with no `BOT_TOKEN` set just fails silently — a missed
notification must never make a completed transaction look like it failed.

## Notes on the build

Bottom sheets and the confirm dialog are rendered by `SheetHost`/`App` as
siblings of `.content`, never inside a screen. `.content` is a stacking context
(`z-index: 2`) and the tab bar is `z-index: 5`, so a sheet rendered inside a
screen sits *below* the tab bar and the tab bar swallows its taps. Swap's asset
picker follows the same rule — its open/target state lives in `swapStore`
rather than local to `SwapScreen`, specifically so `SwapAssetPicker` can be
mounted at the app-shell level too.

`@tonconnect/ui-react` dominates the bundle (~211 kB of the ~212 kB gzip total).
It is needed at launch to restore an existing wallet session; if that startup
cost matters, lazy-loading the provider is the lever.

`backdrop-filter` pairs in `global.css` list the `-webkit-` alias **first** and
the standard property **last**. The CSS minifier collapses the two as equivalent
and keeps only the later declaration; with the reverse order the standard
property was dropped from the production bundle and every glass surface rendered
flat. See the header comment in `src/styles/global.css`.

## Deployment checklist

- Host over HTTPS and point `VITE_TONCONNECT_MANIFEST_URL` at the deployed
  `tonconnect-manifest.json` (update its `url` and `iconUrl` to real values).
- Register the Mini App with BotFather (`/newapp`) using `public/app_icon.svg`.
- Set a CoinGecko key for production; the free tier rate-limits aggressively.

## Status

- [x] Phase 1 — foundation: scaffold, design tokens, glass system, Telegram init,
      EN/RU auto-detection, settings persistence, env config
- [x] Phase 2 — tab navigation + splash animation
- [x] Phase 3 — Wallet tab (TON Connect, CoinGecko, Receive/Send/Buy) and the
      shared confirm dialog, pulled forward per spec §9 step 4
- [x] Phase 4 — Bank tab: live FX, fiat list with swipe-to-delete, virtual card
- [x] Phase 5 — Swap: unified crypto/fiat picker, live rate, confirm dialog
      (the confirm dialog itself shipped in Phase 3, ahead of schedule)
- [x] Phase 6 — Settings, onboarding, send passcode, transaction notifications
