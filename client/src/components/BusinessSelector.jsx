import React from 'react';
import { Store, Star, MapPin, CheckCircle2 } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function BusinessSelector({ businesses, activeBusiness, onSelectBusiness }) {
  const { formatPrice } = useCurrency();

  return (
    <div className="py-6 sm:py-8 bg-slate-950/60 border-y border-slate-800/80 my-6 sm:my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <span className="text-[11px] sm:text-xs font-extrabold uppercase text-orange-400 tracking-wider block">
              NUESTROS LOCALES DE COMIDA RÁPIDA
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">Elige tu Negocio Favorito</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xs hidden sm:block">
            Selecciona el restaurante para ver su menú exclusivo y tiempos de delivery.
          </p>
        </div>

        {/* Horizontal scroll on mobile, grid on md+ */}
        <div className="flex gap-4 overflow-x-auto pb-3 md:pb-0 md:grid md:grid-cols-3 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700">
          {businesses.map((b) => {
            const isSelected = activeBusiness?.slug === b.slug;
            return (
              <div
                key={b.id}
                onClick={() => onSelectBusiness(b)}
                className={`cursor-pointer rounded-2xl sm:rounded-3xl p-4 sm:p-5 border transition-all duration-300 relative overflow-hidden flex-shrink-0 w-72 sm:w-auto ${
                  isSelected
                    ? 'bg-slate-900 border-orange-500 shadow-xl shadow-orange-600/20 ring-2 ring-orange-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>ACTIVO</span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                    <img src={b.logo_url} alt={b.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm sm:text-base leading-snug">{b.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{b.rating || 4.9}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-3 font-normal">
                  {b.description}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                    <MapPin className="w-3 h-3 text-orange-400 flex-shrink-0" />
                    <span className="truncate">{b.address}</span>
                  </div>
                  <span className="font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20 flex-shrink-0">
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
