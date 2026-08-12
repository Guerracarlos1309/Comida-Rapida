import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';

export default function ItemModal({ item, onClose }) {
  const { addToCart } = useCart();
  const { formatPrice, getEquivalentText } = useCurrency();
  const { isDark } = useTheme();

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const initial = {};
    if (item?.options) {
      item.options.forEach(opt => {
        if (opt.type === 'single') initial[opt.name] = opt.choices[0];
        else if (opt.type === 'multi') initial[opt.name] = [...opt.choices];
        else if (opt.type === 'checkboxes') initial[opt.name] = [];
      });
    }
    return initial;
  });

  if (!item) return null;

  let extraPriceUsd = 0;
  if (item.options) {
    item.options.forEach(opt => {
      if (opt.type === 'checkboxes' && selectedOptions[opt.name]) {
        opt.choices.forEach(ch => {
          if (selectedOptions[opt.name].includes(ch.label)) {
            extraPriceUsd += Number(ch.price_usd || 0);
          }
        });
      }
    });
  }

  const itemTotalUsd = (Number(item.price_usd) + extraPriceUsd) * quantity;

  const handleToggleMulti = (optName, choiceLabel) => {
    setSelectedOptions(prev => {
      const current = prev[optName] || [];
      const updated = current.includes(choiceLabel)
        ? current.filter(c => c !== choiceLabel)
        : [...current, choiceLabel];
      return { ...prev, [optName]: updated };
    });
  };

  const handleAddToCart = () => {
    addToCart(item, quantity, selectedOptions, extraPriceUsd);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.97 }}
          className={`relative z-10 w-full sm:max-w-2xl h-[88vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col border transition-colors duration-300 ${
            isDark ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}
        >
          {/* Drag handle for mobile sheet */}
          <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 z-30 w-10 h-1 bg-white/40 rounded-full" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-3 right-3 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-black/80 text-white border border-white/20 shadow-lg hover:bg-black transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Image */}
          <div className="relative h-36 sm:h-48 w-full flex-shrink-0 bg-zinc-900">
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            {item.badge && (
              <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg z-20">
                {item.badge}
              </span>
            )}
            <div className="absolute bottom-3 left-4 right-14 text-white z-20">
              <h3 className="text-lg sm:text-2xl font-black leading-tight">{item.name}</h3>
              <p className="text-xs text-zinc-300 mt-0.5 line-clamp-1">{item.description}</p>
            </div>
          </div>

          {/* Scrollable Options Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 min-h-0">
            
            {/* Price Display */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <span className={`text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Precio Unitario:</span>
              <div className="text-right">
                <span className="text-base sm:text-lg font-black text-amber-500">{formatPrice(Number(item.price_usd) + extraPriceUsd)}</span>
                <span className="block text-[10px] text-zinc-500 hidden sm:block">{getEquivalentText(Number(item.price_usd) + extraPriceUsd)}</span>
              </div>
            </div>

            {/* Customization Options */}
            {item.options && item.options.map((opt, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-orange-500">{opt.name}</h4>
                  <span className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {opt.type === 'single' ? 'Elige 1' : 'Selecciona'}
                  </span>
                </div>

                {opt.type === 'single' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {opt.choices.map((choice, cIdx) => {
                      const isSelected = selectedOptions[opt.name] === choice;
                      return (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => setSelectedOptions({ ...selectedOptions, [opt.name]: choice })}
                          className={`p-3 rounded-xl text-left border text-xs font-bold flex items-center justify-between transition min-h-[44px] ${
                            isSelected
                              ? 'bg-orange-500/20 border-orange-500 text-orange-500'
                              : isDark 
                                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700' 
                                : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
                          }`}
                        >
                          <span>{choice}</span>
                          {isSelected && <Check className="w-4 h-4 text-orange-500" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {opt.type === 'multi' && (
                  <div className="flex flex-wrap gap-2">
                    {opt.choices.map((choice, cIdx) => {
                      const isChecked = (selectedOptions[opt.name] || []).includes(choice);
                      return (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => handleToggleMulti(opt.name, choice)}
                          className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 min-h-[40px] ${
                            isChecked
                              ? 'bg-amber-500/20 border-amber-500 text-amber-500'
                              : isDark 
                                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' 
                                : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-black'
                          }`}
                        >
                          <Check className={`w-3.5 h-3.5 ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                          <span>{choice}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {opt.type === 'checkboxes' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {opt.choices.map((ch, cIdx) => {
                      const isChecked = (selectedOptions[opt.name] || []).includes(ch.label);
                      return (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => handleToggleMulti(opt.name, ch.label)}
                          className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition min-h-[44px] ${
                            isChecked
                              ? 'bg-orange-500/20 border-orange-500 text-orange-500'
                              : isDark 
                                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700' 
                                : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
                          }`}
                        >
                          <span>{ch.label}</span>
                          <span className="text-amber-500 font-black">+{formatPrice(ch.price_usd)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* Footer */}
          <div className={`p-4 sm:p-5 border-t flex items-center gap-3 flex-shrink-0 ${
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}>
            
            {/* Quantity Controls */}
            <div className={`flex items-center gap-2 border px-2.5 py-1.5 rounded-2xl flex-shrink-0 ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-300'
            }`}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                  isDark ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-900'
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className={`font-black text-base px-1.5 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                  isDark ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-900'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black py-3 px-4 rounded-2xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 text-xs sm:text-sm transition active:scale-95 min-h-[44px]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Agregar ({formatPrice(itemTotalUsd)})</span>
            </button>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
