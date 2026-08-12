import React from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Clock,
  MapPin,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import { useTheme } from "../context/ThemeContext";
import { BUSINESS } from "../App";

export default function Hero({ onExploreMenu }) {
  const { currency } = useCurrency();
  const { isDark } = useTheme();

  return (
    <div className="relative overflow-hidden pt-4 pb-8 sm:pt-10 sm:pb-16 transition-colors duration-300">
      {/* Background Radial Glow — Tavo's palette */}
      <div
        style={isDark
          ? { background: 'radial-gradient(circle, rgba(0,207,255,0.14) 0%, transparent 70%)' }
          : { background: 'radial-gradient(circle, rgba(255,112,32,0.10) 0%, transparent 70%)' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full blur-[100px] sm:blur-[140px] pointer-events-none"
      />
      <div
        style={isDark
          ? { background: 'radial-gradient(circle, rgba(255,208,0,0.10) 0%, transparent 70%)' }
          : { background: 'radial-gradient(circle, rgba(255,208,0,0.08) 0%, transparent 70%)' }}
        className="absolute top-1/3 right-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full blur-[80px] sm:blur-[120px] pointer-events-none"
      />
      <div
        style={isDark ? { background: 'radial-gradient(circle, rgba(0,168,232,0.07) 0%, transparent 70%)' } : {}}
        className="absolute bottom-0 left-0 w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] rounded-full blur-[80px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left"
          >
            {/* Top Badge */}
            <div
              className={`inline-flex items-center gap-1.5 border px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black tracking-wide ${
                isDark
                  ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                  : "bg-orange-50 border-orange-300 text-orange-600"
              }`}
            >
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 animate-bounce" />
              <span>SISTEMA DE DELIVERY DIRECTO & GESTIÓN DE PEDIDOS</span>
            </div>

            {/* Headline */}
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight sm:leading-none tracking-tight ${
                isDark ? "text-white" : "text-zinc-900"
              }`}
            >
              Perros Calientes{" "}
              <span className="gradient-text-orange">Especiales</span>
            </h1>

            <p
              className={`text-xs sm:text-sm max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed ${
                isDark ? "text-zinc-300" : "text-zinc-600"
              }`}
            >
              Pide delivery rápido y fácil. Guarda tu dirección con{" "}
              <strong className={isDark ? "text-white" : "text-zinc-900"}>
                Google Maps
              </strong>
              , elige tu moneda (
              <strong className="text-amber-500">USD $, COP $, Bs. VES</strong>)
              y recibe confirmación directa en el local.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 max-w-sm sm:max-w-lg mx-auto lg:mx-0">
              <div
                className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-center transition ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800"
                    : "bg-zinc-50 border-zinc-200 shadow-sm"
                }`}
              >
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mx-auto mb-1" />
                <span
                  className={`text-[10px] sm:text-[11px] font-extrabold block ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
                >
                  Delivery Rápido
                </span>
                <span
                  className={`text-[9px] block ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
                >
                  10-25 mins
                </span>
              </div>
              <div
                className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-center transition ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800"
                    : "bg-zinc-50 border-zinc-200 shadow-sm"
                }`}
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mx-auto mb-1" />
                <span
                  className={`text-[10px] sm:text-[11px] font-extrabold block ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
                >
                  GPS Maps
                </span>
                <span
                  className={`text-[9px] block ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
                >
                  Ubicación exacta
                </span>
              </div>
              <div
                className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-center transition ${
                  isDark
                    ? "bg-zinc-900/90 border-zinc-800"
                    : "bg-zinc-50 border-zinc-200 shadow-sm"
                }`}
              >
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mx-auto mb-1" />
                <span
                  className={`text-[10px] sm:text-[11px] font-extrabold block ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
                >
                  3 Monedas
                </span>
                <span
                  className={`text-[9px] block ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
                >
                  USD, COP, VES
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onExploreMenu}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black text-xs sm:text-sm px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 sm:gap-3 transition transform hover:scale-105 active:scale-95"
              >
                <span>HACER MI PEDIDO AHORA</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </motion.div>

          {/* Right Column Floating Banner - lg+ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative hidden lg:block"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div
                className={`relative rounded-3xl overflow-hidden p-4 shadow-2xl border transition ${
                  isDark
                    ? "bg-zinc-900/80 border-zinc-800"
                    : "bg-white border-zinc-200"
                }`}
              >
                <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden group">
                  <img
                    src="/images/burger_hero.png"
                    alt="Hamburguesa Gourmet y Perro Caliente"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-300 font-black text-xs flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>{BUSINESS.name}</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md p-3.5 rounded-2xl border border-zinc-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {BUSINESS.name}
                        </span>
                        <span className="text-[10px] text-zinc-300">
                          {BUSINESS.tagline}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute -bottom-6 -left-6 border p-3 rounded-2xl shadow-xl flex items-center gap-3 max-w-[230px] ${
                  isDark
                    ? "bg-zinc-900 border-orange-500/40"
                    : "bg-white border-orange-300"
                }`}
              >
                <img
                  src="/images/hotdog_hero.png"
                  alt="Hot Dog"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <span
                    className={`text-xs font-black block ${isDark ? "text-white" : "text-zinc-900"}`}
                  >
                    Perro Colombiano
                  </span>
                  <span className="text-[10px] text-amber-500 font-bold">
                    $5.50 USD / COP $22.000
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Mobile only image grid */}
          <div className="lg:hidden grid grid-cols-2 gap-3 pt-2">
            <div
              className={`rounded-2xl overflow-hidden h-36 border shadow ${isDark ? "border-zinc-800" : "border-zinc-200"}`}
            >
              <img
                src="/images/burger_hero.png"
                alt="Burger"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className={`rounded-2xl overflow-hidden h-36 border shadow ${isDark ? "border-zinc-800" : "border-zinc-200"}`}
            >
              <img
                src="/images/hotdog_hero.png"
                alt="Hot Dog"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
