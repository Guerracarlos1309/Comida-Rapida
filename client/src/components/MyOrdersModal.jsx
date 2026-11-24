import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ClipboardList,
  RefreshCw,
  Copy,
  Edit3,
  Clock,
  ChefHat,
  Bike,
  CheckCircle2,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { useOrders } from '../context/OrdersContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';

const STATUS_BADGES = {
  PENDIENTE: {
    label: 'Recibido',
    icon: Clock,
    cls: 'bg-orange-500/20 text-orange-500 border-orange-500/40',
  },
  EN_PREPARACION: {
    label: 'En Cocina',
    icon: ChefHat,
    cls: 'bg-amber-500/20 text-amber-500 border-amber-500/40',
  },
  EN_CAMINO: {
    label: 'En Camino',
    icon: Bike,
    cls: 'bg-blue-500/20 text-blue-500 border-blue-500/40',
  },
  ENTREGADO: {
    label: 'Entregado',
    icon: CheckCircle2,
    cls: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40',
  },
  CANCELADO: {
    label: 'Cancelado',
    icon: AlertCircle,
    cls: 'bg-red-500/20 text-red-500 border-red-500/40',
  },
};

export default function MyOrdersModal({ isOpen, onClose, onSelectOrderForTracker }) {
  const { myOrders, repeatOrderIdentical, refreshMyOrders } = useOrders();
  const { loadOrderIntoCart } = useCart();
  const { EXCHANGE_RATES } = useCurrency();
  const { isDark } = useTheme();

  const [repeatingCode, setRepeatingCode] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      refreshMyOrders();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRepeatEqual = async (order) => {
    setErrorMsg('');
    setRepeatingCode(order.order_code);
    try {
      const newOrder = await repeatOrderIdentical(order);
      onClose();
      onSelectOrderForTracker(newOrder);
    } catch (err) {
      setErrorMsg(err.message || 'No se pudo repetir el pedido');
    } finally {
      setRepeatingCode(null);
    }
  };

  const handleDuplicateAndEdit = (order) => {
    loadOrderIntoCart(order.items || []);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          className={`relative z-10 w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-300 ${
            isDark ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}
        >
          {/* Header */}
          <div
            className={`p-4 sm:p-6 border-b flex items-center justify-between flex-shrink-0 ${
              isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-500 flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Mis Pedidos ({myOrders.length})
                </h2>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Sigue tus pedidos en vivo, repítelos iguales o cambia cualquier detalle
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition ${
                isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-black hover:bg-zinc-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {myOrders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div
                  className={`w-14 h-14 rounded-full border flex items-center justify-center mx-auto ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-300 text-zinc-400'
                  }`}
                >
                  <ClipboardList className="w-7 h-7" />
                </div>
                <h4 className={`text-base font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Aún no tienes pedidos registrados
                </h4>
                <p className={`text-xs max-w-xs mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Cuando realices un pedido aparecerá aquí para que puedas ver su estado o repetirlo al instante.
                </p>
              </div>
            ) : (
              myOrders.map((order) => {
                const statusInfo = STATUS_BADGES[order.status] || STATUS_BADGES.PENDIENTE;
                const StatusIcon = statusInfo.icon;
                const symbol = EXCHANGE_RATES[order.currency]?.symbol || '$';
                const isRepeating = repeatingCode === order.order_code;

                return (
                  <div
                    key={order.order_code || order.id}
                    className={`p-4 rounded-2xl border space-y-3 ${
                      isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-zinc-50 border-zinc-200 shadow-sm'
                    }`}
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-black font-mono text-amber-500">
                          #{order.order_code}
                        </span>
                        <span className={`text-[11px] block ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          {new Date(order.created_at || Date.now()).toLocaleString()}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-black px-2.5 py-1 rounded-full border inline-flex items-center gap-1 ${statusInfo.cls}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>

                    {/* Items Summary */}
                    <div
                      className={`p-3 rounded-xl border space-y-1.5 text-xs ${
                        isDark ? 'bg-black/60 border-zinc-800' : 'bg-white border-zinc-200'
                      }`}
                    >
                      {(order.items || []).map((it, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex justify-between font-bold">
                            <span>
                              {it.quantity}x {it.name}
                            </span>
                            <span className="text-amber-500">
                              ${(Number(it.price_usd) * Number(it.quantity)).toFixed(2)}
                            </span>
                          </div>
                          {it.selectedOptions && Object.keys(it.selectedOptions).length > 0 && (
                            <div className={`text-[10px] italic ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                              {Object.entries(it.selectedOptions)
                                .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
                                .join(' | ')}
                            </div>
                          )}
                          {it.instructions && (
                            <div className="text-[10px] text-amber-400 italic">
                              📝 "{it.instructions}"
                            </div>
                          )}
                        </div>
                      ))}
                      <div
                        className={`pt-2 border-t flex justify-between font-black ${
                          isDark ? 'border-zinc-800' : 'border-zinc-200'
                        }`}
                      >
                        <span>Total ({order.payment_method}):</span>
                        <span className="text-emerald-500">
                          {symbol} {Number(order.total_in_currency || order.total_usd).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectOrderForTracker(order);
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition active:scale-95 ${
                          isDark
                            ? 'bg-zinc-950 border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                            : 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-100'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Estado</span>
                      </button>

                      <button
                        type="button"
                        disabled={isRepeating}
                        onClick={() => handleRepeatEqual(order)}
                        className="py-2.5 px-3 rounded-xl text-xs font-black bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 disabled:opacity-60"
                      >
                        {isRepeating ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{isRepeating ? 'Enviando...' : 'Repetir Igual'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicateAndEdit(order)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition active:scale-95 ${
                          isDark
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25'
                            : 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Clonar y Cambiar</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
