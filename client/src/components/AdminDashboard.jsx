import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Clock, Bike, CheckCircle2, MapPin, Phone, DollarSign, Bell, Volume2, VolumeX, ExternalLink, RefreshCw, Search } from 'lucide-react';
import { io } from 'socket.io-client';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';

export default function AdminDashboard() {
  const { formatPrice, EXCHANGE_RATES } = useCurrency();
  const { isDark } = useTheme();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterCurrency, setFilterCurrency] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();

    const socket = io('/', { transports: ['websocket', 'polling'] });

    socket.on('connect', () => {
      console.log('⚡ Socket conectado en Cocina/Admin Dashboard');
    });

    socket.on('new_order', (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);

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

    // Auto-update polling fallback every 5s
    const interval = setInterval(() => {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setOrders(data);
        })
        .catch(() => {});
    }, 5000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
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

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 p-4 sm:p-6 rounded-3xl border transition-colors duration-300 ${
        isDark ? 'bg-zinc-900/90 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/40 flex items-center justify-center font-black shadow-lg flex-shrink-0">
            <ChefHat className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h1 className={`text-xl sm:text-2xl font-black flex items-center gap-2 flex-wrap ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              <span>Panel de Cocina & Deliverys</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-black animate-pulse">
                EN VIVO
              </span>
            </h1>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Notificaciones en tiempo real para {activeBusiness?.name || 'Smash & Dog Club'}
            </p>
          </div>
        </div>

        {/* Dashboard Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
              soundEnabled
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-500'
                : isDark ? 'bg-black border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-300 text-zinc-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Sonido ON' : 'Sonido OFF'}</span>
          </button>

          <button
            onClick={fetchOrders}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
              isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className={`p-3 sm:p-4 rounded-2xl border transition ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <span className={`text-[10px] font-black uppercase block ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Total Pedidos</span>
          <span className={`text-xl sm:text-2xl font-black mt-1 block ${isDark ? 'text-white' : 'text-zinc-900'}`}>{orders.length}</span>
        </div>
        <div className={`p-3 sm:p-4 rounded-2xl border transition ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <span className={`text-[10px] font-black uppercase block ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Pendientes</span>
          <span className="text-xl sm:text-2xl font-black text-orange-500 mt-1 block">{pendingCount}</span>
        </div>
        <div className={`p-3 sm:p-4 rounded-2xl border transition ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <span className={`text-[10px] font-black uppercase block ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>En Cocina</span>
          <span className="text-xl sm:text-2xl font-black text-amber-500 mt-1 block">{prepCount}</span>
        </div>
        <div className={`p-3 sm:p-4 rounded-2xl border transition ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <span className={`text-[10px] font-black uppercase block ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Ventas USD</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-500 mt-1 block">${totalRevenueUsd.toFixed(2)}</span>
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
            className={`w-full border rounded-2xl px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-orange-500 ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 shadow-sm'
            }`}
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
        </div>

        <div className={`flex items-center gap-2 border px-3 py-1.5 rounded-2xl ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300 shadow-sm'
        }`}>
          <span className={`text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Moneda:</span>
          <select
            value={filterCurrency}
            onChange={(e) => setFilterCurrency(e.target.value)}
            className={`bg-transparent text-xs font-bold focus:outline-none cursor-pointer ${
              isDark ? 'text-amber-400' : 'text-orange-600'
            }`}
          >
            <option value="ALL" className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}>Todas las monedas</option>
            <option value="USD" className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}>🇺🇸 Dólares (USD)</option>
            <option value="COP" className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}>🇨🇴 Pesos (COP)</option>
            <option value="VES" className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}>🇻🇪 Bolívares (VES)</option>
          </select>
        </div>
      </div>

      {/* Order Cards List */}
      {filteredOrders.length === 0 ? (
        <div className={`text-center py-16 rounded-3xl border ${
          isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <Clock className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
          <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>No hay pedidos registrados en este momento</h3>
          <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Los pedidos online aparecerán aquí automáticamente.</p>
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
                className={`border rounded-3xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden transition-colors ${
                  order.status === 'PENDIENTE' ? 'border-orange-500 shadow-orange-500/20' :
                  order.status === 'EN_PREPARACION' ? 'border-amber-500 shadow-amber-500/20' :
                  order.status === 'EN_CAMINO' ? 'border-blue-500 shadow-blue-500/20' :
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                } ${isDark ? 'bg-zinc-900' : 'bg-white'}`}
              >
                {/* Header info */}
                <div>
                  <div className={`flex items-center justify-between mb-3 border-b pb-3 ${
                    isDark ? 'border-zinc-800' : 'border-zinc-200'
                  }`}>
                    <div>
                      <span className="text-xs font-black text-amber-500 font-mono">#{order.order_code}</span>
                      <span className={`text-[10px] block ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{new Date(order.created_at || Date.now()).toLocaleTimeString()}</span>
                    </div>

                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                      order.status === 'PENDIENTE' ? 'bg-orange-500/20 text-orange-500 border-orange-500/40 animate-pulse' :
                      order.status === 'EN_PREPARACION' ? 'bg-amber-500/20 text-amber-500 border-amber-500/40' :
                      order.status === 'EN_CAMINO' ? 'bg-blue-500/20 text-blue-500 border-blue-500/40' :
                      'bg-emerald-500/20 text-emerald-500 border-emerald-500/40'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Customer details */}
                  <div className="space-y-1.5 mb-4 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className={`text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>{order.customer_name}</strong>
                      <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>{order.customer_phone}</span>
                    </div>

                    <div className={`flex items-start gap-1.5 p-2.5 rounded-xl border ${
                      isDark ? 'bg-black/70 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                    }`}>
                      <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="block text-[11px] font-medium">{order.delivery_address}</span>
                        {mapsUrl && (
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-amber-500 hover:underline font-black inline-flex items-center gap-1 mt-1"
                          >
                            <span>Navegación Google Maps</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className={`space-y-2 mb-4 p-3 rounded-2xl border ${
                    isDark ? 'bg-black/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                  }`}>
                    <span className={`text-[10px] font-black uppercase block ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Productos:</span>
                    {order.items && order.items.map((it, i) => (
                      <div key={i} className={`text-xs border-b pb-1.5 last:border-0 last:pb-0 ${isDark ? 'border-zinc-800/60' : 'border-zinc-200'}`}>
                        <div className={`flex justify-between font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                          <span>{it.quantity}x {it.name}</span>
                          <span className="text-amber-500">${(it.price_usd * it.quantity).toFixed(2)}</span>
                        </div>
                        {it.selectedOptions && (
                          <div className={`text-[10px] italic mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            {Object.entries(it.selectedOptions).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Payment Info */}
                  <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs mb-4 ${
                    isDark ? 'bg-black border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                  }`}>
                    <div>
                      <span className={`text-[10px] block ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Moneda / Pago:</span>
                      <strong className="text-amber-500">{order.currency} ({order.payment_method})</strong>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] block ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Total:</span>
                      <span className="text-base font-black text-emerald-500">
                        {EXCHANGE_RATES[order.currency]?.symbol || '$'} {Number(order.total_in_currency || order.total_usd).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className={`pt-2 border-t flex items-center gap-2 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                  {order.status === 'PENDIENTE' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'EN_PREPARACION')}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
                    >
                      <ChefHat className="w-4 h-4" />
                      <span>Pasar a Cocina</span>
                    </button>
                  )}
                  {order.status === 'EN_PREPARACION' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'EN_CAMINO')}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
                    >
                      <Bike className="w-4 h-4" />
                      <span>Enviar en Delivery</span>
                    </button>
                  )}
                  {order.status === 'EN_CAMINO' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'ENTREGADO')}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Marcar Entregado</span>
                    </button>
                  )}
                  {order.status === 'ENTREGADO' && (
                    <span className="w-full text-center text-xs text-emerald-500 font-extrabold py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
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
