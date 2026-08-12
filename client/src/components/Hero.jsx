import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, MapPin, DollarSign, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function Hero({ activeBusiness, onExploreMenu }) {
  const { currency, EXCHANGE_RATES } = useCurrency();

  return (
    <div className="relative overflow-hidden pt-6 pb-10 sm:pt-10 sm:pb-16">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-orange-600/15 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-amber-500/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column Text */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-5 text-center lg:text-left"
          >
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-3 py-1.5 rounded-full text-orange-400 text-[11px] sm:text-xs font-bold shadow-lg shadow-orange-500/10">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 animate-bounce" />
              <span>SISTEMA DE DELIVERY DIRECTO & GESTIÓN DE PEDIDOS</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-none tracking-tight">
              Hamburguesas Smash & <span className="gradient-text-orange">Perros Calientes</span> Especiales
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Pide delivery rápido y fácil. Guarda tu dirección con <strong className="text-white">Google Maps</strong>, elige tu moneda (<strong className="text-amber-400">USD $, COP $, Bs. VES</strong>) y recibe una notificación ordenada directo al negocio.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 max-w-sm sm:max-w-lg mx-auto lg:mx-0">
              <div className="glass-card p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-800 text-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mx-auto mb-1" />
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-200 block">Delivery Rápido</span>
                <span className="text-[9px] sm:text-[9px] text-slate-400 hidden sm:block">30-45 mins</span>
              </div>
              <div className="glass-card p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-800 text-center">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mx-auto mb-1" />
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-200 block">GPS Maps</span>
                <span className="text-[9px] text-slate-400 hidden sm:block">Ubicación exacta</span>
              </div>
              <div className="glass-card p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-800 text-center">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mx-auto mb-1" />
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-200 block">3 Monedas</span>
                <span className="text-[9px] text-slate-400 hidden sm:block">USD, COP, VES</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onExploreMenu}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black text-sm px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-xl shadow-orange-600/30 flex items-center justify-center gap-3 transition transform hover:scale-105"
              >
                <span>HACER MI PEDIDO AHORA</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900/80 px-4 py-3 rounded-2xl border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Notificación en tiempo real</span>
              </div>
            </div>

          </motion.div>

          {/* Right Column Floating Banner - hidden on mobile, visible lg+ */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative hidden lg:block"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              <div className="relative rounded-3xl overflow-hidden glass-card border border-slate-700/60 p-4 shadow-2xl">
                <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden group">
                  <img
                    src="/images/burger_hero.png"
                    alt="Hamburguesa Gourmet y Perro Caliente"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-300 font-black text-xs flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>{activeBusiness?.name || 'Smash & Dog Club'}</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Perros Especiales & Burgers</span>
                        <span className="text-[10px] text-slate-400">Con salsa de piña, tocineta y papa fosforito</span>
                      </div>
                      <span className="bg-orange-600 text-white font-black text-xs px-2.5 py-1 rounded-lg">
                        100% ONLINE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-6 bg-slate-900/95 backdrop-blur-md border border-orange-500/40 p-3 rounded-2xl shadow-xl flex items-center gap-3 max-w-[220px]"
              >
                <img src="/images/hotdog_hero.png" alt="Hot Dog" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <span className="text-xs font-black text-white block">Perro Colombiano</span>
                  <span className="text-[10px] text-amber-400 font-bold">$5.50 USD / COP $22.000</span>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* Mobile only image strip */}
          <div className="lg:hidden grid grid-cols-2 gap-3">
            <div className="rounded-2xl overflow-hidden h-40 border border-slate-800">
              <img src="/images/burger_hero.png" alt="Burger" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden h-40 border border-slate-800">
              <img src="/images/hotdog_hero.png" alt="Hot Dog" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
