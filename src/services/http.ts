export class HttpError extends Error {
  readonly status: number;
  /** True for 429 and 5xx — worth backing off rather than treating as fatal. */
  readonly retryable: boolean;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.retryable = status === 429 || status >= 500;
  }
}

const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * `fetch` + JSON with a hard timeout. Every caller is expected to catch and
 * fall back to cached or snapshot data — no network path in this app is allowed
 * to leave the UI without something to render (spec §8).
 */
export async function getJson<T>(
  url: string,
  options: { headers?: Record<string, string>; timeoutMs?: number } = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = globalThis.setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { accept: 'application/json', ...options.headers },
    });
    if (!response.ok) {
      throw new HttpError(response.status, `${response.status} ${response.statusText} for ${url}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}
