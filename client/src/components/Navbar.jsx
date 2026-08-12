import React, { useState } from 'react';
import { ShoppingBag, User, UtensilsCrossed, ChefHat, Globe, Menu, X, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency, EXCHANGE_RATES } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { BUSINESS } from '../App';

export default function Navbar({ viewMode, setViewMode }) {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { user, setIsAuthModalOpen, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={isDark
        ? { backgroundColor: 'rgba(14,22,40,0.95)', borderColor: 'rgba(30,45,84,0.9)' }
        : { backgroundColor: 'rgba(238,244,251,0.95)', borderColor: '#b8d0eb' }}
      className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-300 ${
        isDark ? 'text-white' : 'text-[#0a1628] shadow-sm'
      }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 overflow-hidden">

        {/* Brand Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer flex-shrink-0" 
          onClick={() => { setViewMode('menu'); setMobileMenuOpen(false); }}
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-600/30 border border-orange-400/40">
            <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
          </div>
          <div className="min-w-0">
            <span className={`text-xs sm:text-lg font-black tracking-tight flex items-center gap-1 leading-none ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>
              {BUSINESS.name} <span className="hidden sm:inline-flex text-[9px] sm:text-xs bg-orange-500/20 text-orange-500 border border-orange-500/30 px-1.5 py-0.5 rounded-full font-extrabold">ONLINE</span>
            </span>
            <span className={`hidden sm:block text-[11px] -mt-0.5 font-medium ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              Delivery Directo a tu Puerta
            </span>
          </div>
        </div>



        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 ml-auto flex-shrink-0">

          {/* Theme Toggle (Negro / Blanco) */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Cambiar a Fondo Blanco (Modo Claro)" : "Cambiar a Fondo Negro (Modo Oscuro)"}
            className={`p-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition active:scale-95 flex-shrink-0 ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800' 
                : 'bg-zinc-100 border-zinc-300 text-orange-600 hover:bg-zinc-200'
            }`}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span className="hidden lg:inline text-[11px] text-zinc-300">Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-zinc-800" />
                <span className="hidden lg:inline text-[11px] text-zinc-700">Modo Oscuro</span>
              </>
            )}
          </button>

          {/* Currency Switcher - sm+ on top bar (hidden on mobile header to prevent overflow, accessible via mobile drawer) */}
          <div className={`hidden sm:flex items-center border rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-2.5 flex-shrink-0 ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-300'
          }`}>
            <Globe className="w-3.5 h-3.5 text-amber-500 mr-1 hidden sm:block" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`bg-transparent text-[11px] sm:text-xs font-bold focus:outline-none cursor-pointer ${
                isDark ? 'text-amber-400' : 'text-orange-600'
              }`}
            >
              {Object.entries(EXCHANGE_RATES).map(([code, info]) => (
                <option key={code} value={code} className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}>
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
                ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/30'
                : isDark 
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white' 
                  : 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-zinc-900'
            }`}
          >
            <ChefHat className="w-4 h-4 text-amber-500" />
            <span className="hidden lg:inline">{viewMode === 'kitchen' ? 'Ver Menú' : 'Cocina / Admin'}</span>
          </button>

          {/* User Button */}
          {user ? (
            <div className={`hidden sm:flex items-center gap-2 border rounded-2xl px-3 py-1.5 ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-300'
            }`}>
              <div className="w-7 h-7 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center font-black text-xs border border-orange-500/30">
                {user.first_name[0]}
              </div>
              <div className="hidden lg:block text-left pr-1">
                <span className={`text-xs font-bold block leading-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>{user.first_name}</span>
                <span className={`text-[10px] block leading-tight ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Cliente</span>
              </div>
              <button onClick={logout} className="text-[10px] text-red-500 hover:text-red-600 font-bold ml-1 hover:underline">
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={`hidden sm:flex items-center gap-2 border px-3 py-2 rounded-2xl text-xs font-bold transition ${
                isDark 
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-white' 
                  : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-900'
              }`}
            >
              <User className="w-4 h-4 text-orange-500" />
              <span>Ingresar</span>
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-lg shadow-orange-600/30 flex items-center gap-1.5 sm:gap-2 font-bold transition transform hover:scale-105 active:scale-95 flex-shrink-0"
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
            className={`sm:hidden border p-2 rounded-xl transition flex-shrink-0 ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-300 text-zinc-800'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className={`sm:hidden border-t px-4 py-4 space-y-3 transition-colors duration-300 ${
          isDark ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
        }`}>
          
          {/* Currency Switcher Mobile */}
          <div className={`flex items-center justify-between border rounded-xl px-3 py-2.5 ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-300'
          }`}>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-500" />
              <span className={`text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Moneda de Pago</span>
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`bg-transparent text-xs font-extrabold focus:outline-none cursor-pointer ${
                isDark ? 'text-amber-400' : 'text-orange-600'
              }`}
            >
              {Object.entries(EXCHANGE_RATES).map(([code, info]) => (
                <option key={code} value={code} className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}>
                  {info.flag} {code}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Toggle Mobile Button */}
          <button
            onClick={() => { toggleTheme(); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-xs border transition ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-amber-400' : 'bg-zinc-100 border-zinc-300 text-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-800" />}
              <span>{isDark ? 'Fondo Negro (Modo Oscuro)' : 'Fondo Blanco (Modo Claro)'}</span>
            </div>
            <span className="text-[10px] uppercase bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full font-extrabold">
              Cambiar
            </span>
          </button>


          {/* Kitchen toggle mobile */}
          <button
            onClick={() => { setViewMode(viewMode === 'kitchen' ? 'menu' : 'kitchen'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs border transition ${
              viewMode === 'kitchen'
                ? 'bg-amber-500 text-black border-amber-400'
                : isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-300 text-zinc-800'
            }`}
          >
            <ChefHat className="w-4 h-4 text-amber-500" />
            <span>{viewMode === 'kitchen' ? 'Ver Menú Principal' : 'Panel Cocina / Admin'}</span>
          </button>

          {/* Auth mobile */}
          {user ? (
            <div className={`flex items-center justify-between border rounded-xl px-3 py-2.5 ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-300'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center font-black text-xs border border-orange-500/30">
                  {user.first_name[0]}
                </div>
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{user.first_name} {user.last_name}</span>
              </div>
              <button onClick={logout} className="text-xs text-red-500 font-bold hover:underline">Salir</button>
            </div>
          ) : (
            <button
              onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-center gap-2 border px-4 py-2.5 rounded-xl text-xs font-bold ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-300 text-zinc-900'
              }`}
            >
              <User className="w-4 h-4 text-orange-500" />
              <span>Iniciar Sesión / Registrarse</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
