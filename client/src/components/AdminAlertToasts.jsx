import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, X, ChefHat } from 'lucide-react';
import { useOrders } from '../context/OrdersContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';

export default function AdminAlertToasts({ viewMode, onOpenAdmin }) {
  const { recentAlerts, dismissAlert } = useOrders();
  const { EXCHANGE_RATES } = useCurrency();
  const { isDark } = useTheme();

  if (recentAlerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[90] w-[calc(100vw-2rem)] sm:w-96 space-y-2.5 pointer-events-none">
      <AnimatePresence>
        {recentAlerts.map(({ alertId, order }) => {
          const symbol = EXCHANGE_RATES[order.currency]?.symbol || '$';
          const itemsSummary = (order.items || [])
            .map((it) => `${it.quantity}x ${it.name}`)
            .join(', ');

          return (
            <motion.div
              key={alertId}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className={`pointer-events-auto rounded-2xl p-3.5 border-2 border-orange-500 shadow-2xl shadow-orange-500/25 backdrop-blur-md ${
                isDark ? 'bg-zinc-950/95 text-white' : 'bg-white/95 text-zinc-900'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-500 border border-orange-500/40 flex items-center justify-center flex-shrink-0 animate-bounce">
                  <BellRing className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-orange-500 uppercase tracking-wide">
                      ¡Nuevo Pedido #{order.order_code}!
                    </span>
                    <button
                      onClick={() => dismissAlert(alertId)}
                      className={`p-1 rounded-lg transition ${
                        isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-black hover:bg-zinc-200'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs font-bold truncate mt-0.5">
                    {order.customer_name} • {symbol} {Number(order.total_in_currency || order.total_usd).toLocaleString()}
                  </p>
                  <p className={`text-[11px] line-clamp-2 mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {itemsSummary}
                  </p>

                  {viewMode !== 'kitchen' && (
                    <button
                      onClick={() => {
                        dismissAlert(alertId);
                        onOpenAdmin();
                      }}
                      className="mt-2 w-full py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] flex items-center justify-center gap-1.5 transition active:scale-95"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      <span>Ver en Panel Cocina / Admin</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
