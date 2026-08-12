import React, { useState } from 'react';
import { ShoppingBag, User, UtensilsCrossed, ChefHat, Globe, MapPin, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency, EXCHANGE_RATES } from '../context/CurrencyContext';

export default function Navbar({ activeBusiness, businesses, onSelectBusiness, viewMode, setViewMode }) {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { user, setIsAuthModalOpen, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">

        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0" onClick={() => { setViewMode('menu'); setMobileMenuOpen(false); }}>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-600/40 border border-orange-400/40">
            <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
          </div>
          <div>
            <span className="text-sm sm:text-lg font-black tracking-tight text-white flex items-center gap-1">
              BURGER & DOGS <span className="text-[9px] sm:text-xs bg-orange-500/20 text-orange-400 border border-orange-500/40 px-1.5 py-0.5 rounded-full font-bold">ONLINE</span>
            </span>
            <span className="hidden sm:block text-[11px] text-slate-400 -mt-1 font-medium">
              Gestión de Pedidos & Deliverys Directos
            </span>
          </div>
        </div>

        {/* Business Selector - only md+ */}
        <div className="hidden md:flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl px-3 py-1.5 gap-2 flex-shrink-0">
          <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
          <div className="text-left">
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Negocio:</span>
            <select
              value={activeBusiness?.slug || ''}
              onChange={(e) => {
                const b = businesses.find(item => item.slug === e.target.value);
                if (b) onSelectBusiness(b);
              }}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer max-w-[160px]"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.slug} className="bg-slate-900 text-white">
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">

          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-2.5">
            <Globe className="w-3.5 h-3.5 text-amber-400 mr-1 hidden sm:block" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-[11px] sm:text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
            >
              {Object.entries(EXCHANGE_RATES).map(([code, info]) => (
                <option key={code} value={code} className="bg-slate-900 text-white">
                  {info.flag} {code}
                </option>
              ))}
            </select>
          </div>

          {/* Kitchen button - sm+ only */}
          <button
            onClick={() => setViewMode(viewMode === 'kitchen' ? 'menu' : 'kitchen')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl font-bold text-xs border transition ${
              viewMode === 'kitchen'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
            }`}
          >
            <ChefHat className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">{viewMode === 'kitchen' ? 'Ver Menú' : 'Cocina / Admin'}</span>
          </button>

          {/* User Button */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-2xl px-3 py-1.5">
              <div className="w-7 h-7 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black text-xs border border-orange-500/30">
                {user.first_name[0]}
              </div>
              <div className="hidden lg:block text-left pr-1">
                <span className="text-xs font-bold text-white block leading-tight">{user.first_name}</span>
                <span className="text-[10px] text-slate-400 block leading-tight">Cliente Registrado</span>
              </div>
              <button onClick={logout} className="text-[10px] text-red-400 hover:text-red-300 font-bold ml-1 hover:underline">
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-2xl text-xs font-bold transition"
            >
              <User className="w-4 h-4 text-orange-400" />
              <span>Ingresar</span>
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-lg shadow-orange-600/30 flex items-center gap-2 font-bold transition transform hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">Pedido</span>
            {totalItemsCount > 0 && (
              <span className="w-5 h-5 bg-white text-orange-600 rounded-full font-black text-[11px] flex items-center justify-center shadow-md animate-bounce">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Hamburger Menu - mobile only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden bg-slate-900 border border-slate-700 text-slate-300 p-2 rounded-xl transition hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-950 border-t border-slate-800 px-4 py-4 space-y-3">
          
          {/* Business selector mobile */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5">
            <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Negocio Seleccionado</span>
              <select
                value={activeBusiness?.slug || ''}
                onChange={(e) => {
                  const b = businesses.find(item => item.slug === e.target.value);
                  if (b) { onSelectBusiness(b); setMobileMenuOpen(false); }
                }}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer w-full"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.slug} className="bg-slate-900 text-white">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Kitchen toggle mobile */}
          <button
            onClick={() => { setViewMode(viewMode === 'kitchen' ? 'menu' : 'kitchen'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border transition ${
              viewMode === 'kitchen'
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-900 border-slate-700 text-slate-300'
            }`}
          >
            <ChefHat className="w-4 h-4 text-amber-400" />
            <span>{viewMode === 'kitchen' ? 'Ver Menú' : 'Panel Cocina / Admin'}</span>
          </button>

          {/* Auth mobile */}
          {user ? (
            <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black text-xs border border-orange-500/30">
                  {user.first_name[0]}
                </div>
                <span className="text-sm font-bold text-white">{user.first_name} {user.last_name}</span>
              </div>
              <button onClick={logout} className="text-xs text-red-400 font-bold hover:underline">Salir</button>
            </div>
          ) : (
            <button
              onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold"
            >
              <User className="w-4 h-4 text-orange-400" />
              <span>Iniciar Sesión / Registrarse</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
