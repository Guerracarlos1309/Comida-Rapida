import React, { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { CurrencyProvider, useCurrency } from "./context/CurrencyContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { ShoppingBag } from "lucide-react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MenuSection from "./components/MenuSection";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import AuthModal from "./components/AuthModal";
import OrderTracker from "./components/OrderTracker";
import AdminDashboard from "./components/AdminDashboard";
import Footer from "./components/Footer";

// Single business config — each business will have its own independent page
export const BUSINESS = {
  id: 1,
  name: "Tavos Hot-Dogs",
  slug: "tavos-hot",
  tagline: "Los mejores Perros calientes del municipio Andrés Bello",
  description: "Especialistas en Perros calientes cargados con todo.",
  logo_url: "/images/burger_hero.png",
  banner_url: "/images/burger_hero.png",
  phone: "+58 424 784 2726",
  address: "Calle 100 #15-24, Zona Gourmet",
  rating: 4.9,
  delivery_fee_usd: 2.5,
};

function MainApp() {
  const { isDark } = useTheme();
  const { totalItemsCount, subtotalUsd, isCartOpen, setIsCartOpen } = useCart();
  const { formatPrice } = useCurrency();

  const [viewMode, setViewMode] = useState("menu"); // 'menu' or 'kitchen'
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTrackerOrder, setActiveTrackerOrder] = useState(null);

  const handleExploreMenu = () => {
    setViewMode("menu");
    const menuEl = document.getElementById("menu");
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOrderSuccess = (order) => {
    setIsCheckoutOpen(false);
    setActiveTrackerOrder(order);
  };

  return (
    <div
      style={isDark ? { backgroundColor: '#0e1628' } : { backgroundColor: '#eef4fb', color: '#0a1628' }}
      className={`min-h-screen flex flex-col justify-between selection:bg-sky-400 selection:text-white transition-colors duration-300 ${
        isDark ? "text-slate-100" : "text-[#0a1628]"
      }`}
    >
      {/* Navbar */}
      <Navbar viewMode={viewMode} setViewMode={setViewMode} />

      {/* Main Content */}
      <main className="flex-1">
        {viewMode === "menu" ? (
          <>
            <Hero onExploreMenu={handleExploreMenu} />
            <MenuSection />
          </>
        ) : (
          <AdminDashboard />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Bottom Cart Bar for Mobile Phones (only when no modal is active) */}
      {totalItemsCount > 0 &&
        viewMode === "menu" &&
        !isCartOpen &&
        !isCheckoutOpen &&
        !activeTrackerOrder && (
          <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 text-white font-black py-3.5 px-5 rounded-2xl shadow-2xl shadow-orange-600/40 flex items-center justify-between transition active:scale-95 border border-orange-300/40 min-h-[48px]"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white text-orange-600 rounded-full font-black text-xs flex items-center justify-center shadow">
                  {totalItemsCount}
                </div>
                <span className="text-xs uppercase tracking-wide flex items-center gap-1.5 font-extrabold">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ver Mi Pedido</span>
                </span>
              </div>
              <span className="text-sm font-black tracking-tight">
                {formatPrice(subtotalUsd)} →
              </span>
            </button>
          </div>
        )}

      {/* Global Modals & Drawers */}
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <AuthModal />

      <OrderTracker
        order={activeTrackerOrder}
        onClose={() => setActiveTrackerOrder(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
