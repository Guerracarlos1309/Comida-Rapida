import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, User, Send, CheckCircle2, AlertCircle, Edit3 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency, EXCHANGE_RATES } from '../context/CurrencyContext';
import GoogleMapPicker from './GoogleMapPicker';

export default function CheckoutModal({ activeBusiness, isOpen, onClose, onOrderSuccess }) {
  const { cart, subtotalUsd, clearCart } = useCart();
  const { user, setIsAuthModalOpen } = useAuth();
  const { currency, setCurrency, formatPrice } = useCurrency();

  const deliveryFeeUsd = activeBusiness?.delivery_fee_usd || 2.00;
  const totalUsd = subtotalUsd + deliveryFeeUsd;

  const [customerName, setCustomerName] = useState(user ? `${user.first_name} ${user.last_name}` : '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [deliveryLat, setDeliveryLat] = useState(user?.address_lat || 4.6097);
  const [deliveryLng, setDeliveryLng] = useState(user?.address_lng || -74.0817);
  const [deliveryNotes, setDeliveryNotes] = useState(user?.address_details || '');
  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO');
  const [isEditingMap, setIsEditingMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLocationSaved = (locData) => {
    setDeliveryAddress(locData.address);
    setDeliveryLat(locData.address_lat);
    setDeliveryLng(locData.address_lng);
    setDeliveryNotes(locData.address_details);
    setIsEditingMap(false);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setError('Complete los datos: Nombre, Teléfono y Dirección de entrega');
      return;
    }
    setLoading(true);

    const orderPayload = {
      business_id: activeBusiness?.id || 1,
      user_id: user ? user.id : null,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      delivery_address: deliveryAddress.trim(),
      delivery_lat: deliveryLat,
      delivery_lng: deliveryLng,
      delivery_notes: deliveryNotes.trim(),
      currency,
      payment_method: paymentMethod,
      subtotal_usd: subtotalUsd,
      delivery_fee_usd: deliveryFeeUsd,
      items: cart
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al procesar el pedido');
      clearCart();
      onOrderSuccess(data.order);
    } catch (err) {
      // Demo fallback
      const mockOrder = {
        id: Date.now(),
        order_code: 'CR-' + Math.floor(100000 + Math.random() * 900000),
        business_id: activeBusiness?.id || 1,
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        delivery_lat: deliveryLat,
        delivery_lng: deliveryLng,
        delivery_notes: deliveryNotes,
        currency,
        payment_method: paymentMethod,
        subtotal_usd: subtotalUsd,
        delivery_fee_usd: deliveryFeeUsd,
        total_usd: totalUsd,
        total_in_currency: totalUsd * (EXCHANGE_RATES[currency]?.rate || 1),
        items: cart,
        status: 'PENDIENTE',
        created_at: new Date().toISOString()
      };
      clearCart();
      onOrderSuccess(mockOrder);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          className="w-full sm:max-w-2xl bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-orange-950/50 relative overflow-hidden"
          style={{ maxHeight: '95vh', overflowY: 'auto' }}
        >
          {/* Top glowing bar */}
          <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-red-500" />

          {/* Drag Handle - mobile */}
          <div className="flex justify-center pt-3 pb-0 sm:hidden">
            <div className="w-10 h-1 bg-slate-600 rounded-full" />
          </div>

          <div className="p-4 sm:p-8">
            {/* Close */}
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition">
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                <span>Confirmar Pedido de Delivery</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">{activeBusiness?.name || 'Smash & Dog Club'}</p>
            </div>

            {/* Login suggestion */}
            {!user && (
              <div className="mb-5 p-3 sm:p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-300">
                  <strong className="text-white">¿Tienes cuenta?</strong> Inicia sesión para autocompletar dirección y teléfono.
                </span>
                <button
                  type="button"
                  onClick={() => { onClose(); setIsAuthModalOpen(true); }}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex-shrink-0"
                >
                  Ingresar
                </button>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-5">

              {/* Step 1: Customer */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-orange-400 tracking-wider">1. Datos del Cliente</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre y Apellido *</label>
                    <div className="relative">
                      <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ej. Carlos Mendoza"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-sm text-white focus:outline-none focus:border-orange-500" />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono WhatsApp *</label>
                    <div className="relative">
                      <input type="tel" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+57 300 123 4567"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-sm text-white focus:outline-none focus:border-orange-500" />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Location */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-orange-400 tracking-wider">2. Ubicación de Entrega (Google Maps)</h3>
                  <button type="button" onClick={() => setIsEditingMap(!isEditingMap)}
                    className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingMap ? 'Cerrar' : 'Pin Mapa'}</span>
                  </button>
                </div>

                {isEditingMap ? (
                  <div className="p-3 sm:p-4 bg-slate-950 border border-amber-500/40 rounded-2xl">
                    <GoogleMapPicker
                      initialLat={deliveryLat}
                      initialLng={deliveryLng}
                      initialAddress={deliveryAddress}
                      onSaveLocation={handleLocationSaved}
                    />
                  </div>
                ) : (
                  <div className="p-3 sm:p-4 bg-slate-950/90 border border-slate-800 rounded-xl sm:rounded-2xl flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center flex-shrink-0 border border-orange-500/30">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-white block break-words">
                        {deliveryAddress || 'Haga clic en Pin Mapa para marcar su casa'}
                      </span>
                      {deliveryNotes && <span className="text-[11px] text-slate-400 block mt-0.5">Ref: {deliveryNotes}</span>}
                      <span className="text-[10px] text-amber-400 font-mono mt-0.5 block">
                        GPS: {deliveryLat.toFixed(4)}, {deliveryLng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Payment */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-orange-400 tracking-wider">3. Moneda y Método de Pago</h3>

                {/* Currency */}
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(EXCHANGE_RATES).map(([code, info]) => (
                    <button key={code} type="button" onClick={() => setCurrency(code)}
                      className={`p-2 sm:p-3 rounded-xl border text-center transition ${
                        currency === code
                          ? 'bg-gradient-to-r from-orange-600 to-amber-500 border-orange-400 text-white font-extrabold shadow-lg'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}>
                      <span className="text-sm block">{info.flag} {code}</span>
                      <span className="text-[10px] opacity-90">{info.symbol}</span>
                    </button>
                  ))}
                </div>

                {/* Payment Method */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'EFECTIVO', label: 'Efectivo', desc: 'Al repartidor' },
                    { id: 'PAGO_MOVIL', label: 'Pago Móvil', desc: 'Transferencia' },
                    { id: 'TRANSFERENCIA', label: 'Transferencia', desc: 'Banco Nacional' },
                    { id: 'ZELLE', label: 'Zelle / USD', desc: 'Pago Digital' }
                  ].map((m) => (
                    <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition ${
                        paymentMethod === m.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}>
                      <span className="block font-bold">{m.label}</span>
                      <span className="text-[10px] opacity-75">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="p-3 sm:p-4 bg-slate-950 border border-slate-800 rounded-xl sm:rounded-2xl text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="text-white font-bold">{formatPrice(subtotalUsd)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery:</span>
                  <span className="text-white font-bold">{formatPrice(deliveryFeeUsd)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-white">
                  <span>TOTAL EN {currency}:</span>
                  <span className="text-amber-400">{formatPrice(totalUsd)}</span>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-orange-600/30 flex items-center justify-center gap-3 text-sm transition">
                <Send className="w-5 h-5 animate-pulse" />
                <span>{loading ? 'ENVIANDO PEDIDO...' : 'CONFIRMAR Y ENVIAR PEDIDO'}</span>
              </button>

            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
