/**
 * Uniform Catalog
 * Available uniforms for purchase
 */
export const UNIFORMS = [
  {
    id: 'default_striped',
    name: 'Смугаста форма',
    description: 'Класична смугаста форма (червона/синя)',
    price: 0, // Free/default
    rarity: 'basic',
    jerseyColor: 0xff0000, // Red base
    stripeColor: 0x0000ff, // Blue stripes
    shortsColor: 0x1a3a5c, // Dark blue
    bootsColor: 0xff0000, // Red
    hasStripes: true
  },
  {
    id: 'basic_white',
    name: 'Базова біла',
    description: 'Класична біла форма',
    price: 50,
    rarity: 'basic',
    jerseyColor: 0xffffff,
    shortsColor: 0xffffff,
    bootsColor: 0x000000, // Black boots
    hasStripes: false
  },
  {
    id: 'basic_blue',
    name: 'Базова синя',
    description: 'Класична синя форма',
    price: 50,
    rarity: 'basic',
    jerseyColor: 0x0066cc,
    shortsColor: 0x0066cc,
    bootsColor: 0x000000,
    hasStripes: false
  },
  {
    id: 'basic_red',
    name: 'Базова червона',
    description: 'Класична червона форма',
    price: 50,
    rarity: 'basic',
    jerseyColor: 0xcc0000,
    shortsColor: 0xcc0000,
    bootsColor: 0x000000,
    hasStripes: false
  },
  {
    id: 'rare_gold',
    name: 'Золота форма',
    description: 'Рідкісна золота форма',
    price: 200,
    rarity: 'rare',
    jerseyColor: 0xffd700,
    shortsColor: 0xffd700,
    bootsColor: 0xffd700,
    hasStripes: false
  },
  {
    id: 'rare_black',
    name: 'Чорна форма',
    description: 'Рідкісна чорна форма',
    price: 200,
    rarity: 'rare',
    jerseyColor: 0x000000,
    shortsColor: 0x000000,
    bootsColor: 0x000000,
    hasStripes: false
  },
  {
    id: 'premium_rainbow',
    name: 'Веселкова форма',
    description: 'Преміум веселкова форма',
    price: 500,
    rarity: 'premium',
    jerseyColor: 0xff00ff, // Magenta base
    stripeColor: 0x00ffff, // Cyan stripes
    shortsColor: 0x00ff00, // Green
    bootsColor: 0xffff00, // Yellow
    hasStripes: true
  }
];

/**
 * Get uniform by ID
 */
export function getUniform(id) {
  return UNIFORMS.find(u => u.id === id);
}

/**
 * Get all uniforms
 */
export function getAllUniforms() {
  return UNIFORMS;
}

