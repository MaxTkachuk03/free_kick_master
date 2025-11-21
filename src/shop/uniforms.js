/**
 * Uniform Catalog
 * Available uniforms for purchase
 */
export const UNIFORMS = [
  {
    id: 'basic_white',
    name: 'Базова біла',
    description: 'Класична біла форма',
    price: 0, // Free/default
    rarity: 'basic',
    color: 0xffffff
  },
  {
    id: 'basic_blue',
    name: 'Базова синя',
    description: 'Класична синя форма',
    price: 50,
    rarity: 'basic',
    color: 0x0066cc
  },
  {
    id: 'basic_red',
    name: 'Базова червона',
    description: 'Класична червона форма',
    price: 50,
    rarity: 'basic',
    color: 0xcc0000
  },
  {
    id: 'rare_gold',
    name: 'Золота форма',
    description: 'Рідкісна золота форма',
    price: 200,
    rarity: 'rare',
    color: 0xffd700
  },
  {
    id: 'rare_black',
    name: 'Чорна форма',
    description: 'Рідкісна чорна форма',
    price: 200,
    rarity: 'rare',
    color: 0x000000
  },
  {
    id: 'premium_rainbow',
    name: 'Веселкова форма',
    description: 'Преміум веселкова форма',
    price: 500,
    rarity: 'premium',
    color: 0xff00ff // Will use special shader
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

