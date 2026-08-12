-- PostgreSQL Database Schema for Comida Rápida Delivery System

-- 1. Table: Businesses (Locales / Negocios)
CREATE TABLE IF NOT EXISTS businesses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    phone VARCHAR(30) NOT NULL,
    whatsapp_number VARCHAR(30) NOT NULL,
    address TEXT NOT NULL,
    rating NUMERIC(2,1) DEFAULT 4.9,
    delivery_fee_usd NUMERIC(10,2) DEFAULT 2.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: Users (Clientes)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone VARCHAR(30) NOT NULL,
    address TEXT,
    address_lat NUMERIC(10,7),
    address_lng NUMERIC(10,7),
    address_details TEXT,
    role VARCHAR(20) DEFAULT 'customer', -- 'customer' or 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: Categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    business_id INT REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    icon VARCHAR(50) DEFAULT 'Utensils'
);

-- 4. Table: Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    business_id INT REFERENCES businesses(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    price_usd NUMERIC(10,2) NOT NULL,
    image_url TEXT,
    badge VARCHAR(50), -- e.g. '🔥 MÁS VENDIDO', '💥 COMBO', '🌟 RECOMENDADO'
    is_available BOOLEAN DEFAULT TRUE,
    options JSONB DEFAULT '[]'::jsonb -- Customization options (pan, salsas, toppin, etc)
);

-- 5. Table: Orders
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_code VARCHAR(20) UNIQUE NOT NULL,
    business_id INT REFERENCES businesses(id),
    user_id INT REFERENCES users(id),
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_lat NUMERIC(10,7),
    delivery_lng NUMERIC(10,7),
    delivery_notes TEXT,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD', -- 'USD', 'COP', 'VES'
    currency_rate NUMERIC(12,2) DEFAULT 1.0, -- Rate used at time of order
    payment_method VARCHAR(50) NOT NULL, -- 'EFECTIVO', 'TRANSFERENCIA', 'PAGO_MOVIL', 'ZELLE'
    subtotal_usd NUMERIC(10,2) NOT NULL,
    delivery_fee_usd NUMERIC(10,2) NOT NULL,
    total_usd NUMERIC(10,2) NOT NULL,
    total_in_currency NUMERIC(14,2) NOT NULL,
    items JSONB NOT NULL, -- Array of items with selected options & quantities
    status VARCHAR(30) DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'EN_PREPARACION', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Businesses
INSERT INTO businesses (name, slug, tagline, description, logo_url, banner_url, phone, whatsapp_number, address)
VALUES 
('Smash & Dog Gourmet', 'smash-dog', 'Las mejores Hamburguesas Smash y Perros Calientes Artesanales', 'Especialistas en hamburguesas doble carne de res angus aplastada con queso fundido y perros calientes venezolanos/colombianos cargados con todo.', '/images/burger_hero.png', '/images/burger_hero.png', '+573001234567', '573001234567', 'Calle 100 #15-24, Zona Gourmet'),
('El Rey del Perro Caliente', 'el-rey-del-perro', 'Perros Calientes Gigantes y Salvajes', 'Perros calientes especiales con salchicha suiza, tocineta ahumada, queso fundido, papa fosforito, huevo de codorniz y salsas de la casa.', '/images/hotdog_hero.png', '/images/hotdog_hero.png', '+584141234567', '584141234567', 'Av. Principal Las Mercedes, Edif. Fast Food'),
('Urban Smash Burger', 'urban-smash', 'Hamburguesas Urbanas y Papas Cargadas', 'Hamburguesas con carne madurada, queso cheddar derretido, tocino crujiente y cebolla caramelizada.', '/images/combo_hero.png', '/images/combo_hero.png', '+13051234567', '13051234567', '777 Brickell Ave, Miami, FL')
ON CONFLICT (slug) DO NOTHING;
