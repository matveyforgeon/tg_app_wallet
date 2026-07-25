import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import '@/styles/tokens.css';
import '@/styles/global.css';

import { App } from '@/App';
import { env } from '@/config/env';
import { initTelegram } from '@/telegram/telegram';

// Ready/expand before first paint so the viewport is correct from frame one.
initTelegram();

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container #root not found');
}

createRoot(container).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl={env.tonConnect.manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </StrictMode>,
);
