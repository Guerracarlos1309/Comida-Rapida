import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export default function CartDrawer({ activeBusiness, onProceedToCheckout }) {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotalUsd } = useCart();
  const { formatPrice, currency, EXCHANGE_RATES } = useCurrency();

  const deliveryFeeUsd = activeBusiness?.delivery_fee_usd || 2.00;
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
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Drawer - full screen on mobile, side panel on sm+ */}
        <div className="fixed inset-0 sm:inset-y-0 sm:right-0 sm:left-auto flex sm:pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full sm:w-screen sm:max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between"
          >
            
            {/* Header */}
            <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base sm:text-lg leading-tight">Mi Carrito de Delivery</h3>
                  <span className="text-[11px] text-slate-400 font-medium block">
                    Moneda: <strong className="text-amber-400">{currency} ({EXCHANGE_RATES[currency]?.symbol})</strong>
                  </span>
                </div>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 text-slate-500 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">Tu carrito está vacío</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Selecciona una hamburguesa o perro caliente del menú para continuar.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartItemId} className="p-3 sm:p-4 bg-slate-950/80 rounded-xl sm:rounded-2xl border border-slate-800 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-extrabold text-white text-sm leading-tight line-clamp-2">{item.name}</h4>
                          <span className="text-xs font-black text-amber-400 block mt-0.5">
                            {formatPrice(item.price_usd * item.quantity)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Selections summary */}
                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                      <div className="text-[11px] bg-slate-900/90 p-2 rounded-lg text-slate-300 space-y-0.5 border border-slate-800/60">
                        {Object.entries(item.selectedOptions).map(([key, val]) => {
                          if (Array.isArray(val) && val.length > 0) return (
                            <div key={key} className="truncate"><strong className="text-orange-400">{key}:</strong> {val.join(', ')}</div>
                          );
                          if (typeof val === 'string' && val) return (
                            <div key={key} className="truncate"><strong className="text-orange-400">{key}:</strong> {val}</div>
                          );
                          return null;
                        })}
                      </div>
                    )}

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Cantidad:</span>
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-2 py-1 rounded-xl">
                        <button onClick={() => updateQuantity(item.cartItemId, -1)} className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white px-1.5">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartItemId, 1)} className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs">
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
              <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 space-y-3 sm:space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span className="text-white font-bold">{formatPrice(subtotalUsd)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Delivery:</span>
                    <span className="text-white font-bold">{formatPrice(deliveryFeeUsd)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between font-extrabold text-white">
                    <span>Total ({currency}):</span>
                    <span className="text-amber-400 text-base">{formatPrice(totalUsd)}</span>
                  </div>
                </div>

                <button
                  onClick={() => { setIsCartOpen(false); onProceedToCheckout(); }}
                  className="w-full bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black py-3.5 px-6 rounded-2xl shadow-xl shadow-orange-600/30 flex items-center justify-center gap-3 text-sm transition"
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
