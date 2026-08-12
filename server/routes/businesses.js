const express = require('express');
const router = express.Router();
const { query } = require('../db');

// GET /api/businesses - List all fast food businesses
router.get('/', async (req, res) => {
  try {
    const businesses = await query('SELECT * FROM businesses ORDER BY id ASC');
    return res.json(businesses);
  } catch (err) {
    console.error('Error obteniendo negocios:', err);
    return res.status(500).json({ error: 'Error al obtener negocios' });
  }
});

// GET /api/businesses/:slug - Get business by slug
router.get('/:slug', async (req, res) => {
  try {
    const businesses = await query('SELECT * FROM businesses WHERE slug = $1', [req.params.slug]);
    if (!businesses || businesses.length === 0) {
      return res.status(404).json({ error: 'Negocio no encontrado' });
    }
    return res.json(businesses[0]);
  } catch (err) {
    console.error('Error obteniendo negocio:', err);
    return res.status(500).json({ error: 'Error al obtener información del negocio' });
  }
});

module.exports = router;
