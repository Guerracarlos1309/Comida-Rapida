import React from 'react';
import { UtensilsCrossed, Heart, MapPin, Phone, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { BUSINESS } from '../App';

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`border-t py-12 relative z-10 mt-16 transition-colors duration-300 ${
      isDark ? 'bg-black border-zinc-800 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black shadow-md">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className={`font-black text-lg ${isDark ? 'text-white' : 'text-zinc-900'}`}>FAST FOOD ONLINE</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Sistema de Pedidos Online y Delivery Directo para Perros Calientes y Hamburguesas Gourmet.
            </p>
          </div>

          {/* Col 2: Business Info */}
          <div>
            <h4 className={`font-extrabold text-xs uppercase tracking-wider mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Información del Negocio
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>{BUSINESS.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>{BUSINESS.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Abiertos todos los días: 5:00 PM - 1:00 AM</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment Currencies */}
          <div>
            <h4 className={`font-extrabold text-xs uppercase tracking-wider mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Monedas Aceptadas
            </h4>
            <div className="space-y-2 text-xs">
              <div className={`flex items-center gap-2 p-2 rounded-xl border ${
                isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
              }`}>
                <span className="text-base">🇺🇸</span>
                <span className={isDark ? 'text-zinc-200' : 'text-zinc-800'}>Dólares ($ USD)</span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded-xl border ${
                isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
              }`}>
                <span className="text-base">🇨🇴</span>
                <span className={isDark ? 'text-zinc-200' : 'text-zinc-800'}>Pesos Colombianos (COP $)</span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded-xl border ${
                isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
              }`}>
                <span className="text-base">🇻🇪</span>
                <span className={isDark ? 'text-zinc-200' : 'text-zinc-800'}>Bolívares (Bs. VES)</span>
              </div>
            </div>
          </div>

          {/* Col 4: Google Maps & Delivery Note */}
          <div>
            <h4 className={`font-extrabold text-xs uppercase tracking-wider mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Integración Google Maps
            </h4>
            <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Guarda tu pin de GPS en Google Maps para ahorrar tiempo en todos tus pedidos futuros.
            </p>
            <div className="bg-orange-500/10 border border-orange-500/30 p-3 rounded-2xl text-[11px] text-orange-500 font-extrabold">
              ⚡ Deliverys directos a tu puerta en 30 minutos.
            </div>
          </div>

        </div>

        <div className={`pt-8 border-t text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-2 ${
          isDark ? 'border-zinc-900 text-zinc-500' : 'border-zinc-200 text-zinc-500'
        }`}>
          <span>&copy; 2026 Fast Food Delivery System. Todos los derechos reservados.</span>
          <span className="flex items-center gap-1">
            Diseñado con <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> para Perros Calientes & Hamburguesas
          </span>
        </div>

      </div>
    </footer>
  );
}
