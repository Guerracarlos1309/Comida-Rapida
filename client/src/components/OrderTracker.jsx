import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle2, Clock, ChefHat, Bike, PartyPopper, MessageSquare, MapPin, X, ExternalLink } from 'lucide-react';
import { io } from 'socket.io-client';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';

export default function OrderTracker({ order, onClose }) {
  const { EXCHANGE_RATES } = useCurrency();
  const { isDark } = useTheme();

  const [currentStatus, setCurrentStatus] = useState(order?.status || 'PENDIENTE');

  useEffect(() => {
    if (!order) return;
    setCurrentStatus(order.status || 'PENDIENTE');

    document.body.style.overflow = 'hidden';
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    // Connect to Socket.io for real-time status auto-update
    const socket = io('/', { transports: ['websocket', 'polling'] });

    socket.on('order_status_updated', ({ id, status, order: updatedOrder }) => {
      if (String(id) === String(order.id) || (updatedOrder && updatedOrder.order_code === order.order_code)) {
        setCurrentStatus(status);
      }
    });

    // Auto-update polling fallback every 4s
    const interval = setInterval(() => {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const match = data.find(o => String(o.id) === String(order.id) || o.order_code === order.order_code);
            if (match && match.status) {
              setCurrentStatus(match.status);
            }
          }
        })
        .catch(() => {});
    }, 4000);

    return () => {
      document.body.style.overflow = '';
      socket.disconnect();
      clearInterval(interval);
    };
  }, [order]);

  if (!order) return null;

  const STATUS_STEPS = [
    { key: 'PENDIENTE', label: 'Recibido', icon: Clock },
    { key: 'EN_PREPARACION', label: 'En Cocina', icon: ChefHat },
    { key: 'EN_CAMINO', label: 'En Camino', icon: Bike },
    { key: 'ENTREGADO', label: 'Entregado', icon: PartyPopper }
  ];

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === (currentStatus || 'PENDIENTE'));
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  const symbol = EXCHANGE_RATES[order.currency]?.symbol || '$';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          className={`relative z-10 w-full sm:max-w-xl max-h-[92vh] sm:max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-300 ${
            isDark ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 text-center border-b flex-shrink-0 relative">
            <button 
              onClick={onClose} 
              className={`absolute top-4 right-4 p-2 rounded-full transition ${
                isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-black hover:bg-zinc-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-6 h-6 animate-bounce" />
            </div>
            <h3 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>¡Pedido Registrado!</h3>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-xs text-orange-500 font-extrabold bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30 inline-block">
                Código: #{order.order_code}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded-full font-black animate-pulse">
                ⚡ EN VIVO
              </span>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-4">
            
            {/* Progress Timeline */}
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <span className={`text-[11px] font-black uppercase block mb-3 text-center ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                ESTADO EN TIEMPO REAL: <strong className="text-orange-500">{STATUS_STEPS[activeIndex]?.label}</strong>
              </span>
              <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center">
                {STATUS_STEPS.map((step, idx) => {
                  const IconComp = step.icon;
                  const isPassed = idx <= activeIndex;
                  const isCurrent = idx === activeIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${
                        isCurrent 
                          ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/40 ring-4 ring-orange-500/20 scale-110'
                          : isPassed 
                            ? isDark ? 'bg-zinc-800 text-amber-400 border border-amber-400/40' : 'bg-zinc-200 text-amber-600 border border-amber-500/40'
                            : isDark ? 'bg-zinc-950 text-zinc-600 border border-zinc-800' : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                      }`}>
                        <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className={`text-[10px] sm:text-[11px] font-extrabold mt-1.5 block ${
                        isCurrent ? 'text-orange-500' : isDark ? 'text-zinc-400' : 'text-zinc-600'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* WhatsApp Button */}
            {order.whatsapp?.whatsapp_url && (
              <div>
                <a 
                  href={order.whatsapp.whatsapp_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-xs sm:text-sm transition active:scale-95 min-h-[48px]"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Enviar Notificación por WhatsApp</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
                <span className={`text-[10px] block text-center mt-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Envía el pedido organizado directo al negocio
                </span>
              </div>
            )}

            {/* Receipt */}
            <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border space-y-2 text-xs ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Cliente:</span>
                <strong className={`text-right max-w-[200px] truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {order.customer_name} ({order.customer_phone})
                </strong>
              </div>
              <div className={`flex items-start justify-between border-b pb-2 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                <span className={`flex items-center gap-1 flex-shrink-0 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  <MapPin className="w-3.5 h-3.5 text-orange-500" /> Dir:
                </span>
                <span className={`text-right max-w-[200px] break-words ${isDark ? 'text-white' : 'text-zinc-900'}`}>{order.delivery_address}</span>
              </div>
              <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Pago:</span>
                <strong className="text-amber-500">{order.currency} ({order.payment_method})</strong>
              </div>

              {/* Items */}
              <div className="space-y-1 pt-1">
                <span className={`font-bold block mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Productos:</span>
                {order.items && order.items.map((it, idx) => (
                  <div key={idx} className={`flex justify-between ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    <span className="truncate max-w-[150px]">{it.quantity}x {it.name}</span>
                    <span className="font-mono opacity-80">${(it.price_usd * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className={`pt-2 border-t flex justify-between font-black ${
                isDark ? 'border-zinc-800 text-white' : 'border-zinc-200 text-zinc-900'
              }`}>
                <span>TOTAL A PAGAR:</span>
                <span className="text-amber-500 font-black">
                  {symbol} {Number(order.total_in_currency || order.total_usd).toLocaleString()}
                </span>
              </div>
            </div>

          </div>

          {/* Footer button */}
          <div className={`p-4 border-t flex-shrink-0 ${
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <button 
              onClick={onClose} 
              className={`w-full font-black py-3 rounded-xl text-xs transition active:scale-95 min-h-[44px] ${
                isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-900'
              }`}
            >
              Volver a la Tienda
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
