import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Mail, Phone, MapPin, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleMapPicker from './GoogleMapPicker';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useAuth();
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
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          className="w-full sm:max-w-lg bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-orange-950/40 relative overflow-hidden"
          style={{ maxHeight: '95vh', overflowY: 'auto' }}
        >
          {/* Top glow */}
          <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-red-500" />
          
          {/* Drag Handle - mobile only */}
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="w-10 h-1 bg-slate-600 rounded-full" />
          </div>

          <div className="p-5 sm:p-8">
            {/* Close button */}
            <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition">
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 mb-3">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {tab === 'login' ? '¡Bienvenido de Nuevo!' : 'Crear Cuenta de Cliente'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Guarda tu dirección GPS y agiliza tus pedidos
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-950 p-1 rounded-2xl mb-5 border border-slate-800">
              <button onClick={() => { setTab('login'); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${tab === 'login' ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                <LogIn className="w-4 h-4" />
                <span>Iniciar Sesión</span>
              </button>
              <button onClick={() => { setTab('register'); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${tab === 'register' ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                <UserPlus className="w-4 h-4" />
                <span>Registrarse</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {tab === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre *</label>
                      <input type="text" name="first_name" required value={formData.first_name} onChange={handleChange}
                        placeholder="Juan" className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Apellido *</label>
                      <input type="text" name="last_name" required value={formData.last_name} onChange={handleChange}
                        placeholder="Pérez" className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono (WhatsApp)</label>
                    <div className="relative">
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                        placeholder="+57 300 1234567 o 0414-1234567"
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 pl-9 text-sm text-white focus:outline-none focus:border-orange-500" />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección de Casa (Google Maps)</label>
                    <div className="flex gap-2">
                      <input type="text" name="address" readOnly value={formData.address || ''}
                        placeholder="Haga clic en Pin Mapa →"
                        className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none" />
                      <button type="button" onClick={() => setShowMap(!showMap)}
                        className="bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition flex-shrink-0">
                        <MapPin className="w-4 h-4" />
                        <span className="hidden sm:inline">{showMap ? 'Cerrar' : 'Pin'} Mapa</span>
                        <span className="sm:hidden">📍</span>
                      </button>
                    </div>
                    {showMap && (
                      <div className="mt-3 p-3 bg-slate-950 border border-amber-500/30 rounded-2xl">
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
                <div className="relative">
                  <input type="email" name="email" required value={formData.email} onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 pl-9 text-sm text-white focus:outline-none focus:border-orange-500" />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
                <div className="relative">
                  <input type="password" name="password" required value={formData.password} onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 pl-9 text-sm text-white focus:outline-none focus:border-orange-500" />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-extrabold py-3.5 rounded-2xl shadow-xl shadow-orange-600/30 transition">
                {loading ? 'Procesando...' : (tab === 'login' ? 'Ingresar a mi Cuenta' : 'Crear Cuenta y Continuar')}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
