import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { BUSINESS } from '../App';

export default function CartDrawer({ onProceedToCheckout }) {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotalUsd } = useCart();
  const { formatPrice, currency, EXCHANGE_RATES } = useCurrency();
  const { isDark } = useTheme();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const deliveryFeeUsd = BUSINESS.delivery_fee_usd;
  const totalUsd = subtotalUsd + (cart.length > 0 ? deliveryFeeUsd : 0);

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Drawer - full screen on mobile, side panel on sm+ */}
        <div className="fixed inset-0 sm:inset-y-0 sm:right-0 sm:left-auto flex sm:pl-10 pointer-events-none">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`pointer-events-auto w-full sm:w-screen sm:max-w-md h-full shadow-2xl flex flex-col justify-between border-l transition-colors duration-300 ${
              isDark ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            
            {/* Header */}
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between flex-shrink-0 ${
              isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className={`font-black text-base sm:text-lg leading-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    Mi Carrito de Delivery
                  </h3>
                  <span className={`text-[11px] font-medium block ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Moneda: <strong className="text-amber-500">{currency} ({EXCHANGE_RATES[currency]?.symbol})</strong>
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className={`p-2 rounded-full transition ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 min-h-0">
              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className={`w-14 h-14 rounded-full border flex items-center justify-center mx-auto ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-300 text-zinc-400'
                  }`}>
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h4 className={`text-base font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>Tu carrito está vacío</h4>
                  <p className={`text-xs max-w-xs mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Selecciona una hamburguesa o perro caliente del menú para continuar.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartItemId} className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border space-y-2.5 ${
                    isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200 shadow-sm'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3 min-w-0">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-zinc-700/50 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className={`font-black text-xs sm:text-sm leading-tight truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>{item.name}</h4>
                          <span className="text-xs font-black text-amber-500 block mt-0.5">
                            {formatPrice(item.price_usd * item.quantity)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-zinc-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Selections summary */}
                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                      <div className={`text-[11px] p-2 rounded-lg space-y-0.5 border ${
                        isDark ? 'bg-black/60 text-zinc-300 border-zinc-800' : 'bg-white text-zinc-700 border-zinc-200'
                      }`}>
                        {Object.entries(item.selectedOptions).map(([key, val]) => {
                          if (Array.isArray(val) && val.length > 0) return (
                            <div key={key} className="truncate"><strong className="text-orange-500">{key}:</strong> {val.join(', ')}</div>
                          );
                          if (typeof val === 'string' && val) return (
                            <div key={key} className="truncate"><strong className="text-orange-500">{key}:</strong> {val}</div>
                          );
                          return null;
                        })}
                      </div>
                    )}

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Cantidad:</span>
                      <div className={`flex items-center gap-2 border px-2 py-1 rounded-xl ${
                        isDark ? 'bg-black border-zinc-800' : 'bg-white border-zinc-300'
                      }`}>
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, -1)} 
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isDark ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-900'
                          }`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className={`text-xs font-bold px-1.5 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, 1)} 
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isDark ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-900'
                          }`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className={`p-4 sm:p-5 border-t space-y-3 sm:space-y-4 flex-shrink-0 ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <div className="space-y-1.5 text-xs">
                  <div className={`flex justify-between ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    <span>Subtotal:</span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{formatPrice(subtotalUsd)}</span>
                  </div>
                  <div className={`flex justify-between ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    <span>Delivery:</span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{formatPrice(deliveryFeeUsd)}</span>
                  </div>
                  <div className={`pt-2 border-t flex justify-between font-black ${
                    isDark ? 'border-zinc-800 text-white' : 'border-zinc-200 text-zinc-900'
                  }`}>
                    <span>Total ({currency}):</span>
                    <span className="text-amber-500 text-base">{formatPrice(totalUsd)}</span>
                  </div>
                </div>

                <button
                  onClick={() => { setIsCartOpen(false); onProceedToCheckout(); }}
                  className="w-full bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black py-3.5 px-6 rounded-2xl shadow-xl shadow-orange-600/30 flex items-center justify-center gap-3 text-sm transition active:scale-95 min-h-[48px]"
                >
                  <span>DATOS DE ENTREGA</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
