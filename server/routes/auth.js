const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'fastfood_secret_key_2026';

// Helper to sign token
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role || 'customer'
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, address, address_lat, address_lng, address_details } = req.body;

    if (!first_name || !last_name || !email || !password || !phone) {
      return res.status(400).json({ error: 'Por favor complete todos los campos obligatorios (Nombre, Apellido, Email, Contraseña, Teléfono)' });
    }

    // Check if user exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'Este correo electrónico ya está registrado. Por favor inicie sesión.' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user
    const insertRes = await query(
      `INSERT INTO users (first_name, last_name, email, password_hash, phone, address, address_lat, address_lng, address_details, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, first_name, last_name, email, phone, address, address_lat, address_lng, address_details, role`,
      [
        first_name.trim(),
        last_name.trim(),
        email.toLowerCase().trim(),
        password_hash,
        phone.trim(),
        address || '',
        address_lat || 4.6097,
        address_lng || -74.0817,
        address_details || '',
        'customer'
      ]
    );

    let user;
    if (insertRes && insertRes[0]) {
      if (insertRes[0].email) {
        user = insertRes[0];
      } else {
        // Fetch created user if RETURNING wasn't fully supported
        const fetched = await query('SELECT id, first_name, last_name, email, phone, address, address_lat, address_lng, address_details, role FROM users WHERE id = $1', [insertRes[0].id]);
        user = fetched[0];
      }
    }

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Registro exitoso',
      token,
      user
    });
  } catch (err) {
    console.error('Error en registro:', err);
    return res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Ingrese correo y contraseña' });
    }

    const users = await query('SELECT * FROM users WHERE LOWER(email) = $1', [email.toLowerCase().trim()]);
    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas. Verifique su correo o regístrese.' });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = generateToken(user);

    const safeUser = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      address_lat: user.address_lat,
      address_lng: user.address_lng,
      address_details: user.address_details,
      role: user.role
    };

    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ error: 'Error en inicio de sesión' });
  }
});

// PUT /api/auth/profile - Update customer address and phone for fast checkout
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: 'Sesión expirada' });
    }

    const { first_name, last_name, phone, address, address_lat, address_lng, address_details } = req.body;

    await query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, phone = $3, address = $4, address_lat = $5, address_lng = $6, address_details = $7
       WHERE id = $8`,
      [first_name, last_name, phone, address, address_lat, address_lng, address_details, decoded.id]
    );

    const updated = await query(
      'SELECT id, first_name, last_name, email, phone, address, address_lat, address_lng, address_details, role FROM users WHERE id = $1',
      [decoded.id]
    );

    return res.json({
      message: 'Perfil y dirección actualizados',
      user: updated[0]
    });
  } catch (err) {
    console.error('Error actualizando perfil:', err);
    return res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

module.exports = router;
