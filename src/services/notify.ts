import { env } from '@/config/env';
import { getTelegramUser } from '@/telegram/telegram';

/**
 * Transaction notifications delivered to the user's Telegram chat.
 *
 * IMPORTANT — why this posts to your own endpoint instead of calling the Bot
 * API directly: sending a bot message requires the bot token, and anything in
 * this bundle is readable by anyone who opens the app. A leaked token lets a
 * stranger post as your bot, read its updates and hijack it outright. So the
 * client only reports *what happened*; the token stays on your server, which
 * decides whether to send. `server/notify-bot.mjs` is a ready implementation.
 *
 * Failure here is deliberately silent: a missed notification must never make a
 * completed transaction look like it failed.
 */

export type TxKind = 'receive' | 'send' | 'buy' | 'buyCard' | 'swap';

export interface TxNotification {
  kind: TxKind;
  /** Human-readable summary, already formatted: "1.5 TON → 2.21 USDT". */
  summary: string;
  asset: string;
  amount: number;
}

export async function notifyTransaction(payload: TxNotification): Promise<void> {
  const endpoint = env.notify.endpoint;
  if (!endpoint) return;

  const user = getTelegramUser();
  if (!user?.id) return;

  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        telegramUserId: user.id,
        // The server must verify this against its bot token before trusting
        // `telegramUserId` — otherwise anyone could spam any chat.
        initData: env.notify.sendInitData ? getInitData() : undefined,
        at: new Date().toISOString(),
      }),
      keepalive: true,
    });
  } catch {
    /* network failure — the transaction itself already succeeded */
  }
}

function getInitData(): string | undefined {
  try {
    const raw = (globalThis as { Telegram?: { WebApp?: { initData?: string } } }).Telegram?.WebApp
      ?.initData;
    return raw && raw.length > 0 ? raw : undefined;
  } catch {
    return undefined;
  }
}
