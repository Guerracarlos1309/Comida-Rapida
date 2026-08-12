import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('fastfood_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem('fastfood_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, quantity = 1, selectedOptions = {}, extraPriceUsd = 0) => {
    const itemUnitPrice = Number(item.price_usd) + Number(extraPriceUsd);
    const cartItemId = `${item.id}-${JSON.stringify(selectedOptions)}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(i => i.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, {
        ...item,
        cartItemId,
        price_usd: itemUnitPrice,
        quantity,
        selectedOptions
      }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotalUsd = cart.reduce((sum, item) => sum + (item.price_usd * item.quantity), 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      subtotalUsd,
      totalItemsCount,
      activeOrder,
      setActiveOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
