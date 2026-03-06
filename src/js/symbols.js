/**
 * symbols.js
 * Defines all slot symbols: id, name, SVG icon, weight (rarity), and payout multipliers.
 * BOOKOFBO3 - Futuristic Military Slot Engine
 */

export const SYMBOLS = [
  {
    id: 'drone',
    name: 'DRONE',
    rarity: 'legendary',
    weight: 2,
    payouts: { 3: 500, 4: 1000, 5: 2500 },
    color: '#00ff9d',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="32" cy="32" r="4" fill="currentColor"/>
      <line x1="22" y1="32" x2="8" y2="20" stroke="currentColor" stroke-width="2"/>
      <line x1="42" y1="32" x2="56" y2="20" stroke="currentColor" stroke-width="2"/>
      <line x1="22" y1="32" x2="8" y2="44" stroke="currentColor" stroke-width="2"/>
      <line x1="42" y1="32" x2="56" y2="44" stroke="currentColor" stroke-width="2"/>
      <circle cx="8" cy="20" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="56" cy="20" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="8" cy="44" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="56" cy="44" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'skull',
    name: 'SKULL',
    rarity: 'epic',
    weight: 5,
    payouts: { 3: 200, 4: 400, 5: 1000 },
    color: '#ff3c6e',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="26" rx="18" ry="20" fill="none" stroke="currentColor" stroke-width="2"/>
      <rect x="20" y="42" width="24" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="28" y1="42" x2="28" y2="52" stroke="currentColor" stroke-width="2"/>
      <line x1="36" y1="42" x2="36" y2="52" stroke="currentColor" stroke-width="2"/>
      <ellipse cx="24" cy="28" rx="5" ry="6" fill="currentColor" opacity="0.8"/>
      <ellipse cx="40" cy="28" rx="5" ry="6" fill="currentColor" opacity="0.8"/>
      <path d="M28 38 Q32 34 36 38" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'helmet',
    name: 'HELMET',
    rarity: 'rare',
    weight: 10,
    payouts: { 3: 100, 4: 200, 5: 500 },
    color: '#00cfff',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 36 Q12 20 32 14 Q52 20 50 36 L50 46 Q46 52 32 52 Q18 52 14 46 Z" fill="none" stroke="currentColor" stroke-width="2"/>
      <rect x="14" y="36" width="8" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
      <rect x="42" y="36" width="8" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="22" y1="32" x2="42" y2="32" stroke="currentColor" stroke-width="2"/>
      <circle cx="32" cy="22" r="3" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'ammo',
    name: 'AMMO',
    rarity: 'uncommon',
    weight: 18,
    payouts: { 3: 50, 4: 100, 5: 250 },
    color: '#f5a623',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect x="24" y="10" width="16" height="44" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
      <ellipse cx="32" cy="10" rx="8" ry="4" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="24" y1="24" x2="40" y2="24" stroke="currentColor" stroke-width="2"/>
      <line x1="24" y1="36" x2="40" y2="36" stroke="currentColor" stroke-width="2"/>
      <path d="M28 10 L28 6 Q32 3 36 6 L36 10" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'radar',
    name: 'RADAR',
    rarity: 'common',
    weight: 25,
    payouts: { 3: 20, 4: 60, 5: 150 },
    color: '#39ff14',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <circle cx="32" cy="32" r="6" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4"/>
      <line x1="32" y1="10" x2="32" y2="54" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <line x1="10" y1="32" x2="54" y2="32" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <line x1="32" y1="32" x2="52" y2="16" stroke="currentColor" stroke-width="2"/>
      <circle cx="44" cy="20" r="3" fill="currentColor"/>
      <circle cx="32" cy="32" r="3" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'dog_tag',
    name: 'DOG TAG',
    rarity: 'common',
    weight: 40,
    payouts: { 3: 10, 4: 30, 5: 80 },
    color: '#aab8c8',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="16" width="28" height="36" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="32" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="32" y1="16" x2="32" y2="20" stroke="currentColor" stroke-width="2"/>
      <line x1="22" y1="28" x2="42" y2="28" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>
      <line x1="22" y1="34" x2="42" y2="34" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>
      <line x1="22" y1="40" x2="36" y2="40" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>
    </svg>`
  }
];

/**
 * Returns a random symbol based on weighted probability
 */
export function getRandomSymbol() {
  const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const symbol of SYMBOLS) {
    rand -= symbol.weight;
    if (rand <= 0) return symbol;
  }
  return SYMBOLS[SYMBOLS.length - 1];
}

/**
 * Returns payout for a given symbol ID and count (3, 4, or 5)
 */
export function getPayout(symbolId, count) {
  const symbol = SYMBOLS.find(s => s.id === symbolId);
  if (!symbol) return 0;
  return symbol.payouts[count] || 0;
}

export default SYMBOLS;
