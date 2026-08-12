import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BusinessSelector from './components/BusinessSelector';
import MenuSection from './components/MenuSection';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import OrderTracker from './components/OrderTracker';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

function MainApp() {
  const [businesses, setBusinesses] = useState([
    {
      id: 1,
      name: 'Smash & Dog Gourmet',
      slug: 'smash-dog',
      tagline: 'Las mejores Hamburguesas Smash y Perros Calientes Artesanales',
      description: 'Especialistas en hamburguesas doble carne smash con queso fundido y perros calientes venezolanos/colombianos cargados con todo.',
      logo_url: '/images/burger_hero.png',
      banner_url: '/images/burger_hero.png',
      phone: '+57 300 123 4567',
      address: 'Calle 100 #15-24, Zona Gourmet',
      rating: 4.9,
      delivery_fee_usd: 2.50
    },
    {
      id: 2,
      name: 'El Rey del Perro Caliente',
      slug: 'el-rey-del-perro',
      tagline: 'Perros Calientes Gigantes y Salvajes',
      description: 'Perros calientes especiales con salchicha suiza, tocineta ahumada, queso fundido, papa fosforito y huevo de codorniz.',
      logo_url: '/images/hotdog_hero.png',
      banner_url: '/images/hotdog_hero.png',
      phone: '+58 414 123 4567',
      address: 'Av. Principal Las Mercedes, Edif. Fast Food',
      rating: 4.8,
      delivery_fee_usd: 2.00
    },
    {
      id: 3,
      name: 'Urban Smash Burger',
      slug: 'urban-smash',
      tagline: 'Hamburguesas Urbanas y Papas Cargadas',
      description: 'Hamburguesas con carne madurada, queso cheddar derretido, tocino crujiente y cebolla caramelizada.',
      logo_url: '/images/combo_hero.png',
      banner_url: '/images/combo_hero.png',
      phone: '+1 305 123 4567',
      address: '777 Brickell Ave, Miami, FL',
      rating: 5.0,
      delivery_fee_usd: 3.00
    }
  ]);

  const [activeBusiness, setActiveBusiness] = useState(businesses[0]);
  const [viewMode, setViewMode] = useState('menu'); // 'menu' or 'kitchen'
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTrackerOrder, setActiveTrackerOrder] = useState(null);

  useEffect(() => {
    // Fetch businesses from API if available
    fetch('/api/businesses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBusinesses(data);
          setActiveBusiness(data[0]);
        }
      })
      .catch(err => console.log('Usando datos de negocios iniciales'));
  }, []);

  const handleExploreMenu = () => {
    setViewMode('menu');
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderSuccess = (order) => {
    setIsCheckoutOpen(false);
    setActiveTrackerOrder(order);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      
      {/* Navbar */}
      <Navbar
        activeBusiness={activeBusiness}
        businesses={businesses}
        onSelectBusiness={setActiveBusiness}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Main Content */}
      <main className="flex-1">
        {viewMode === 'menu' ? (
          <>
            <Hero
              activeBusiness={activeBusiness}
              onExploreMenu={handleExploreMenu}
            />

            <BusinessSelector
              businesses={businesses}
              activeBusiness={activeBusiness}
              onSelectBusiness={setActiveBusiness}
            />

            <MenuSection
              activeBusiness={activeBusiness}
            />
          </>
        ) : (
          <AdminDashboard
            activeBusiness={activeBusiness}
          />
        )}
      </main>

      {/* Footer */}
      <Footer activeBusiness={activeBusiness} />

      {/* Global Modals & Drawers */}
      <CartDrawer
        activeBusiness={activeBusiness}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        activeBusiness={activeBusiness}
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
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}
