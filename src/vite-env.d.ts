/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION?: string;
  readonly VITE_TONCONNECT_MANIFEST_URL?: string;
  readonly VITE_TONCENTER_API_BASE?: string;
  readonly VITE_TONCENTER_API_KEY?: string;
  readonly VITE_COINGECKO_API_BASE?: string;
  readonly VITE_COINGECKO_API_KEY?: string;
  readonly VITE_FX_PROVIDER?: string;
  readonly VITE_FX_API_BASE?: string;
  readonly VITE_FX_API_KEY?: string;
  readonly VITE_RATES_REFRESH_MS?: string;
  readonly VITE_SUPPORT_URL?: string;
  readonly VITE_TERMS_URL?: string;
  readonly VITE_NOTIFY_ENDPOINT?: string;
  readonly VITE_NOTIFY_SEND_INIT_DATA?: string;
  readonly VITE_TONAPI_BASE?: string;
  readonly VITE_TONAPI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
