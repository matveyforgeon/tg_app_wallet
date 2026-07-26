import { create } from 'zustand';
import { DEFAULT_CARD_COLOR, type CardColorId } from '@/data/cardPalettes';
import { readJson, removeKey, writeJson } from '@/lib/storage';

export interface VirtualCard {
  number: string;
  cvv: string;
  holder: string;
  colorId: CardColorId;
  /** MM/YY */
  exp: string;
  frozen: boolean;
}

interface CardState {
  card: VirtualCard | null;
  /** Full number + CVV are shown only after the confirm dialog (spec §3). */
  revealed: boolean;

  create: (holder: string, colorId: CardColorId) => void;
  toggleFreeze: () => void;
  reveal: () => void;
  hide: () => void;
  remove: () => void;
}

const STORAGE_KEY = 'card';

/**
 * Client-side card issuance.
 *
 * Real issuance needs a BaaS/card-issuing partner; until then the number, CVV
 * and the "VISA" wordmark are placeholders generated locally (spec §3). Nothing
 * here talks to a network, and the details are not secrets.
 */

function genNumber(): string {
  let n = '4';
  for (let i = 0; i < 15; i += 1) n += Math.floor(Math.random() * 10);
  return n;
}

function genCvv(): string {
  return String(Math.floor(100 + Math.random() * 900));
}

function expiryThreeYearsOut(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 3);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
}

function load(): VirtualCard | null {
  const stored = readJson<Partial<VirtualCard> | null>(STORAGE_KEY, null);
  if (!stored || typeof stored.number !== 'string' || typeof stored.cvv !== 'string') return null;
  return {
    number: stored.number,
    cvv: stored.cvv,
    holder: typeof stored.holder === 'string' ? stored.holder : '',
    colorId: (stored.colorId as CardColorId) ?? DEFAULT_CARD_COLOR,
    exp: typeof stored.exp === 'string' ? stored.exp : expiryThreeYearsOut(),
    frozen: stored.frozen === true,
  };
}

export const useCardStore = create<CardState>((set, get) => ({
  card: load(),
  // Never restored from storage — a reload re-masks the details.
  revealed: false,

  create: (holder, colorId) => {
    const card: VirtualCard = {
      number: genNumber(),
      cvv: genCvv(),
      holder: holder.toUpperCase(),
      colorId,
      exp: expiryThreeYearsOut(),
      frozen: false,
    };
    set({ card, revealed: false });
    writeJson(STORAGE_KEY, card);
  },

  toggleFreeze: () => {
    const card = get().card;
    if (!card) return;
    const next = { ...card, frozen: !card.frozen };
    set({ card: next });
    writeJson(STORAGE_KEY, next);
  },

  reveal: () => set({ revealed: true }),
  hide: () => set({ revealed: false }),

  remove: () => {
    set({ card: null, revealed: false });
    removeKey(STORAGE_KEY);
  },
}));

export function maskCardNumber(number: string): string {
  return `${number.slice(0, 4)} •••• •••• ••••`;
}

export function groupCardNumber(number: string): string {
  return number.match(/.{1,4}/g)?.join(' ') ?? number;
}
