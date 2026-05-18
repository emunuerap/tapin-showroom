export type ProductId =
  | 'web-sdk'
  | 'consumer-app'
  | 'hospitality-os'
  | 'messaging'
  | 'ai-core'
  | 'integrations';

export type ProductAudience = 'guest' | 'venue' | 'both';
export type ProductAccent = 'yuzu' | 'neutral';
export type ProductAccentType = 'yuzu' | 'amber' | 'neutral';
export type ProductScene =
  | 'web-sdk'
  | 'consumer-app'
  | 'hospitality-os'
  | 'messaging'
  | 'ai-core'
  | 'integrations';
export type ProductVisualType =
  | 'web-sdk-strip'
  | 'consumer-app-mini'
  | 'hospitality-cockpit'
  | 'messaging-bubbles'
  | 'ai-core-signals'
  | 'integrations-fabric';

export interface ProductDefinition {
  id: ProductId;
  /** 1-based position in the Product Universe (01–06) */
  index: number;
  name: string;
  eyebrow: string;
  /** Long-form editorial headline used in the rail panels (ProductStage) */
  headline: string;
  /** One-sentence editorial description for the hero ActiveProductPreview */
  shortDescription: string;
  /** Extended marketing copy (used in rail panels and elsewhere) */
  longDescription: string;
  /**
   * @deprecated kept for ProductStage back-compat. Prefer `shortDescription`
   * or `longDescription` for new surfaces.
   */
  description: string;
  bullets: string[];
  audience: ProductAudience;
  /** @deprecated legacy 2-value accent — prefer `accentType` for 3-value palette. */
  accent: ProductAccent;
  /** Refined accent palette: yuzu (brand), amber (warmth), neutral (silver). */
  accentType: ProductAccentType;
  /** Discriminator for the small visual fragment shown in ActiveProductPreview. */
  visualType: ProductVisualType;
  scene: ProductScene;
}

export const products: ProductDefinition[] = [
  {
    id: 'web-sdk',
    index: 1,
    name: 'Web SDK',
    eyebrow: 'Installable entrypoint',
    headline: 'Turn traffic into booked guests.',
    shortDescription:
      'A lightweight widget turns existing restaurant traffic into verified guests, intelligent booking intent and payment-ready flow.',
    longDescription:
      'A lightweight widget turns existing restaurant traffic into verified guests, intelligent booking intent, payment-ready flow, and useful memory.',
    description:
      'A lightweight widget turns existing restaurant traffic into verified guests, intelligent booking intent, payment-ready flow, and useful memory.',
    bullets: [
      'Floating TapIn trigger',
      'Bottom sheet reservation flow',
      'OTP · timing · swipe confirm',
    ],
    audience: 'venue',
    accent: 'yuzu',
    accentType: 'yuzu',
    visualType: 'web-sdk-strip',
    scene: 'web-sdk',
  },
  {
    id: 'consumer-app',
    index: 2,
    name: 'Consumer App',
    eyebrow: 'Guest passport',
    headline: 'The app for memory, taste and arrival.',
    shortDescription:
      'A personal dining surface for reservations, Taste Genome, Flashbacks and Gratitude.',
    longDescription:
      'A personal dining surface for taste, memories, reservations, gratitude, and repeat moments that improve every time the guest returns.',
    description:
      'A personal dining surface for taste, memories, reservations, gratitude, and repeat moments that improve every time the guest returns.',
    bullets: ['Taste Genome', 'Reservation wallet', 'Flashbacks · Gratitude'],
    audience: 'guest',
    accent: 'neutral',
    accentType: 'amber',
    visualType: 'consumer-app-mini',
    scene: 'consumer-app',
  },
  {
    id: 'hospitality-os',
    index: 3,
    name: 'Hospitality OS',
    eyebrow: 'Operating layer',
    headline: 'The room, running with intelligence.',
    shortDescription:
      'A live command center for bookings, seating, VIP context, floor pressure and revenue timing.',
    longDescription:
      'Turn scattered data into actionable intelligence. Anticipate guest needs, eliminate no-shows through smart routing, and maximize table yield without sacrificing the art of hospitality.',
    description:
      'Turn scattered data into actionable intelligence. Anticipate guest needs, eliminate no-shows through smart routing, and maximize table yield without sacrificing the art of hospitality.',
    bullets: [
      'Predictive guest routing',
      'Automated table optimization',
      'Real-time revenue protection',
    ],
    audience: 'venue',
    accent: 'yuzu',
    accentType: 'yuzu',
    visualType: 'hospitality-cockpit',
    scene: 'hospitality-os',
  },
  {
    id: 'messaging',
    index: 4,
    name: 'Messaging Layer',
    eyebrow: 'Conversation surface',
    headline: 'Reservations where conversations already happen.',
    shortDescription:
      'WhatsApp and Telegram flows turn natural intent into structured availability and confirmation.',
    longDescription:
      'WhatsApp and Telegram become intent channels: guests ask naturally, TapIn parses the context, returns availability, and confirms with a link.',
    description:
      'WhatsApp and Telegram become intent channels: guests ask naturally, TapIn parses the context, returns availability, and confirms with a link.',
    bullets: [
      'WhatsApp intent parsing',
      'Telegram confirmations',
      'Smart follow-up links',
    ],
    audience: 'both',
    accent: 'neutral',
    accentType: 'neutral',
    visualType: 'messaging-bubbles',
    scene: 'messaging',
  },
  {
    id: 'ai-core',
    index: 5,
    name: 'AI Core',
    eyebrow: 'Optimization engine',
    headline: 'Intelligence without chatbot noise.',
    shortDescription:
      'Tetris Agent, Taste Genome, Sentiment Matrix and Gratitude signals move as one decision layer.',
    longDescription:
      'Taste Genome, Sentiment Matrix, Tetris Agent, Gratitude Protocol, and command parsing form the decision layer that turns signals into action.',
    description:
      'Taste Genome, Sentiment Matrix, Tetris Agent, Gratitude Protocol, and command parsing form the decision layer that turns signals into action.',
    bullets: ['Command parsing', 'Tetris Agent', 'Taste · sentiment signals'],
    audience: 'both',
    accent: 'yuzu',
    accentType: 'yuzu',
    visualType: 'ai-core-signals',
    scene: 'ai-core',
  },
  {
    id: 'integrations',
    index: 6,
    name: 'Integrations & Payments',
    eyebrow: 'Connection fabric',
    headline: 'The room connected to the world.',
    shortDescription:
      'POS, Stripe, NFC, social entry points and web channels connected through TapIn Core.',
    longDescription:
      'TapIn connects website, POS, Stripe, NFC, maps, social, messaging, supplier invoices, and back-office admin into one hospitality protocol.',
    description:
      'TapIn connects website, POS, Stripe, NFC, maps, social, messaging, supplier invoices, and back-office admin into one hospitality protocol.',
    bullets: ['POS · Stripe · NFC', 'WhatsApp · Telegram · Maps', 'Vendor + back-office'],
    audience: 'both',
    accent: 'yuzu',
    accentType: 'amber',
    visualType: 'integrations-fabric',
    scene: 'integrations',
  },
];
