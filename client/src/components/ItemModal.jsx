import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export default function ItemModal({ item, onClose }) {
  const { addToCart } = useCart();
  const { formatPrice, getEquivalentText } = useCurrency();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const initial = {};
    if (item.options) {
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
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.97 }}
          className="w-full sm:max-w-2xl bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          style={{ maxHeight: '92vh' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-slate-950/80 hover:bg-slate-950 text-slate-300 hover:text-white p-2 rounded-full border border-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Image */}
          <div className="relative h-44 sm:h-56 w-full flex-shrink-0">
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            {item.badge && (
              <span className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                {item.badge}
              </span>
            )}
            <div className="absolute bottom-4 left-4 right-12">
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">{item.name}</h3>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{item.description}</p>
            </div>
          </div>

          {/* Scrollable Options Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
            
            {/* Price Display */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Precio Unitario:</span>
              <div className="text-right">
                <span className="text-base sm:text-lg font-black text-amber-400">{formatPrice(Number(item.price_usd) + extraPriceUsd)}</span>
                <span className="block text-[10px] text-slate-500 hidden sm:block">{getEquivalentText(Number(item.price_usd) + extraPriceUsd)}</span>
              </div>
            </div>

            {/* Customization Options */}
            {item.options && item.options.map((opt, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-orange-400">{opt.name}</h4>
                  <span className="text-[10px] text-slate-400">
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
                          className={`p-2.5 sm:p-3 rounded-xl text-left border text-xs font-semibold flex items-center justify-between transition ${
                            isSelected
                              ? 'bg-orange-500/20 border-orange-500 text-white'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span>{choice}</span>
                          {isSelected && <Check className="w-4 h-4 text-orange-400" />}
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
                          className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                            isChecked
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
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
                          className={`p-2.5 sm:p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                            isChecked
                              ? 'bg-orange-600/20 border-orange-500 text-white'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span>{ch.label}</span>
                          <span className="text-amber-400 font-bold">+{formatPrice(ch.price_usd)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
            
            {/* Quantity Controls */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 px-2.5 py-1.5 rounded-2xl flex-shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-extrabold text-white text-base px-1.5">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold py-3 px-4 rounded-2xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 text-sm transition"
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
