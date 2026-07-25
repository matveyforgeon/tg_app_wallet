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
| Prices | CoinGecko (crypto) + open.er-api.com (FX) |

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

The catalog carries 54 crypto assets and 13 fiat currencies. Every rate in
`src/data/*Catalog.ts` is named `fallbackRate` and is a real USD snapshot taken
2026-07-25. It exists so the UI has something to render before the first live
response and if that response fails — per spec §8 these are never presented as
live prices.

Live crypto prices come from one batched CoinGecko `simple/price` call; the
Buy/Sell chart pulls a real 7-day `market_chart` series (hourly granularity,
downsampled to 32 points) and falls back to a deterministic per-asset shape.
FX defaults to `open.er-api.com`, the one provider of the three that still
serves latest rates without an API key.

## Notes on the build

Bottom sheets and the confirm dialog are rendered by `SheetHost`/`App` as
siblings of `.content`, never inside a screen. `.content` is a stacking context
(`z-index: 2`) and the tab bar is `z-index: 5`, so a sheet rendered inside a
screen sits *below* the tab bar and the tab bar swallows its taps.

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
- [ ] Phase 4 — Bank tab + virtual card
- [ ] Phase 5 — confirm dialog + Swap
- [ ] Phase 6 — Settings + polish
