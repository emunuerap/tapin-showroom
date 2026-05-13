export type ProductId =
  | 'web-sdk'
  | 'consumer-app'
  | 'hospitality-os'
  | 'messaging'
  | 'ai-core'
  | 'integrations';

export type ProductAudience = 'guest' | 'venue' | 'both';
export type ProductAccent = 'yuzu' | 'amber' | 'neutral';
export type ProductScene =
  | 'web-sdk'
  | 'consumer-app'
  | 'hospitality-os'
  | 'messaging'
  | 'ai-core'
  | 'integrations';

export interface ProductDefinition {
  id: ProductId;
  name: string;
  eyebrow: string;
  headline: string;
  description: string;
  bullets: string[];
  audience: ProductAudience;
  accent: ProductAccent;
  scene: ProductScene;
}

export const products: ProductDefinition[] = [
  {
    id: 'web-sdk',
    name: 'Web SDK',
    eyebrow: 'Installable entrypoint',
    headline: 'A TapIn layer on any restaurant website.',
    description:
      'A lightweight widget turns existing restaurant traffic into verified guests, intelligent booking intent, payment-ready flow, and useful memory.',
    bullets: ['Floating TapIn trigger', 'Bottom sheet reservation flow', 'OTP, timing, party size, swipe confirm'],
    audience: 'venue',
    accent: 'yuzu',
    scene: 'web-sdk',
  },
  {
    id: 'consumer-app',
    name: 'Consumer App',
    eyebrow: 'Guest passport',
    headline: 'The gastronomic passport for people who know how they want to feel.',
    description:
      'A personal dining surface for taste, memories, reservations, gratitude, and repeat moments that improve every time the guest returns.',
    bullets: ['Taste Genome', 'Reservation wallet', 'Flashbacks and Gratitude'],
    audience: 'guest',
    accent: 'amber',
    scene: 'consumer-app',
  },
  {
    id: 'hospitality-os',
    name: 'Hospitality OS',
    eyebrow: 'Room intelligence',
    headline: 'The room starts thinking before service begins.',
    description:
      'A cockpit for floor state, guest cues, no-show risk, server assignment, table shuffling, revenue pressure, and what to do next.',
    bullets: ['Live floorplan', 'Tetris Agent', 'VIP and risk routing'],
    audience: 'venue',
    accent: 'yuzu',
    scene: 'hospitality-os',
  },
  {
    id: 'messaging',
    name: 'Messaging Layer',
    eyebrow: 'Conversation surface',
    headline: 'Reservations where conversations already happen.',
    description:
      'WhatsApp and Telegram become intent channels: guests ask naturally, TapIn parses the context, returns availability, and confirms with a link.',
    bullets: ['WhatsApp intent parsing', 'Telegram confirmations', 'Smart follow-up links'],
    audience: 'both',
    accent: 'neutral',
    scene: 'messaging',
  },
  {
    id: 'ai-core',
    name: 'AI Core',
    eyebrow: 'Optimization engine',
    headline: 'Not chatbot noise. Operational intelligence.',
    description:
      'Taste Genome, Sentiment Matrix, Tetris Agent, and Gratitude Protocol form the decision layer that turns signals into hospitality action.',
    bullets: ['Taste Genome', 'Sentiment Matrix', 'Gratitude Protocol'],
    audience: 'both',
    accent: 'amber',
    scene: 'ai-core',
  },
  {
    id: 'integrations',
    name: 'Integrations & Payments',
    eyebrow: 'Connection fabric',
    headline: 'The guest, the room, and the outside world connected.',
    description:
      'TapIn connects website, POS, Stripe, NFC, maps, social, messaging, and back-office admin into one hospitality protocol.',
    bullets: ['POS and Stripe', 'NFC and web', 'Maps, social, messaging'],
    audience: 'both',
    accent: 'yuzu',
    scene: 'integrations',
  },
];
