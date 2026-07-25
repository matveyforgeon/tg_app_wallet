# Telegram Mini App — Crypto + Bank Wallet
## Build spec for Claude Code

This is a non-custodial Telegram Mini App combining a crypto wallet (majors + meme coins), a multi-currency fiat balance view with a virtual bank card, and a unified swap. Bilingual (EN/RU), auto-detected from Telegram. Visual style: "liquid glass + holographic", premium/expensive feel, dark-first with a working light theme.

A working HTML/CSS/JS mockup of this exact app already exists — attach `mini_app_mockup.html` and `app_icon.svg` to the project and tell me to match them pixel-for-pixel for styling, animation timing, and copy. Everything below describes what that mockup does, so you can rebuild it as a real React app with actual working settings, real APIs, and a proper backend.

---

## 1. Tech stack

- **Framework:** React + Vite
- **Telegram integration:** `@telegram-apps/sdk` (or `@twa-dev/sdk`) — theme params, viewport, main button, and **`initDataUnsafe.user.language_code`** for auto language detection
- **Wallet connection:** TON Connect (`@tonconnect/ui-react`)
- **Component base:** `@telegram-apps/telegram-ui` if you want native-feeling primitives, otherwise custom components matching the design system below
- **Styling:** CSS (the mockup uses plain CSS with custom properties — Tailwind is fine too if preferred, just preserve the exact tokens below)
- **State:** React Context or Zustand — needs to hold wallet balances, bank balances, the virtual card, and settings/language/theme, since many screens read/write the same state (e.g. a Swap changes both Wallet and Bank balances)
- **Data:**
  - Crypto prices: CoinGecko API (free tier) or a paid feed for production
  - FX rates: exchangerate.host, Open Exchange Rates, or similar
  - **Important:** all prices/rates in the mockup are hardcoded mock values. Replace every hardcoded `rate` in the catalogs with a live API call, cached and refreshed periodically (e.g. every 30–60s while the app is open).

---

## 2. Design system

### Colors
```css
--bg-void: #060608;              /* app background, dark theme */
--glass-fill: rgba(255,255,255,0.045);
--glass-fill-strong: rgba(255,255,255,0.075);
--glass-border: rgba(255,255,255,0.14);
--glass-border-soft: rgba(255,255,255,0.07);
--card-solid: rgba(18,18,26,0.94); /* opaque card variant — see note below */
--text: #f3f2f7;
--text-dim: #9a97a8;
--text-faint: #625f70;
--holo-1: #7c6bf0;   /* indigo-violet accent */
--holo-2: #4f7dfc;   /* blue accent */
--danger: #ff6b6b;
--up: #6ee7b7;
```
Light theme overrides: `--bg-void:#eef0f4; --glass-fill:rgba(255,255,255,0.55); --text:#14141c;` etc. — see mockup for full light-theme variable set.

**Important lesson from the mockup:** don't use translucent glass (`backdrop-filter: blur`) on any card that sits directly in front of a solid colored element (like a swipe-to-delete red background). The blur pulls that color through and tints the whole card. Use an opaque `--card-solid` background for those specific cards instead of the translucent glass treatment.

### Typography
- **Display / numbers / headers:** `Space Grotesk` (600–700 weight)
- **Body:** `Inter`
- Balance figures, tab labels, buttons, and section titles all use Space Grotesk — this pairing is a deliberate part of the "expensive" feel, don't substitute a single generic system font.

### Signature visual elements
1. **Glass cards** everywhere: `backdrop-filter: blur(22px) saturate(160%)`, thin 1px border at `rgba(255,255,255,0.14)`, subtle inset highlight shadow.
2. **Balance hero card** has a slow diagonal sheen animation sweeping across it (`background-position` animated linear-gradient at low opacity) — subtle, calm, not flashy.
3. **Background waves:** two thin glowing SVG line-strokes (not filled blobs) in a single blue-purple gradient, blurred via layered `drop-shadow` for a neon-line look, each with a different organic curve shape (one tighter zigzag, one broad smooth sweep), drifting slowly (24–30s loop) via `transform: translate()`. Low opacity, ambient rather than garish.
4. **Neon tab bar icons:** custom inline SVG line icons (wallet, bank/columns, swap arrows, gear) — not emoji. Active tab icon gets a `drop-shadow` glow in the accent colors.
5. **Bottom sheets** for every picker/modal (asset picker, add-currency, receive, send, buy/sell, base-currency, create-card) — slide up from the bottom, glass background, rounded top corners, backdrop dim + blur behind them.
6. **Centered confirm dialogs** (distinct from bottom sheets — see section 4) for anything destructive or financially consequential.

**Explicitly rejected directions — do not reintroduce these:**
- A multi-color "rainbow" gradient border or animated rainbow text effect anywhere.
- Heavy/bright neon glow on the bank card or background waves — both were dialed back significantly across iterations in favor of restrained, "expensive" subtlety. If in doubt, go dimmer/thinner, not brighter/thicker.
- A PIN/passcode security gate for the whole app — this was built, then explicitly removed. Don't rebuild an app-wide PIN lock unless asked. Sensitive actions instead use the confirm-dialog pattern (section 4).

---

## 3. Screens & features

Tab order: **Wallet → Bank → Swap → Settings**

### Wallet
- Hero card: **total balance**, computed live as `sum(crypto holdings × price) + sum(bank fiat balances converted to base currency)` — not a static number.
- Quick actions: **Receive, Send, Buy** (no Swap button here — Swap has its own tab).
- Asset list below, each row: icon, name, holding amount, USD value, 24h change %.

### Bank
Two sections, top to bottom:

**1. Virtual card**
- If no card exists: a dashed "Create virtual card" CTA.
- Creating a card opens a sheet asking for: **cardholder name** (free text) and **card color** — exactly 4 options, each a deep metallic gradient swatch, in this order: **violet, red, white, black**. Metallic = multi-stop diagonal gradient per color, not a flat fill. White needs dark text on the card face; the other three need light text — handle this via a per-palette `text` color, not a hardcoded white.
- Card visual: rounded (22px) card face with a realistic chip graphic (SVG, gold gradient with EMV-style divider lines — not a flat yellow rectangle), network wordmark, masked number, cardholder name, expiry, CVV. Keep the neon rim glow **subtle** — a thin 1px tinted border plus a soft ~9px glow is enough; avoid a wide bright halo. This was dialed back twice during iteration — err toward too subtle rather than too bright.
- **Card number and CVV are masked by default** (`XXXX •••• •••• ••••` / `•••`) and stay masked. A **"View details"** button, gated behind the confirm dialog (section 4), temporarily reveals the full number and CVV; hiding them again does not require confirmation.
- Other actions: **Freeze/Unfreeze** (frozen state visually desaturates the card + shows a "FROZEN" badge) and **Delete** (gated behind the confirm dialog — deleting a card is destructive).
- All card action icons are custom inline SVGs (freeze/unfreeze, trash, eye/eye-off) matching the tab bar's line-icon style — no emoji.
- In the real app: card issuance is not something you can build yourself — it needs a card-issuing partner (e.g. a BaaS/card-issuing API). The mockup fakes the whole thing client-side (random number/CVV, generic "VISA" wordmark placeholder) — replace with your actual issuer's branding once you have one.

**2. Fiat balances**
- List of fiat balances, sorted **descending by USD-equivalent value**.
- Each row: flag, currency code, balance (no "US Account" style subtitle — just code + amount).
- **Swipe left** on a row to reveal a delete action; deleting is gated by two checks: (a) balance must be exactly 0, and (b) the confirm dialog (section 4).
- **"+ Add currency"** row at the bottom opens a searchable picker (13+ currencies: USD, EUR, RUB, SGD, GBP, JPY, CNY, AED, CHF, TRY, INR, BRL, KZT in the mockup — expand as needed). Selecting adds a new balance card starting at 0.

### Swap
- Two asset pills (from/to), each **tappable** — opens a bottom sheet with two tabs, **Crypto** and **Currency**, each independently searchable. This lets any combination happen: crypto↔crypto, crypto↔fiat, fiat↔fiat, from one unified picker (no separate "mode" buttons).
- Center flip button is bidirectional (⇅ style, not a one-way arrow) and swaps the two selected assets.
- Live-updating exchange rate hint and estimated output amount as the user types.
- **"Review Swap"** validates balance first (insufficient balance → inline error, no dialog needed for that). If valid, it opens the **confirm dialog** (section 4) showing a plain-language summary (e.g. "1.5 TON → 42.18 PEPE"). Only on confirming does the swap actually execute (deduct/credit holdings) and show a success toast.

### Buy / Sell (opened from Wallet → Buy)
- Asset quick-select chips (a handful of popular coins).
- A small price chart per asset — **each asset should have a visually distinct, organic-looking chart shape** (not a uniform, mechanically-perfect zigzag); vary this with real historical price data once you're pulling from an API.
- Buy/Sell toggle, amount field with live USD estimate. **Confirm** opens the confirm dialog with a summary ("0.5 TON ≈ $47.22") before actually adjusting the holding.

### Receive
- Asset chips; selecting an asset **changes the displayed address** to match that asset's actual chain format (TON addresses look different from BTC bech32, ETH hex, Solana base58, etc. — the mockup fakes this with per-chain mock strings; in the real app this should be the user's actual derived/connected address per chain).
- No copy button in the current design (deliberately removed) — if you want to reintroduce one, ask first rather than assuming it belongs back.

### Send
- Asset chips, recipient address field, amount field. **Confirm** validates balance, then opens the confirm dialog with a summary ("0.2 ETH → 0x8f3C...E0a7F") before actually deducting and sending.

### Settings
Only two settings are real; the rest are intentionally still placeholders:

| Item | Status | What "real" means |
|---|---|---|
| Dark mode | ✅ Working | — |
| Base currency (RUB/USD/EUR) | ✅ Working | — |
| Notifications toggle | ❌ Cosmetic only | Should persist and gate real push notification subscriptions |
| Biometric lock | ❌ Cosmetic only | Real Telegram biometry API integration, later phase |
| Two-factor authentication | ❌ Cosmetic only | Needs a real backend enrollment/verification flow |
| Change PIN | ❌ Shows a toast | **Do not build an app-wide PIN system** — this was tried and explicitly removed from the design. If real security work is wanted later, scope it as gating specific sensitive actions, not an app-entry lock screen |
| Help Center / Contact Support / Terms | ❌ Shows a toast | Link out to real pages or an in-app webview |
| Log out | ❌ Shows a toast | Should actually clear session/local state and return to a logged-out/connect-wallet screen |
| Connected wallet, Language, App version | Static display only | Fine as-is, just wire to real values |

---

## 4. The confirm dialog pattern (important — reused everywhere)

A single, reusable **centered modal** (not a bottom sheet) is used for every consequential or destructive action:
- Delete virtual card
- View full card details
- Delete a fiat currency from Bank
- Execute a swap
- Execute a buy or a sell
- Execute a send

Structure: title, one-line plain-language message describing the consequence/summary, and two buttons — **Cancel** (neutral glass style) and **Confirm** (accent gradient for normal actions, red gradient for destructive ones like delete). Tapping outside the box also cancels.

This replaced an earlier, more heavyweight idea (a full PIN-entry screen for every sensitive action) — the lighter confirm-dialog pattern was preferred. Keep it lightweight; don't add password/PIN entry into this dialog.

---

## 5. Bilingual (EN/RU)

- Auto-detect on load from `window.Telegram.WebApp.initDataUnsafe.user.language_code` (fallback to browser locale if not in Telegram).
- Manual EN/RU toggle in the top bar always available.
- **On manual language switch:** show a brief loading state (small spinner overlay, ~500ms) before applying the new language.
- All copy needs both EN and RU strings — see the mockup's `i18n` object for the full existing string set and key naming convention to follow.

---

## 6. Splash / welcome screen

On app launch (once per session):
1. App icon badge (see section 7) fades and scales in over ~0.9s.
2. After a ~0.6s delay, the welcome text (**"WELCOME"** / **"ДОБРО ПОЖАЛОВАТЬ"**, uppercase, bold, tracked-out letterspacing) reveals next to the icon over ~1.4s using `opacity` + `clip-path: inset()` — **not** `width`/`max-width`, which caused a visible layout-thrash "hitch" at the end of the animation. `clip-path` + `opacity` are GPU-composited and read as one continuous motion.
3. Both animations use the same symmetric easing curve, `cubic-bezier(0.65, 0, 0.35, 1)` (slow → fast → slow), so the whole sequence feels like one unified gesture.
4. After ~2.5s total, the whole splash fades out (0.5s) revealing the Wallet tab.

Text should match the detected language immediately (no flash of English before switching).

---

## 7. Icon / branding asset

`app_icon.svg` (512×512, 1:1) is attached — a rounded-square gradient badge (indigo→blue, matching `--holo-1`→`--holo-2`) containing a custom mark: a coin ring with a wave line passing through it, echoing the background wave motif used throughout the app. Use this as the actual Telegram Mini App icon (set via BotFather `/newapp`) and as the splash logo.

---

## 8. Data notes — read before wiring up real prices

The mockup's crypto/fiat rates are a **hardcoded snapshot**, not live data. Do not ship these numbers as real prices. Before launch:
- Replace all crypto rates with a live CoinGecko (or equivalent) call.
- Replace all FX rates with a live FX API call.
- Add loading/error states for when those calls fail (the mockup has none, since it never calls a real API).
- Consider rate-limit-friendly caching (don't call on every keystroke in the Swap input — debounce it).

---

## 9. Suggested build order

1. Scaffold: Vite + React + Telegram SDK + TON Connect, get the tab bar and navigation working with the design tokens above.
2. Wallet tab with real TON Connect balance (start with just this one real number, everything else can stay mock a bit longer).
3. Bank tab UI: fiat list (swipe-to-delete, add-currency) with mock balances, then the virtual card UI (mock data client-side is fine for a first pass — real card issuance needs a BaaS partner, see section 3).
4. Build the shared **confirm dialog** component early (section 4) — you'll reuse it across Bank, Swap, Buy/Sell, and Send.
5. Swap tab with the unified crypto/currency picker, using live prices from CoinGecko for at least the crypto side, wired through the confirm dialog.
6. Settings: get Dark mode, Base currency, and Notifications persisting properly (localStorage is fine for a first pass; move to backend once you have user accounts).
7. Splash screen + language detection + language-switch spinner.
8. Receive/Send/Buy sheets, all wired through the confirm dialog — these are the most "fake" parts of the mockup and need the most real backend work (actual address derivation, actual transaction signing via TON Connect, actual buy/sell routed through an exchange or DEX aggregator API, actual card issuance via a BaaS partner).
9. Only after all of the above is stable: consider real security work (2FA, sensitive-action gating) as its own later phase, scoped as securing individual actions rather than an app-wide PIN lock screen.

---

## 10. What NOT to touch without asking

- Do not silently change the color palette, font pairing, or animation curves — these were iterated on deliberately across many rounds and are considered final.
- Do not reintroduce a multi-color "rainbow" gradient border/text effect anywhere.
- Do not brighten the card or background-wave glow beyond what's described above — it was deliberately dialed back multiple times.
- Do not build an app-wide PIN/passcode lock screen — it was built and explicitly removed in favor of the confirm-dialog pattern.
- Keep the tab order (Wallet, Bank, Swap, Settings), the "no Swap button in Wallet's quick actions" decision, and the card color order (violet, red, white, black).
