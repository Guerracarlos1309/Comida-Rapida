// =====================================================================
// CATÁLOGO DE MENÚ - TAVOS HOT-DOGS
// Ubicación: server/data/menuSeed.js
// 
// ¿CÓMO AGREGAR O EDITAR PRODUCTOS?
// 1. Cada producto es un objeto dentro del arreglo MENU_ITEMS con:
//    - id: número único (ej: 201, 202, 203...)
//    - business_slug: 'tavos-hot'
//    - category: 'Perros Calientes' o 'Bebidas' (o la categoría que desees)
//    - name: Nombre del producto
//    - description: Descripción de lo que incluye
//    - price_usd: Precio base en USD (ej: 2.50)
//    - image_url: Ruta de la foto (ej: '/images/hotdog_hero.png')
//    - badge: Etiqueta opcional (ej: '🌭 CLÁSICO', '🔥 POPULAR')
//    - options: Arreglo de opciones personalizables:
//        * type: 'multi' -> Checks para ingredientes que vienen incluidos por defecto.
//        * type: 'checkboxes' -> Checks para adicionales/toppings (con price_usd: 0 o con costo).
//        * type: 'single' -> Selección única (ej: elegir 1 sabor o 1 tipo).
// =====================================================================

// Ingredientes base incluidos por defecto en todos los perros calientes:
const DEFAULT_DOG_INGREDIENTS = [
  'Salsas',
  'Ensalada',
  'Queso',
  'Cebolla'
];

// Opciones adicionales estándar (sin costo extra / price_usd: 0):
const DEFAULT_EXTRA_TOPPINGS = [
  { label: 'Papas Fosforito', price_usd: 0 },
  { label: 'Queso Rallado Extra', price_usd: 0 },
  { label: 'Salsa Extra', price_usd: 0 }
];

const MENU_ITEMS = [
  {
    id: 201,
    business_slug: 'tavos-hot',
    category: 'Perros Calientes',
    name: 'Perro Caliente Normal',
    description: 'Salchicha de primera calidad en pan suave al vapor, salsas, ensalada fresca, queso rallado y cebolla.',
    price_usd: 2.50,
    image_url: '/images/hotdog_hero.png',
    badge: '🌭 CLÁSICO',
    options: [
      {
        name: 'Ingredientes incluidos (desmarca para quitar)',
        type: 'multi',
        choices: [...DEFAULT_DOG_INGREDIENTS]
      },
      {
        name: 'Adicionales',
        type: 'checkboxes',
        choices: [...DEFAULT_EXTRA_TOPPINGS]
      }
    ]
  },
  {
    id: 202,
    business_slug: 'tavos-hot',
    category: 'Perros Calientes',
    name: 'Perro Caliente con Pollo',
    description: 'Salchicha jugosa cubierta con abundante pollo sazonado a la plancha, salsas, ensalada, queso y cebolla.',
    price_usd: 3.50,
    image_url: '/images/hotdog_hero.png',
    badge: '🍗 POLLO',
    options: [
      {
        name: 'Ingredientes incluidos (desmarca para quitar)',
        type: 'multi',
        choices: [...DEFAULT_DOG_INGREDIENTS]
      },
      {
        name: 'Adicionales',
        type: 'checkboxes',
        choices: [...DEFAULT_EXTRA_TOPPINGS]
      }
    ]
  },
  {
    id: 203,
    business_slug: 'tavos-hot',
    category: 'Perros Calientes',
    name: 'Perro Caliente con Carne',
    description: 'Cargado con tierna carne de res a la plancha sobre salchicha, salsas, ensalada, queso y cebolla.',
    price_usd: 3.80,
    image_url: '/images/hotdog_hero.png',
    badge: '🥩 CARNE',
    options: [
      {
        name: 'Ingredientes incluidos (desmarca para quitar)',
        type: 'multi',
        choices: [...DEFAULT_DOG_INGREDIENTS]
      },
      {
        name: 'Adicionales',
        type: 'checkboxes',
        choices: [...DEFAULT_EXTRA_TOPPINGS]
      }
    ]
  },
  {
    id: 204,
    business_slug: 'tavos-hot',
    category: 'Perros Calientes',
    name: 'Perro Caliente Mixto',
    description: 'La combinación explosiva: salchicha especial cargada con pollo y carne, salsas de la casa, ensalada, queso y cebolla.',
    price_usd: 4.50,
    image_url: '/images/hotdog_hero.png',
    badge: '🔥 EL MÁS PEDIDO',
    options: [
      {
        name: 'Ingredientes incluidos (desmarca para quitar)',
        type: 'multi',
        choices: [...DEFAULT_DOG_INGREDIENTS]
      },
      {
        name: 'Adicionales',
        type: 'checkboxes',
        choices: [...DEFAULT_EXTRA_TOPPINGS]
      }
    ]
  },
  {
    id: 205,
    business_slug: 'tavos-hot',
    category: 'Perros Calientes',
    name: 'Perro Caliente con Tocineta',
    description: 'Salchicha cubierta con generosa tocineta crujiente, salsas, ensalada, queso y cebolla.',
    price_usd: 3.50,
    image_url: '/images/hotdog_hero.png',
    badge: '🥓 TOCINETA',
    options: [
      {
        name: 'Ingredientes incluidos (desmarca para quitar)',
        type: 'multi',
        choices: [...DEFAULT_DOG_INGREDIENTS]
      },
      {
        name: 'Adicionales',
        type: 'checkboxes',
        choices: [...DEFAULT_EXTRA_TOPPINGS]
      }
    ]
  },
  {
    id: 206,
    business_slug: 'tavos-hot',
    category: 'Perros Calientes',
    name: 'Perro con Salchicha Alemana',
    description: 'Auténtica salchicha alemana parrillera gruesa y ahumada, acompañada de salsas, ensalada, queso y cebolla.',
    price_usd: 4.00,
    image_url: '/images/hotdog_hero.png',
    badge: '🇩🇪 ESPECIAL',
    options: [
      {
        name: 'Ingredientes incluidos (desmarca para quitar)',
        type: 'multi',
        choices: [...DEFAULT_DOG_INGREDIENTS]
      },
      {
        name: 'Adicionales',
        type: 'checkboxes',
        choices: [...DEFAULT_EXTRA_TOPPINGS]
      }
    ]
  },
  {
    id: 301,
    business_slug: 'tavos-hot',
    category: 'Bebidas',
    name: 'Refresco Frío (400ml)',
    description: 'Bebida helada para acompañar tus perros calientes.',
    price_usd: 1.50,
    image_url: '/images/combo_hero.png',
    badge: '🥤 HELADA',
    options: [
      {
        name: 'Sabor de Bebida',
        type: 'single',
        choices: ['Coca-Cola', 'Frescolita', 'Chinotto / Sprite', 'Agua Mineral', 'Té Helado']
      }
    ]
  }
];

module.exports = MENU_ITEMS;
