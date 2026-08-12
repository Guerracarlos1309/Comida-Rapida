import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle2, Clock, ChefHat, Bike, PartyPopper, MessageSquare, MapPin, X, ExternalLink } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function OrderTracker({ order, onClose }) {
  const { EXCHANGE_RATES } = useCurrency();

  useEffect(() => {
    if (order) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  }, [order]);

  if (!order) return null;

  const STATUS_STEPS = [
    { key: 'PENDIENTE', label: 'Recibido', icon: Clock },
    { key: 'EN_PREPARACION', label: 'En Cocina', icon: ChefHat },
    { key: 'EN_CAMINO', label: 'En Camino', icon: Bike },
    { key: 'ENTREGADO', label: 'Entregado', icon: PartyPopper }
  ];

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === (order.status || 'PENDIENTE'));
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  const symbol = EXCHANGE_RATES[order.currency]?.symbol || '$';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          className="w-full sm:max-w-xl bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-orange-950/50 relative"
          style={{ maxHeight: '95vh', overflowY: 'auto' }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="w-10 h-1 bg-slate-600 rounded-full" />
          </div>

          <div className="p-5 sm:p-8">
            {/* Close */}
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition">
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 animate-bounce" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">¡Pedido Registrado!</h3>
              <span className="text-xs text-orange-400 font-extrabold bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30 inline-block mt-1">
                Código: #{order.order_code}
              </span>
            </div>

            {/* Progress Timeline */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 mb-5">
              <span className="text-[11px] font-extrabold uppercase text-slate-400 block mb-4 text-center">ESTADO DEL PEDIDO</span>
              <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center">
                {STATUS_STEPS.map((step, idx) => {
                  const IconComp = step.icon;
                  const isPassed = idx <= activeIndex;
                  const isCurrent = idx === activeIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${
                        isCurrent ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/40 ring-4 ring-orange-500/20 scale-110'
                          : isPassed ? 'bg-slate-800 text-amber-400 border border-amber-400/40'
                          : 'bg-slate-900 text-slate-600 border border-slate-800'
                      }`}>
                        <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className={`text-[10px] sm:text-[11px] font-bold mt-1.5 block ${isCurrent ? 'text-orange-400' : 'text-slate-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* WhatsApp Button */}
            {order.whatsapp?.whatsapp_url && (
              <div className="mb-5">
                <a href={order.whatsapp.whatsapp_url} target="_blank" rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm transition">
                  <MessageSquare className="w-5 h-5" />
                  <span>Enviar Notificación por WhatsApp</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
                <span className="text-[10px] text-slate-400 block text-center mt-1.5">
                  Envía el pedido organizado al negocio
                </span>
              </div>
            )}

            {/* Receipt */}
            <div className="bg-slate-950 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Cliente:</span>
                <strong className="text-white text-right max-w-[200px] truncate">{order.customer_name} ({order.customer_phone})</strong>
              </div>
              <div className="flex items-start justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 flex items-center gap-1 flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" /> Dir:
                </span>
                <span className="text-white text-right max-w-[200px] break-words">{order.delivery_address}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Pago:</span>
                <strong className="text-amber-400">{order.currency} ({order.payment_method})</strong>
              </div>

              {/* Items */}
              <div className="space-y-1 pt-1">
                <span className="text-slate-400 font-bold block mb-1">Productos:</span>
                {order.items && order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300">
                    <span className="truncate max-w-[150px]">{it.quantity}x {it.name}</span>
                    <span className="font-mono text-slate-400">${(it.price_usd * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between font-extrabold text-white">
                <span>TOTAL A PAGAR:</span>
                <span className="text-amber-400 font-black">
                  {symbol} {Number(order.total_in_currency || order.total_usd).toLocaleString()}
                </span>
              </div>
            </div>

            <button onClick={onClose} className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition">
              Volver a la Tienda
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
