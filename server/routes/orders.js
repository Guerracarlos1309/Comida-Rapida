const express = require('express');
const router = express.Router();
const { query, EXCHANGE_RATES } = require('../db');

// Helper to format WhatsApp message text
function generateWhatsAppMessage(order, businessPhone = '573001234567') {
  const itemsText = order.items.map((item, idx) => {
    let optsText = '';
    if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
      const details = Object.entries(item.selectedOptions)
        .map(([key, val]) => {
          if (Array.isArray(val)) return `${key}: ${val.join(', ')}`;
          return `${key}: ${val}`;
        })
        .join(' | ');
      optsText = `\n     ↳ _${details}_`;
    }
    return `  *${item.quantity}x ${item.name}* - $${(item.price_usd * item.quantity).toFixed(2)}${optsText}`;
  }).join('\n');

  const mapsUrl = (order.delivery_lat && order.delivery_lng) 
    ? `https://www.google.com/maps?q=${order.delivery_lat},${order.delivery_lng}` 
    : '';

  const symbol = order.currency === 'COP' ? 'COP $' : (order.currency === 'VES' ? 'Bs.' : '$');

  const text = 
`🍔 *NUEVO PEDIDO DE COMIDA RÁPIDA* 🌭
*Código:* #${order.order_code}
*Fecha:* ${new Date().toLocaleString('es-CO')}

👤 *DATOS DEL CLIENTE:*
• *Nombre:* ${order.customer_name}
• *Teléfono:* ${order.customer_phone}
📍 *DIRECCIÓN DE ENTREGA (Google Maps):*
• ${order.delivery_address}
${order.delivery_notes ? `• *Ref/Notas:* ${order.delivery_notes}\n` : ''}${mapsUrl ? `• *Ubicación GPS:* ${mapsUrl}\n` : ''}
🛒 *RESUMEN DEL PEDIDO:*
${itemsText}

💰 *DETALLES DE PAGO:*
• *Moneda de Pago:* ${order.currency}
• *Método de Pago:* ${order.payment_method}
• *Subtotal:* $${Number(order.subtotal_usd).toFixed(2)} USD
• *Delivery:* $${Number(order.delivery_fee_usd).toFixed(2)} USD
• *TOTAL USD:* $${Number(order.total_usd).toFixed(2)} USD
• *TOTAL A PAGAR EN ${order.currency}:* ${symbol} ${Number(order.total_in_currency).toLocaleString()}

¡Por favor confirmar recepción del pedido! 🔥`;

  return {
    raw_text: text,
    whatsapp_url: `https://wa.me/${businessPhone}?text=${encodeURIComponent(text)}`
  };
}

// Export router factory so Socket.io can be injected
module.exports = function(io) {
  
  // POST /api/orders - Create new delivery order
  router.post('/', async (req, res) => {
    try {
      const {
        business_id = 1,
        user_id = null,
        customer_name,
        customer_phone,
        delivery_address,
        delivery_lat,
        delivery_lng,
        delivery_notes,
        currency = 'USD',
        payment_method = 'EFECTIVO',
        subtotal_usd,
        delivery_fee_usd = 2.00,
        items
      } = req.body;

      if (!customer_name || !customer_phone || !delivery_address || !items || items.length === 0) {
        return res.status(400).json({ error: 'Por favor complete todos los datos requeridos (Nombre, Teléfono, Dirección y Productos)' });
      }

      const rate = EXCHANGE_RATES[currency] || 1;
      const subtotalNum = Number(subtotal_usd) || 0;
      const feeNum = Number(delivery_fee_usd) || 0;
      const totalUsdNum = subtotalNum + feeNum;
      const totalInCurrencyNum = totalUsdNum * rate;

      const orderCode = 'CR-' + Math.floor(100000 + Math.random() * 900000);

      // Save to database
      const insertRes = await query(
        `INSERT INTO orders 
         (order_code, business_id, user_id, customer_name, customer_phone, delivery_address, delivery_lat, delivery_lng, delivery_notes, currency, currency_rate, payment_method, subtotal_usd, delivery_fee_usd, total_usd, total_in_currency, items, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
         RETURNING *`,
        [
          orderCode,
          business_id,
          user_id,
          customer_name,
          customer_phone,
          delivery_address,
          delivery_lat || null,
          delivery_lng || null,
          delivery_notes || '',
          currency,
          rate,
          payment_method,
          subtotalNum,
          feeNum,
          totalUsdNum,
          totalInCurrencyNum,
          JSON.stringify(items),
          'PENDIENTE'
        ]
      );

      let createdOrder;
      if (insertRes && insertRes[0] && insertRes[0].order_code) {
        createdOrder = insertRes[0];
      } else {
        const fetchOrder = await query('SELECT * FROM orders WHERE order_code = $1', [orderCode]);
        createdOrder = fetchOrder[0];
      }

      // Parse items JSON if string
      if (typeof createdOrder.items === 'string') {
        try { createdOrder.items = JSON.parse(createdOrder.items); } catch(e){}
      }

      // Get WhatsApp payload
      const whatsapp = generateWhatsAppMessage(createdOrder);
      createdOrder.whatsapp = whatsapp;

      // Broadcast real-time event to Admin Kitchen Dashboard via Socket.io
      if (io) {
        io.emit('new_order', createdOrder);
      }

      return res.status(201).json({
        message: 'Pedido realizado con éxito',
        order: createdOrder
      });
    } catch (err) {
      console.error('Error al crear pedido:', err);
      return res.status(500).json({ error: 'Error interno al procesar el pedido' });
    }
  });

  // GET /api/orders - Get orders (for kitchen dashboard or customer history)
  router.get('/', async (req, res) => {
    try {
      const { user_id, status } = req.query;
      let sql = 'SELECT * FROM orders ';
      const params = [];

      if (user_id) {
        sql += 'WHERE user_id = $1 ';
        params.push(user_id);
      } else if (status) {
        sql += 'WHERE status = $1 ';
        params.push(status);
      }

      sql += 'ORDER BY created_at DESC LIMIT 50';

      const orders = await query(sql, params);
      
      const parsedOrders = orders.map(o => {
        if (typeof o.items === 'string') {
          try { o.items = JSON.parse(o.items); } catch(e){}
        }
        o.whatsapp = generateWhatsAppMessage(o);
        return o;
      });

      return res.json(parsedOrders);
    } catch (err) {
      console.error('Error obteniendo pedidos:', err);
      return res.status(500).json({ error: 'Error al obtener la lista de pedidos' });
    }
  });

  // PUT /api/orders/:id/status - Update order status (Kitchen action)
  router.put('/:id/status', async (req, res) => {
    try {
      const { status } = req.body; // 'PENDIENTE', 'EN_PREPARACION', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'
      const { id } = req.params;

      if (!['PENDIENTE', 'EN_PREPARACION', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'].includes(status)) {
        return res.status(400).json({ error: 'Estado de pedido no válido' });
      }

      await query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
      const updated = await query('SELECT * FROM orders WHERE id = $1', [id]);
      
      let order = updated[0];
      if (typeof order.items === 'string') {
        try { order.items = JSON.parse(order.items); } catch(e){}
      }

      // Broadcast socket update
      if (io) {
        io.emit('order_status_updated', { id: order.id, status: order.status, order });
      }

      return res.json({
        message: 'Estado actualizado',
        order
      });
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      return res.status(500).json({ error: 'Error actualizando estado del pedido' });
    }
  });

  return router;
};
