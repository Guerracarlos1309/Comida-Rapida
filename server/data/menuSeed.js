// Seed menu items for fast food businesses (Perros Calientes y Hamburguesas)

const MENU_ITEMS = [
  // --- HAMBURGUESAS ---
  {
    id: 101,
    business_slug: 'smash-dog',
    category: 'Hamburguesas',
    name: 'Smash Burger Doble Bacon',
    description: 'Doble medalla de carne de res angus smash (180g), queso cheddar americano derretido, doble tocineta ahumada crujiente, pepinillos dulce y salsa especial Smash en pan brioche artesanal.',
    price_usd: 8.50,
    image_url: '/images/burger_hero.png',
    badge: '🔥 MÁS VENDIDA',
    options: [
      { name: 'Término de la carne', type: 'single', choices: ['Bien Cocida (Smash Crispy)', '3/4 Jugosa'] },
      { name: 'Salsas incluidas', type: 'multi', choices: ['Salsa Especial Smash', 'Mayonesa Ajo', 'Salsa BBQ Ahumada', 'Ketchup'] },
      { name: 'Adicionales Extra', type: 'checkboxes', choices: [
        { label: 'Queso Cheddar Extra', price_usd: 1.00 },
        { label: 'Tocineta Extra', price_usd: 1.50 },
        { label: 'Cebolla Caramelizada', price_usd: 0.80 },
        { label: 'Huevo Frito', price_usd: 0.75 }
      ]}
    ]
  },
  {
    id: 102,
    business_slug: 'smash-dog',
    category: 'Hamburguesas',
    name: 'La Bestia Gourmet Burger',
    description: 'Triple carne de res, triple queso gouda y cheddar, tocineta, aros de cebolla empanizados, pepinillos y salsa de la casa.',
    price_usd: 11.90,
    image_url: '/images/burger_hero.png',
    badge: '👑 ESPECIAL',
    options: [
      { name: 'Salsas incluidas', type: 'multi', choices: ['Salsa de la Casa', 'Salsa Tartara', 'Salsa BBQ'] },
      { name: 'Adicionales Extra', type: 'checkboxes', choices: [
        { label: 'Extra Queso Fundido', price_usd: 1.20 },
        { label: 'Jalapeños', price_usd: 0.70 }
      ]}
    ]
  },
  {
    id: 103,
    business_slug: 'smash-dog',
    category: 'Hamburguesas',
    name: 'Crispy Chicken & Bacon Burger',
    description: 'Pechuga de pollo crujiente empanizada al estilo frito sureño, ensalada coleslaw, tocineta y mayo-sriracha en pan brioche.',
    price_usd: 7.90,
    image_url: '/images/burger_hero.png',
    badge: '🍗 POLLO',
    options: [
      { name: 'Picante', type: 'single', choices: ['Sin picante', 'Picante suave', 'Picante Sriracha 🔥'] }
    ]
  },

  // --- PERROS CALIENTES ---
  {
    id: 201,
    business_slug: 'smash-dog',
    category: 'Perros Calientes',
    name: 'Perro Caliente Especial Colombiano',
    description: 'Salchicha manguera premium, queso mozzarella fundido, lluvia de papa fosforito crujiente, tocineta picada, salsa de piña artesanal, tártara y salsa rosada, coronado con huevo de codorniz.',
    price_usd: 5.50,
    image_url: '/images/hotdog_hero.png',
    badge: '🌟 FAVORITO DE LA CASA',
    options: [
      { name: 'Tipo de Salchicha', type: 'single', choices: ['Salchicha Tradicional Premium', 'Salchicha Suiza Ahumada (+1.00 USD)'] },
      { name: 'Salsas', type: 'multi', choices: ['Salsa de Piña', 'Salsa Tártara', 'Salsa Rosada', 'Mayonesa Ajo', 'Mostaza'] },
      { name: 'Toppings Incluidos', type: 'multi', choices: ['Papa Fosforito', 'Queso Mozzarella', 'Tocineta Crispy', 'Huevo de Codorniz'] },
      { name: 'Extra Topping', type: 'checkboxes', choices: [
        { label: 'Maíz Dulce', price_usd: 0.60 },
        { label: 'Queso De Mano / Costeño Extra', price_usd: 1.00 }
      ]}
    ]
  },
  {
    id: 202,
    business_slug: 'el-rey-del-perro',
    category: 'Perros Calientes',
    name: 'Perro Caliente Salvaje Venezolano',
    description: 'Pan suave gigante al vapor, salchicha jumbo, repollo, zanahoria, cebolla picadita, queso año rallado, papa fosforito y las 5 salsas tradicionales (tártara, ajo, maíz, tocineta y picante).',
    price_usd: 4.80,
    image_url: '/images/hotdog_hero.png',
    badge: '🔥 EL MÁS PEDIDO',
    options: [
      { name: 'Salsas Tradicionales', type: 'multi', choices: ['Tártara', 'Ajo', 'Maíz', 'Tocineta', 'Picante de la casa'] },
      { name: 'Con Vegetales', type: 'single', choices: ['Con Todo (Repollo, Zanahoria, Cebolla)', 'Sin Cebolla', 'Sin Repollo'] }
    ]
  },
  {
    id: 203,
    business_slug: 'el-rey-del-perro',
    category: 'Perros Calientes',
    name: 'Perro Caliente Tex-Mex Jalapeño',
    description: 'Salchicha alemana a la parrilla, chili con carne casero, queso cheddar derretido, trozos de jalapeño en conserva y doritos crujientes triturados.',
    price_usd: 6.20,
    image_url: '/images/hotdog_hero.png',
    badge: '🌶️ PICANTE',
    options: [
      { name: 'Nivel de Picante', type: 'single', choices: ['Medio', 'Picante Fuerte'] }
    ]
  },

  // --- COMBOS & ACOMPAÑANTES ---
  {
    id: 301,
    business_slug: 'smash-dog',
    category: 'Combos & Papas',
    name: 'Super Combo Smash + Perro + Papas Loaded',
    description: '1 Smash Burger Doble + 1 Perro Caliente Especial + Papas Fritas familiares bañadas en queso cheddar fundido y tocineta + 2 Bebidas frías a elección.',
    price_usd: 16.50,
    image_url: '/images/combo_hero.png',
    badge: '💥 SUPER AHORRO',
    options: [
      { name: 'Bebidas del Combo', type: 'multi', choices: ['Coca-Cola 400ml', 'Postobón Manzana', 'Kola Real', 'Agua Mineral'] }
    ]
  },
  {
    id: 302,
    business_slug: 'smash-dog',
    category: 'Combos & Papas',
    name: 'Papas Loaded Bacon & Cheddar',
    description: 'Porción generosa de papas fritas rústicas crujientes bañadas con queso cheddar cremoso, tocineta crujiente picada y cebollín verde.',
    price_usd: 4.50,
    image_url: '/images/combo_hero.png',
    badge: '🍟 PARA COMPARTIR',
    options: [
      { name: 'Salsa extra', type: 'single', choices: ['Mayo Ajo', 'Salsa BBQ', 'Sin salsa extra'] }
    ]
  },
  {
    id: 303,
    business_slug: 'smash-dog',
    category: 'Bebidas',
    name: 'Bebida Fría Refrescante (400ml)',
    description: 'Gaseosas heladas o té helado casero.',
    price_usd: 1.80,
    image_url: '/images/combo_hero.png',
    badge: '🥤 HELADA',
    options: [
      { name: 'Sabor de Bebida', type: 'single', choices: ['Coca-Cola Original', 'Coca-Cola Zero', 'Sprite', 'Manzana Postobón', 'Té Helado Limón'] }
    ]
  }
];

module.exports = MENU_ITEMS;
