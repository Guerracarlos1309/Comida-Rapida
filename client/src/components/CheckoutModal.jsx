import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Phone,
  User,
  Send,
  CheckCircle2,
  AlertCircle,
  Edit3,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCurrency, EXCHANGE_RATES } from "../context/CurrencyContext";
import { useTheme } from "../context/ThemeContext";
import { useOrders, getSavedCustomerInfo, saveCustomerInfo } from "../context/OrdersContext";
import GoogleMapPicker from "./GoogleMapPicker";
import { BUSINESS } from "../App";

export default function CheckoutModal({ isOpen, onClose, onOrderSuccess }) {
  const { cart, subtotalUsd, clearCart } = useCart();
  const { user, setIsAuthModalOpen } = useAuth();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { isDark } = useTheme();
  const { addUserOrder } = useOrders();

  // Lock body scroll when checkout modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const deliveryFeeUsd = BUSINESS.delivery_fee_usd;
  const totalUsd = subtotalUsd + deliveryFeeUsd;

  const savedCustomer = getSavedCustomerInfo();

  const [customerName, setCustomerName] = useState(
    user ? `${user.first_name} ${user.last_name}` : savedCustomer?.customerName || "",
  );
  const [customerPhone, setCustomerPhone] = useState(user?.phone || savedCustomer?.customerPhone || "");
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || savedCustomer?.deliveryAddress || "");
  const [deliveryLat, setDeliveryLat] = useState(user?.address_lat || savedCustomer?.deliveryLat || 4.6097);
  const [deliveryLng, setDeliveryLng] = useState(user?.address_lng || savedCustomer?.deliveryLng || -74.0817);
  const [deliveryNotes, setDeliveryNotes] = useState(
    user?.address_details || savedCustomer?.deliveryNotes || "",
  );
  const [paymentMethod, setPaymentMethod] = useState(savedCustomer?.paymentMethod || "EFECTIVO");
  const [isEditingMap, setIsEditingMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setCustomerName((prev) => prev || `${user.first_name} ${user.last_name}`);
      setCustomerPhone((prev) => prev || user.phone || "");
      setDeliveryAddress((prev) => prev || user.address || "");
      if (user.address_lat) setDeliveryLat(user.address_lat);
      if (user.address_lng) setDeliveryLng(user.address_lng);
      setDeliveryNotes((prev) => prev || user.address_details || "");
    }
  }, [user]);

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
    setError("");
    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !deliveryAddress.trim()
    ) {
      setError("Complete los datos: Nombre, Teléfono y Dirección de entrega");
      return;
    }
    if (!cart || cart.length === 0) {
      setError("Tu carrito está vacío. Agrega al menos un producto.");
      return;
    }
    setLoading(true);

    const orderPayload = {
      business_id: BUSINESS?.id || 1,
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
      items: cart,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar el pedido");

      saveCustomerInfo({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        deliveryLat,
        deliveryLng,
        deliveryNotes: deliveryNotes.trim(),
        paymentMethod,
      });
      addUserOrder(data.order);
      clearCart();
      onOrderSuccess(data.order);
    } catch (err) {
      setError(
        err.message ||
          "No se pudo conectar con el servidor para enviar el pedido al administrador. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          className={`relative z-10 w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-300 ${
            isDark
              ? "bg-black border-zinc-800 text-white"
              : "bg-white border-zinc-200 text-zinc-900"
          }`}
        >
          {/* Top glowing bar */}
          <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 z-20" />

          {/* Header */}
          <div
            className={`p-4 sm:p-6 border-b flex-shrink-0 flex items-center justify-between relative ${
              isDark
                ? "bg-zinc-950 border-zinc-800"
                : "bg-zinc-50 border-zinc-200"
            }`}
          >
            <div>
              <h2
                className={`text-lg sm:text-2xl font-black flex items-center gap-2 ${isDark ? "text-white" : "text-zinc-900"}`}
              >
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0" />
                <span>Confirmar Pedido</span>
              </h2>
              <p
                className={`text-xs mt-0.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
              >
                {BUSINESS?.name || "Smash & Dog Club"}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition ${
                isDark
                  ? "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  : "text-zinc-600 hover:text-black hover:bg-zinc-200"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-5">
            {/* Login suggestion */}
            {!user && (
              <div
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isDark
                    ? "bg-orange-500/10 border-orange-500/30"
                    : "bg-orange-50 border-orange-200"
                }`}
              >
                <span
                  className={`text-xs ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                >
                  <strong className={isDark ? "text-white" : "text-zinc-900"}>
                    ¿Tienes cuenta?
                  </strong>{" "}
                  Inicia sesión para autocompletar dirección y teléfono.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsAuthModalOpen(true);
                  }}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs px-3.5 py-2 rounded-xl flex-shrink-0"
                >
                  Ingresar
                </button>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form
              id="checkout-form"
              onSubmit={handlePlaceOrder}
              className="space-y-5"
            >
              {/* Step 1: Customer */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-orange-500 tracking-wider">
                  1. Datos del Cliente
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      className={`block text-xs font-bold mb-1 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                    >
                      Nombre y Apellido *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ej. Carlos Mendoza"
                        className={`w-full border rounded-xl px-3 py-2.5 pl-9 text-base sm:text-sm focus:outline-none focus:border-orange-500 ${
                          isDark
                            ? "bg-zinc-900 border-zinc-800 text-white"
                            : "bg-zinc-50 border-zinc-300 text-zinc-900"
                        }`}
                      />
                      <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                    </div>
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold mb-1 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                    >
                      Teléfono WhatsApp *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+57 300 123 4567"
                        className={`w-full border rounded-xl px-3 py-2.5 pl-9 text-base sm:text-sm focus:outline-none focus:border-orange-500 ${
                          isDark
                            ? "bg-zinc-900 border-zinc-800 text-white"
                            : "bg-zinc-50 border-zinc-300 text-zinc-900"
                        }`}
                      />
                      <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Location */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-orange-500 tracking-wider">
                    2. Ubicación de Entrega (Google Maps)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditingMap(!isEditingMap)}
                    className="text-xs text-amber-500 hover:underline font-extrabold flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingMap ? "Cerrar Mapa" : "Pin Mapa"}</span>
                  </button>
                </div>

                {isEditingMap ? (
                  <div
                    className={`p-3 sm:p-4 border border-amber-500/40 rounded-2xl ${
                      isDark ? "bg-zinc-950" : "bg-zinc-50"
                    }`}
                  >
                    <GoogleMapPicker
                      initialLat={deliveryLat}
                      initialLng={deliveryLng}
                      initialAddress={deliveryAddress}
                      onSaveLocation={handleLocationSaved}
                    />
                  </div>
                ) : (
                  <div
                    className={`p-3 sm:p-4 border rounded-xl sm:rounded-2xl space-y-2.5 ${
                      isDark
                        ? "bg-zinc-900/90 border-zinc-800"
                        : "bg-zinc-50 border-zinc-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0 border border-orange-500/30 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <input
                          type="text"
                          required
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Escribe tu dirección exacta o usa Pin Mapa"
                          className={`w-full border rounded-xl px-3 py-2 text-base sm:text-xs font-bold focus:outline-none focus:border-orange-500 ${
                            isDark
                              ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500"
                              : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                          }`}
                        />
                        <input
                          type="text"
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          placeholder="Referencia (ej. Casa rejas blancas, piso 2) — opcional"
                          className={`w-full border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500 ${
                            isDark
                              ? "bg-zinc-950 border-zinc-800 text-zinc-300 placeholder-zinc-500"
                              : "bg-white border-zinc-300 text-zinc-700 placeholder-zinc-400"
                          }`}
                        />
                        <span className="text-[10px] text-amber-500 font-mono block">
                          GPS: {Number(deliveryLat || 0).toFixed(4)}, {Number(deliveryLng || 0).toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Payment */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-orange-500 tracking-wider">
                  3. Moneda y Método de Pago
                </h3>

                {/* Currency */}
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(EXCHANGE_RATES).map(([code, info]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCurrency(code)}
                      className={`p-2.5 rounded-xl border text-center transition min-h-[44px] ${
                        currency === code
                          ? "bg-gradient-to-r from-orange-600 to-amber-500 border-orange-400 text-white font-extrabold shadow-md"
                          : isDark
                            ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                            : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-black"
                      }`}
                    >
                      <span className="text-xs sm:text-sm block font-bold">
                        {info.flag} {code}
                      </span>
                      <span className="text-[10px] opacity-90">
                        {info.symbol}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Payment Method */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      id: "EFECTIVO",
                      label: "Efectivo",
                      desc: "Al repartidor",
                    },
                    {
                      id: "PAGO_MOVIL",
                      label: "Pago Móvil",
                      desc: "Transferencia",
                    },
                    {
                      id: "TRANSFERENCIA",
                      label: "Transferencia",
                      desc: "Banco Nacional",
                    },
                    { id: "ZELLE", label: "Zelle / USD", desc: "Pago Digital" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition min-h-[48px] ${
                        paymentMethod === m.id
                          ? "bg-amber-500/20 border-amber-500 text-amber-500 font-extrabold"
                          : isDark
                            ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                            : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-black"
                      }`}
                    >
                      <span className="block font-bold">{m.label}</span>
                      <span className="text-[10px] opacity-80">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div
                className={`p-3 sm:p-4 border rounded-xl sm:rounded-2xl text-xs space-y-1.5 ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800"
                    : "bg-zinc-50 border-zinc-200"
                }`}
              >
                <div
                  className={`flex justify-between ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
                >
                  <span>Subtotal:</span>
                  <span
                    className={`font-bold ${isDark ? "text-white" : "text-zinc-900"}`}
                  >
                    {formatPrice(subtotalUsd)}
                  </span>
                </div>
                <div
                  className={`flex justify-between ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
                >
                  <span>Delivery:</span>
                  <span
                    className={`font-bold ${isDark ? "text-white" : "text-zinc-900"}`}
                  >
                    {formatPrice(deliveryFeeUsd)}
                  </span>
                </div>
                <div
                  className={`pt-2 border-t flex justify-between text-sm font-black ${
                    isDark
                      ? "border-zinc-800 text-white"
                      : "border-zinc-200 text-zinc-900"
                  }`}
                >
                  <span>TOTAL EN {currency}:</span>
                  <span className="text-amber-500">
                    {formatPrice(totalUsd)}
                  </span>
                </div>
              </div>
            </form>
          </div>

          {/* Fixed Footer with Submit button */}
          <div
            className={`p-4 sm:p-5 border-t flex-shrink-0 ${
              isDark
                ? "bg-zinc-950 border-zinc-800"
                : "bg-zinc-50 border-zinc-200"
            }`}
          >
            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-orange-600/30 flex items-center justify-center gap-3 text-sm transition active:scale-95 min-h-[48px]"
            >
              <Send className="w-5 h-5 animate-pulse" />
              <span>
                {loading ? "ENVIANDO PEDIDO..." : "CONFIRMAR Y ENVIAR PEDIDO"}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
