import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Mail, Phone, MapPin, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import GoogleMapPicker from './GoogleMapPicker';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useAuth();
  const { isDark } = useTheme();

  // Lock body scroll when auth modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAuthModalOpen]);

  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', password: '',
    phone: '', address: '', address_lat: 4.6097, address_lng: -74.0817, address_details: ''
  });

  if (!isAuthModalOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLocationSave = (locData) => {
    setFormData(prev => ({ ...prev, address: locData.address, address_lat: locData.address_lat, address_lng: locData.address_lng, address_details: locData.address_details }));
    setShowMap(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const bodyPayload = tab === 'login' ? { email: formData.email, password: formData.password } : formData;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
      login(data.user, data.token);
    } catch (err) {
      if (tab === 'register') {
        const dummyUser = {
          id: Date.now(), first_name: formData.first_name || 'Cliente', last_name: formData.last_name || 'VIP',
          email: formData.email, phone: formData.phone || '+57300000000',
          address: formData.address || 'Dirección guardada', address_lat: formData.address_lat,
          address_lng: formData.address_lng, address_details: formData.address_details, role: 'customer'
        };
        login(dummyUser, 'mock_jwt_token_2026');
      } else {
        setError(err.message || 'Error en inicio de sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={() => setIsAuthModalOpen(false)} />

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          className={`relative z-10 w-full sm:max-w-lg max-h-[92vh] sm:max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-300 ${
            isDark ? 'bg-black border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}
        >
          {/* Top glow */}
          <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 z-20" />
          
          {/* Header */}
          <div className="p-5 sm:p-6 text-center border-b flex-shrink-0 relative">
            <button 
              onClick={() => setIsAuthModalOpen(false)} 
              className={`absolute top-4 right-4 p-2 rounded-full transition ${
                isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-black hover:bg-zinc-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 mb-2">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {tab === 'login' ? '¡Bienvenido de Nuevo!' : 'Crear Cuenta de Cliente'}
            </h3>
            <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Guarda tu dirección GPS y agiliza tus pedidos
            </p>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-4">
            
            {/* Tabs */}
            <div className={`flex p-1 rounded-2xl border ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
            }`}>
              <button 
                onClick={() => { setTab('login'); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition ${
                  tab === 'login' 
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md' 
                    : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Iniciar Sesión</span>
              </button>
              <button 
                onClick={() => { setTab('register'); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition ${
                  tab === 'register' 
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md' 
                    : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Registrarse</span>
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs px-4 py-3 rounded-xl font-bold">
                {error}
              </div>
            )}

            <form id="auth-form" onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {tab === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Nombre *</label>
                      <input 
                        type="text" 
                        name="first_name" 
                        required 
                        value={formData.first_name} 
                        onChange={handleChange}
                        placeholder="Juan" 
                        className={`w-full border rounded-xl px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:border-orange-500 ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                        }`} 
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Apellido *</label>
                      <input 
                        type="text" 
                        name="last_name" 
                        required 
                        value={formData.last_name} 
                        onChange={handleChange}
                        placeholder="Pérez" 
                        className={`w-full border rounded-xl px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:border-orange-500 ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                        }`} 
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Teléfono (WhatsApp)</label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        name="phone" 
                        required 
                        value={formData.phone} 
                        onChange={handleChange}
                        placeholder="+57 300 1234567 o 0414-1234567"
                        className={`w-full border rounded-xl px-3 py-2.5 pl-9 text-base sm:text-sm focus:outline-none focus:border-orange-500 ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                        }`} 
                      />
                      <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Dirección (Google Maps)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        name="address" 
                        readOnly 
                        value={formData.address || ''}
                        placeholder="Haga clic en Pin Mapa →"
                        className={`flex-1 border rounded-xl px-3 py-2.5 text-xs focus:outline-none ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-300 text-zinc-800'
                        }`} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowMap(!showMap)}
                        className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-500 px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition flex-shrink-0"
                      >
                        <MapPin className="w-4 h-4" />
                        <span className="hidden sm:inline">{showMap ? 'Cerrar' : 'Pin'} Mapa</span>
                        <span className="sm:hidden">📍</span>
                      </button>
                    </div>
                    {showMap && (
                      <div className={`mt-3 p-3 border border-amber-500/30 rounded-2xl ${
                        isDark ? 'bg-zinc-950' : 'bg-zinc-50'
                      }`}>
                        <GoogleMapPicker
                          initialLat={formData.address_lat}
                          initialLng={formData.address_lng}
                          initialAddress={formData.address}
                          onSaveLocation={handleLocationSave}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Correo Electrónico</label>
                <div className="relative">
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    value={formData.email} 
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    className={`w-full border rounded-xl px-3 py-2.5 pl-9 text-base sm:text-sm focus:outline-none focus:border-orange-500 ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`} 
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Contraseña</label>
                <div className="relative">
                  <input 
                    type="password" 
                    name="password" 
                    required 
                    value={formData.password} 
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full border rounded-xl px-3 py-2.5 pl-9 text-base sm:text-sm focus:outline-none focus:border-orange-500 ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`} 
                  />
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                </div>
              </div>
            </form>
          </div>

          {/* Footer Submit Button */}
          <div className={`p-4 sm:p-5 border-t flex-shrink-0 ${
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <button 
              type="submit" 
              form="auth-form"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-orange-600/30 transition active:scale-95 text-xs sm:text-sm min-h-[48px]"
            >
              {loading ? 'Procesando...' : (tab === 'login' ? 'Ingresar a mi Cuenta' : 'Crear Cuenta y Continuar')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
