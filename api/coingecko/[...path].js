/**
 * Same-origin proxy for CoinGecko.
 *
 * The client used to call api.coingecko.com directly from the phone's own
 * network. CoinGecko is unreachable from some networks/regions and the free
 * tier rate-limits by client IP, and a mobile carrier's shared IP hits that
 * limit fast. Routing the request through this Vercel function instead means
 * it leaves from Vercel's network, sidestepping both problems for every user,
 * not just the ones on an affected network.
 *
 * `src/config/env.ts` points `VITE_COINGECKO_API_BASE` at `/api/coingecko` by
 * default in production builds; `services/coingecko.ts` is otherwise unaware
 * this proxy exists.
 */

export default async function handler(req, res) {
  const segments = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean);
  const path = segments.map(encodeURIComponent).join('/');

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path') continue;
    if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
    else if (value !== undefined) params.append(key, value);
  }

  const base = process.env.COINGECKO_API_BASE || 'https://api.coingecko.com/api/v3';
  const url = `${base}/${path}${params.toString() ? `?${params}` : ''}`;

  const headers = {};
  const apiKey = process.env.COINGECKO_API_KEY;
  if (apiKey) {
    headers[base.includes('pro-api') ? 'x-cg-pro-api-key' : 'x-cg-demo-api-key'] = apiKey;
  }

  try {
    const upstream = await fetch(url, { headers });
    const body = await upstream.text();
    res.status(upstream.status);
    res.setHeader('content-type', upstream.headers.get('content-type') ?? 'application/json');
    // A short shared cache means many clients polling at once cost one
    // upstream call instead of one each.
    res.setHeader('cache-control', 's-maxage=20, stale-while-revalidate=40');
    res.send(body);
  } catch (error) {
    console.error('coingecko proxy failed', error);
    res.status(502).json({ error: 'upstream fetch failed' });
  }
}
