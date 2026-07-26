/**
 * Same relay as `server/notify-bot.mjs`, packaged as a Vercel serverless
 * function so it deploys with the frontend instead of needing separate
 * hosting. Set `BOT_TOKEN` in the Vercel project's Environment Variables —
 * never in a file that gets committed.
 *
 * The app already defaults `VITE_NOTIFY_ENDPOINT` to `/api/notify` (same
 * origin, no CORS needed).
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

const BOT_TOKEN = process.env.BOT_TOKEN;

/**
 * Validates Telegram WebApp initData per Telegram's documented scheme:
 * secret = HMAC_SHA256("WebAppData", bot_token), then compare the hash over
 * the sorted key=value pairs. Returns the authenticated user id, or null.
 */
function verifyInitData(initData) {
  if (!initData || !BOT_TOKEN) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');

  const checkString = [...params.entries()]
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('\n');

  const secret = createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
  const expected = createHmac('sha256', secret).update(checkString).digest('hex');

  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  // Reject stale payloads so a captured initData cannot be replayed forever.
  const authDate = Number(params.get('auth_date') ?? 0);
  if (!authDate || Date.now() / 1000 - authDate > 86_400) return null;

  try {
    return JSON.parse(params.get('user') ?? '{}').id ?? null;
  } catch {
    return null;
  }
}

const TITLES = {
  receive: { en: 'Crypto received', ru: 'Криптовалюта получена' },
  send: { en: 'Crypto sent', ru: 'Криптовалюта отправлена' },
  buy: { en: 'Crypto purchased', ru: 'Криптовалюта куплена' },
  buyCard: { en: 'Card purchase', ru: 'Покупка с карты' },
  swap: { en: 'Swap completed', ru: 'Обмен выполнен' },
};

function buildMessage({ kind, summary, lang }) {
  const title = (TITLES[kind] ?? TITLES.send)[lang === 'ru' ? 'ru' : 'en'];
  return `✅ *${title}*\n\`${summary}\``;
}

async function sendMessage(chatId, text) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });
  if (!res.ok) console.error('sendMessage failed', res.status, await res.text());
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!BOT_TOKEN) {
    console.error('BOT_TOKEN is not set on this deployment');
    return res.status(500).end();
  }

  try {
    const payload = req.body ?? {};

    // Trust the signed initData, never the client-supplied user id.
    const userId = verifyInitData(payload.initData);
    if (!userId) return res.status(401).end('invalid initData');

    const allowed = new Set(['receive', 'send', 'buy', 'buyCard', 'swap']);
    if (!allowed.has(payload.kind)) return res.status(400).end('unknown kind');
    if (typeof payload.summary !== 'string' || payload.summary.length > 200) {
      return res.status(400).end('bad summary');
    }

    await sendMessage(userId, buildMessage(payload));
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(400).end('bad request');
  }
}
