export interface CardPalette {
  id: CardColorId;
  /** Deep metallic finish: a multi-stop diagonal gradient, never a flat fill. */
  grad: string;
  /** Rim tint and the two soft radial washes on the card face. */
  glow: string;
  /**
   * Face text colour. White needs dark text; the other three need light — this
   * is why it is a per-palette value and not a hardcoded #fff (spec §3).
   */
  text: string;
}

export type CardColorId = 'violet' | 'red' | 'white' | 'black';

/**
 * The four card finishes.
 *
 * Order is violet → red → white → black and is fixed by spec §10. Do not
 * reorder, rename or add to this list without asking.
 */
export const CARD_PALETTES: readonly CardPalette[] = [
  {
    id: 'violet',
    grad: 'linear-gradient(135deg, #241247 0%, #3d1f7a 45%, #150a33 100%)',
    glow: 'rgba(124,80,235,0.4)',
    text: '#fff',
  },
  {
    id: 'red',
    grad: 'linear-gradient(135deg, #3a0f0f 0%, #5c1a1a 45%, #200707 100%)',
    glow: 'rgba(214,80,80,0.4)',
    text: '#fff',
  },
  {
    id: 'white',
    grad: 'linear-gradient(135deg, #cfd3db 0%, #eef0f4 45%, #b7bbc4 100%)',
    glow: 'rgba(255,255,255,0.35)',
    text: '#14141a',
  },
  {
    id: 'black',
    grad: 'linear-gradient(135deg, #111113 0%, #232327 45%, #050506 100%)',
    glow: 'rgba(154,151,168,0.3)',
    text: '#fff',
  },
];

export const DEFAULT_CARD_COLOR: CardColorId = 'violet';

export function findPalette(id: CardColorId): CardPalette {
  return CARD_PALETTES.find((palette) => palette.id === id) ?? CARD_PALETTES[0]!;
}
