import React from 'react';
import { UtensilsCrossed, Heart, MapPin, Phone, Clock, DollarSign } from 'lucide-react';

export default function Footer({ activeBusiness }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 relative z-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-slate-950 flex items-center justify-center font-black">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-white font-extrabold text-lg">FAST FOOD ONLINE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sistema de Landing Page y Gestión de Pedidos Online para Perros Calientes y Hamburguesas Gourmet.
            </p>
          </div>

          {/* Col 2: Business Info */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Información del Negocio</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>{activeBusiness?.address || 'Zona Gourmet de Comida Rápida'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>{activeBusiness?.phone || '+57 300 123 4567'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Abiertos todos los días: 5:00 PM - 1:00 AM</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment Currencies */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Monedas Aceptadas</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                <span className="text-base">🇺🇸</span>
                <span>Dólares ($ USD)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                <span className="text-base">🇨🇴</span>
                <span>Pesos Colombianos (COP $)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                <span className="text-base">🇻🇪</span>
                <span>Bolívares (Bs. VES)</span>
              </div>
            </div>
          </div>

          {/* Col 4: Google Maps & Delivery Note */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Integración Google Maps</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Guarda tu pin de GPS en Google Maps para ahorrar tiempo en todos tus pedidos futuros.
            </p>
            <div className="bg-orange-500/10 border border-orange-500/30 p-3 rounded-2xl text-[11px] text-orange-400 font-bold">
              ⚡ Deliverys directos a tu puerta en 30 minutos.
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 Fast Food Delivery System. Todos los derechos reservados.</span>
          <span className="flex items-center gap-1">
            Diseñado con <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> para Perros Calientes & Hamburguesas
          </span>
        </div>

      </div>
    </footer>
  );
}
