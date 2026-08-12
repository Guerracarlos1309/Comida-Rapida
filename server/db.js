const { Pool } = require('pg');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

let dbType = 'sqlite';
let pgPool = null;
let sqliteDb = null;

// Currency exchange rates (relative to USD)
const EXCHANGE_RATES = {
  USD: 1,
  COP: 4000, // 1 USD = 4,000 COP
  VES: 40    // 1 USD = 40 VES (Bolívares)
};

async function initDb() {
  const pgConnectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/comida_rapida';
  
  // Try connecting to PostgreSQL first
  try {
    const testPool = new Pool({
      connectionString: pgConnectionString,
      connectionTimeoutMillis: 2000,
    });
    const res = await testPool.query('SELECT NOW()');
    console.log('✅ Conectado exitosamente a la base de datos PostgreSQL:', res.rows[0].now);
    pgPool = testPool;
    dbType = 'postgres';
    return;
  } catch (err) {
    console.log('⚠️ No se pudo conectar a PostgreSQL local (o no está corriendo). Iniciando motor SQLite optimizado para ejecución instantánea...');
  }

  // Fallback to SQLite
  try {
    sqliteDb = await open({
      filename: path.join(__dirname, 'data.sqlite'),
      driver: sqlite3.Database
    });

    // Create tables in SQLite
    await sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT,
        address_lat REAL,
        address_lng REAL,
        address_details TEXT,
        role TEXT DEFAULT 'customer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS businesses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        tagline TEXT,
        description TEXT,
        logo_url TEXT,
        banner_url TEXT,
        phone TEXT NOT NULL,
        whatsapp_number TEXT NOT NULL,
        address TEXT NOT NULL,
        rating REAL DEFAULT 4.9,
        delivery_fee_usd REAL DEFAULT 2.00,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_code TEXT UNIQUE NOT NULL,
        business_id INTEGER,
        user_id INTEGER,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        delivery_address TEXT NOT NULL,
        delivery_lat REAL,
        delivery_lng REAL,
        delivery_notes TEXT,
        currency TEXT NOT NULL DEFAULT 'USD',
        currency_rate REAL DEFAULT 1.0,
        payment_method TEXT NOT NULL,
        subtotal_usd REAL NOT NULL,
        delivery_fee_usd REAL NOT NULL,
        total_usd REAL NOT NULL,
        total_in_currency REAL NOT NULL,
        items TEXT NOT NULL,
        status TEXT DEFAULT 'PENDIENTE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default businesses if empty
    const busCount = await sqliteDb.get('SELECT COUNT(*) as count FROM businesses');
    if (busCount.count === 0) {
      await sqliteDb.run(`
        INSERT INTO businesses (name, slug, tagline, description, logo_url, banner_url, phone, whatsapp_number, address, delivery_fee_usd)
        VALUES 
        ('Smash & Dog Gourmet', 'smash-dog', 'Las mejores Hamburguesas Smash y Perros Calientes Artesanales', 'Especialistas en hamburguesas doble carne de res angus aplastada con queso fundido y perros calientes cargados.', '/images/burger_hero.png', '/images/burger_hero.png', '+57 300 123 4567', '573001234567', 'Calle 100 #15-24, Zona Gourmet', 2.50),
        ('El Rey del Perro Caliente', 'el-rey-del-perro', 'Perros Calientes Gigantes y Salvajes', 'Perros calientes especiales con salchicha suiza, tocineta ahumada, queso fundido, papa fosforito, huevo de codorniz.', '/images/hotdog_hero.png', '/images/hotdog_hero.png', '+58 414 123 4567', '584141234567', 'Av. Principal Las Mercedes, Edif. Fast Food', 2.00),
        ('Urban Smash Burger', 'urban-smash', 'Hamburguesas Urbanas y Papas Cargadas', 'Hamburguesas con carne madurada, queso cheddar derretido, tocino crujiente y cebolla caramelizada.', '/images/combo_hero.png', '/images/combo_hero.png', '+1 305 123 4567', '13051234567', '777 Brickell Ave, Miami, FL', 3.00)
      `);
    }

    console.log('✅ Base de datos local inicializada correctamente.');
    dbType = 'sqlite';
  } catch (err) {
    console.error('Error inicializando base de datos:', err);
  }
}

// Unified Query interface
async function query(text, params = []) {
  if (dbType === 'postgres' && pgPool) {
    const res = await pgPool.query(text, params);
    return res.rows;
  } else if (sqliteDb) {
    // Convert $1, $2 to ? for SQLite compatibility
    let sqliteQuery = text.replace(/\$\d+/g, '?');
    if (sqliteQuery.trim().toUpperCase().startsWith('SELECT')) {
      return await sqliteDb.all(sqliteQuery, params);
    } else if (sqliteQuery.trim().toUpperCase().startsWith('INSERT')) {
      // Handle RETURNING clause if present in postgres syntax
      sqliteQuery = sqliteQuery.replace(/RETURNING .*/i, '');
      const result = await sqliteDb.run(sqliteQuery, params);
      return [{ id: result.lastID }];
    } else {
      sqliteQuery = sqliteQuery.replace(/RETURNING .*/i, '');
      await sqliteDb.run(sqliteQuery, params);
      return [];
    }
  }
  return [];
}

module.exports = {
  initDb,
  query,
  EXCHANGE_RATES,
  getDbType: () => dbType
};
