/**
 * Transaction-notification relay for the Mini App.
 *
 * The Mini App cannot send Telegram messages itself: that needs the bot token,
 * and any token shipped in a frontend bundle is trivially extracted and used to
 * take over the bot. This tiny server holds the token and is the only thing
 * that talks to the Bot API.
 *
 * It verifies Telegram's `initData` signature before sending, so a stranger
 * cannot POST someone else's user id and spam their chat.
 *
 *   BOT_TOKEN=123:ABC node server/notify-bot.mjs
 *
 * Then point the app at it:
 *   VITE_NOTIFY_ENDPOINT=https://your-host/notify
 *   VITE_NOTIFY_SEND_INIT_DATA=true
 *
 * Deploys as-is to any Node host; the handler body also drops straight into a
 * Vercel/Netlify/Cloudflare function.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';

const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = Number(process.env.PORT ?? 8787);
// Lock this to your Mini App's origin in production.
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? '*';

if (!BOT_TOKEN) {
  console.error('BOT_TOKEN is required');
  process.exit(1);
}

/**
 * Validates Telegram WebApp initData per Telegram's documented scheme:
 * secret = HMAC_SHA256("WebAppData", bot_token), then compare the hash over
 * the sorted key=value pairs. Returns the authenticated user id, or null.
 */
function verifyInitData(initData) {
  if (!initData) return null;
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

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      // Reject oversized bodies rather than buffering them.
      if (data.length > 16_384) reject(new Error('payload too large'));
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  res.setHeader('access-control-allow-origin', ALLOWED_ORIGIN);
  res.setHeader('access-control-allow-headers', 'content-type');
  res.setHeader('access-control-allow-methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.writeHead(204).end();
  if (req.method !== 'POST') return res.writeHead(405).end();

  try {
    const payload = JSON.parse(await readBody(req));

    // Trust the signed initData, never the client-supplied user id.
    const userId = verifyInitData(payload.initData);
    if (!userId) return res.writeHead(401).end('invalid initData');

    const allowed = new Set(['receive', 'send', 'buy', 'buyCard', 'swap']);
    if (!allowed.has(payload.kind)) return res.writeHead(400).end('unknown kind');
    if (typeof payload.summary !== 'string' || payload.summary.length > 200) {
      return res.writeHead(400).end('bad summary');
    }

    await sendMessage(userId, buildMessage(payload));
    res.writeHead(204).end();
  } catch (error) {
    console.error(error);
    res.writeHead(400).end('bad request');
  }
});

server.listen(PORT, () => console.log(`notify relay listening on :${PORT}`));
