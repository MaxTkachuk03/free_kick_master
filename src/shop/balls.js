/**
 * Ball Catalog
 * Available balls for purchase
 */
export const BALLS = [
  {
    id: 'classic',
    name: 'Класичний м\'яч',
    description: 'Стандартний чорно-білий м\'яч',
    price: 0, // Free/default
    rarity: 'basic',
    color: 0xffffff,
    pattern: 'classic'
  },
  {
    id: 'golden',
    name: 'Золотий м\'яч',
    description: 'Золотий м\'яч',
    price: 150,
    rarity: 'rare',
    color: 0xffd700,
    pattern: 'golden'
  },
  {
    id: 'red',
    name: 'Червоний м\'яч',
    description: 'Червоний м\'яч',
    price: 75,
    rarity: 'basic',
    color: 0xff0000,
    pattern: 'solid'
  },
  {
    id: 'blue',
    name: 'Синій м\'яч',
    description: 'Синій м\'яч',
    price: 75,
    rarity: 'basic',
    color: 0x0000ff,
    pattern: 'solid'
  },
  {
    id: 'heavy',
    name: 'Важкий м\'яч',
    description: 'М\'яч з важкою фізикою',
    price: 300,
    rarity: 'rare',
    color: 0x333333,
    pattern: 'solid',
    physics: { mass: 2.0 }
  },
  {
    id: 'light',
    name: 'Легкий м\'яч',
    description: 'М\'яч з легкою фізикою',
    price: 300,
    rarity: 'rare',
    color: 0xffffff,
    pattern: 'solid',
    physics: { mass: 0.5 }
  },
  {
    id: 'premium_rainbow',
    name: 'Веселковий м\'яч',
    description: 'Преміум веселковий м\'яч',
    price: 500,
    rarity: 'premium',
    color: 0xff00ff,
    pattern: 'rainbow'
  }
];

/**
 * Get ball by ID
 */
export function getBall(id) {
  return BALLS.find(b => b.id === id);
}

/**
 * Get all balls
 */
export function getAllBalls() {
  return BALLS;
}

