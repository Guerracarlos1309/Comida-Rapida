import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Clock, Bike, CheckCircle2, MapPin, Phone, DollarSign, Bell, Volume2, VolumeX, ExternalLink, RefreshCw, Search } from 'lucide-react';
import { io } from 'socket.io-client';
import { useCurrency } from '../context/CurrencyContext';

export default function AdminDashboard({ activeBusiness }) {
  const { formatPrice, EXCHANGE_RATES } = useCurrency();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterCurrency, setFilterCurrency] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();

    // Connect to Socket.io for real-time order arrival & status updates
    const socket = io('/', { transports: ['websocket', 'polling'] });

    socket.on('connect', () => {
      console.log('⚡ Socket conectado en Cocina/Admin Dashboard');
    });

    socket.on('new_order', (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);

      // Play audio chime if enabled
      if (soundEnabled) {
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(e => console.log('Audio auto-play error', e));
        } catch(e){}
      }
    });

    socket.on('order_status_updated', ({ id, status }) => {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (e) {
      console.error('Error cargando pedidos admin:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesCurrency = filterCurrency === 'ALL' || order.currency === filterCurrency;
    const matchesSearch = searchQuery === '' || 
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone.includes(searchQuery);
    return matchesCurrency && matchesSearch;
  });

  // Calculate metrics
  const totalRevenueUsd = orders.reduce((sum, o) => sum + Number(o.total_usd || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'PENDIENTE').length;
  const prepCount = orders.filter(o => o.status === 'EN_PREPARACION').length;
  const deliveryCount = orders.filter(o => o.status === 'EN_CAMINO').length;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900/90 p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold shadow-lg">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <span>Panel de Cocina & Gestión de Deliverys</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                EN VIVO
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Notificaciones ordenadas en tiempo real para {activeBusiness?.name || 'Smash & Dog Club'}
            </p>
          </div>
        </div>

        {/* Dashboard Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
              soundEnabled
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Sonido Notificación ON' : 'Sonido OFF'}</span>
          </button>

          <button
            onClick={fetchOrders}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="glass-card p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Total Pedidos</span>
          <span className="text-xl sm:text-2xl font-black text-white mt-1 block">{orders.length}</span>
        </div>
        <div className="glass-card p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Pendientes</span>
          <span className="text-xl sm:text-2xl font-black text-orange-400 mt-1 block">{pendingCount}</span>
        </div>
        <div className="glass-card p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 block">En Cocina</span>
          <span className="text-xl sm:text-2xl font-black text-amber-400 mt-1 block">{prepCount}</span>
        </div>
        <div className="glass-card p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Ventas USD</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">${totalRevenueUsd.toFixed(2)}</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por código #CR, cliente o teléfono..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold">Filtrar por Moneda:</span>
          <select
            value={filterCurrency}
            onChange={(e) => setFilterCurrency(e.target.value)}
            className="bg-transparent text-xs font-bold text-amber-400 focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900 text-white">Todas las monedas</option>
            <option value="USD" className="bg-slate-900 text-white">🇺🇸 Dólares (USD)</option>
            <option value="COP" className="bg-slate-900 text-white">🇨🇴 Pesos Colombianos (COP)</option>
            <option value="VES" className="bg-slate-900 text-white">🇻🇪 Bolívares (VES)</option>
          </select>
        </div>
      </div>

      {/* Order Cards List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
          <Clock className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">No hay pedidos registrados en este momento</h3>
          <p className="text-xs text-slate-400 mt-1">Los pedidos online que realicen los clientes aparecerán aquí automáticamente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredOrders.map((order) => {
            const mapsUrl = (order.delivery_lat && order.delivery_lng) 
              ? `https://www.google.com/maps?q=${order.delivery_lat},${order.delivery_lng}` 
              : '';

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-slate-900 border rounded-3xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden ${
                  order.status === 'PENDIENTE' ? 'border-orange-500 shadow-orange-950/30' :
                  order.status === 'EN_PREPARACION' ? 'border-amber-500 shadow-amber-950/30' :
                  order.status === 'EN_CAMINO' ? 'border-blue-500' : 'border-slate-800'
                }`}
              >
                {/* Header info */}
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-black text-amber-400 font-mono">#{order.order_code}</span>
                      <span className="text-[10px] text-slate-400 block">{new Date(order.created_at || Date.now()).toLocaleTimeString()}</span>
                    </div>

                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                      order.status === 'PENDIENTE' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 animate-pulse' :
                      order.status === 'EN_PREPARACION' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                      order.status === 'EN_CAMINO' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                      'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Customer details */}
                  <div className="space-y-1.5 mb-4 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-sm">{order.customer_name}</strong>
                      <span className="text-slate-400">{order.customer_phone}</span>
                    </div>

                    <div className="flex items-start gap-1.5 text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="block text-[11px] font-medium">{order.delivery_address}</span>
                        {mapsUrl && (
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-amber-400 hover:underline font-bold inline-flex items-center gap-1 mt-1"
                          >
                            <span>Ver Navegación Google Maps</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 mb-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Productos del Pedido:</span>
                    {order.items && order.items.map((it, i) => (
                      <div key={i} className="text-xs border-b border-slate-800/50 pb-1.5 last:border-0 last:pb-0">
                        <div className="flex justify-between font-bold text-white">
                          <span>{it.quantity}x {it.name}</span>
                          <span className="text-amber-400">${(it.price_usd * it.quantity).toFixed(2)}</span>
                        </div>
                        {it.selectedOptions && (
                          <div className="text-[10px] text-slate-400 italic mt-0.5">
                            {Object.entries(it.selectedOptions).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Payment Info */}
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Moneda / Método:</span>
                      <strong className="text-amber-400">{order.currency} ({order.payment_method})</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Total a Cobrar:</span>
                      <span className="text-base font-black text-emerald-400">
                        {EXCHANGE_RATES[order.currency]?.symbol || '$'} {Number(order.total_in_currency || order.total_usd).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                  {order.status === 'PENDIENTE' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'EN_PREPARACION')}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <ChefHat className="w-4 h-4" />
                      <span>Pasar a Cocina</span>
                    </button>
                  )}
                  {order.status === 'EN_PREPARACION' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'EN_CAMINO')}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Bike className="w-4 h-4" />
                      <span>Enviar en Delivery</span>
                    </button>
                  )}
                  {order.status === 'EN_CAMINO' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'ENTREGADO')}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Marcar Entregado</span>
                    </button>
                  )}
                  {order.status === 'ENTREGADO' && (
                    <span className="w-full text-center text-xs text-emerald-400 font-bold py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                      ✓ Pedido Completado
                    </span>
                  )}
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
