import React from 'react';
import { Store, Star, MapPin, CheckCircle2 } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';

export default function BusinessSelector({ businesses, activeBusiness, onSelectBusiness }) {
  const { formatPrice } = useCurrency();
  const { isDark } = useTheme();

  return (
    <div className={`py-6 sm:py-8 border-y transition-colors duration-300 my-6 sm:my-8 ${
      isDark ? 'bg-black border-zinc-800' : 'bg-zinc-50 border-zinc-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 sm:mb-6">
          <div>
            <span className="text-[11px] sm:text-xs font-black uppercase text-orange-500 tracking-wider block">
              NUESTROS LOCALES DE COMIDA RÁPIDA
            </span>
            <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Elige tu Negocio Favorito
            </h2>
          </div>
          <p className={`text-xs max-w-xs hidden sm:block ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Selecciona el restaurante para ver su menú exclusivo y sus datos de envío.
          </p>
        </div>

        {/* Horizontal scroll on mobile, grid on md+ */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 md:pb-0 md:grid md:grid-cols-3 scrollbar-none">
          {businesses.map((b) => {
            const isSelected = activeBusiness?.slug === b.slug;
            return (
              <div
                key={b.id}
                onClick={() => onSelectBusiness(b)}
                className={`cursor-pointer rounded-2xl sm:rounded-3xl p-4 sm:p-5 border transition-all duration-300 relative overflow-hidden flex-shrink-0 w-72 sm:w-auto active:scale-95 ${
                  isSelected
                    ? isDark 
                      ? 'bg-zinc-900 border-orange-500 shadow-xl shadow-orange-600/20 ring-2 ring-orange-500/40' 
                      : 'bg-white border-orange-500 shadow-xl shadow-orange-500/15 ring-2 ring-orange-500/40'
                    : isDark 
                      ? 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700' 
                      : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>ACTIVO</span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden border flex-shrink-0 ${
                    isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-100 border-zinc-300'
                  }`}>
                    <img src={b.logo_url} alt={b.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className={`font-black text-sm sm:text-base leading-snug ${isDark ? 'text-white' : 'text-zinc-900'}`}>{b.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-extrabold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{b.rating || 4.9}</span>
                    </div>
                  </div>
                </div>

                <p className={`text-xs line-clamp-2 mb-3 font-normal ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  {b.description}
                </p>

                <div className={`pt-3 border-t flex items-center justify-between text-[11px] ${
                  isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500'
                }`}>
                  <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    <span className="truncate">{b.address}</span>
                  </div>
                  <span className="font-extrabold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20 flex-shrink-0">
                    {formatPrice(b.delivery_fee_usd || 2)}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
