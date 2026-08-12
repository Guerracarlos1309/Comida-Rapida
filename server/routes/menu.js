const express = require('express');
const router = express.Router();
const MENU_ITEMS = require('../data/menuSeed');

// GET /api/menu?business_slug=smash-dog - Get menu items filtered by business or category
router.get('/', (req, res) => {
  try {
    const { business_slug, category } = req.query;
    let items = MENU_ITEMS;

    if (business_slug) {
      items = items.filter(item => item.business_slug === business_slug || item.business_slug === 'smash-dog');
    }

    if (category && category !== 'Todos') {
      items = items.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    // Extract categories
    const categories = ['Todos', ...new Set(items.map(i => i.category))];

    return res.json({
      categories,
      items
    });
  } catch (err) {
    console.error('Error al obtener menú:', err);
    return res.status(500).json({ error: 'Error al obtener items del menú' });
  }
});

module.exports = router;
