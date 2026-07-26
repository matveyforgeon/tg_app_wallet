/**
 * Same-origin proxy for TonAPI (tonapi.io), same reasoning and shape as
 * `api/coingecko.js`: resolving a jetton wallet address at send time is a
 * client-side call the browser would otherwise make directly, which is
 * exactly the class of request that can be unreachable or rate-limited
 * depending on the caller's network. Routing it through Vercel's network
 * sidesteps that for every user.
 *
 * `src/config/env.ts` points `VITE_TONAPI_BASE` at `/api/tonapi` by default
 * in production builds; `services/jetton.ts` builds the `path` param, so
 * this proxy's existence is otherwise invisible to it.
 */

export default async function handler(req, res) {
  const path = typeof req.query.path === 'string' ? req.query.path : '';
  if (!path) return res.status(400).json({ error: 'missing path' });

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path') continue;
    if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
    else if (value !== undefined) params.append(key, value);
  }

  const base = process.env.TONAPI_BASE || 'https://tonapi.io/v2';
  const url = `${base}/${path}${params.toString() ? `?${params}` : ''}`;

  const headers = {};
  const apiKey = process.env.TONAPI_API_KEY;
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  try {
    const upstream = await fetch(url, { headers });
    const body = await upstream.text();
    res.status(upstream.status);
    res.setHeader('content-type', upstream.headers.get('content-type') ?? 'application/json');
    res.setHeader('cache-control', 's-maxage=5, stale-while-revalidate=10');
    res.send(body);
  } catch (error) {
    console.error('tonapi proxy failed', error);
    res.status(502).json({ error: 'upstream fetch failed' });
  }
}
