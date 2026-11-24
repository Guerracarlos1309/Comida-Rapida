import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

/**
 * Builds a deterministic cart item key from product ID, selected options, and custom notes.
 * Ensures identical configurations merge while any single difference stays separate.
 */
export function buildCartItemId(itemId, selectedOptions = {}, instructions = '') {
  const normalizedOptions = {};
  Object.keys(selectedOptions || {})
    .sort()
    .forEach((key) => {
      const val = selectedOptions[key];
      normalizedOptions[key] = Array.isArray(val) ? [...val].sort() : val;
    });
  const trimmedNotes = (instructions || '').trim();
  return `${itemId}-${JSON.stringify(normalizedOptions)}-${trimmedNotes}`;
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('fastfood_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem('fastfood_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, quantity = 1, selectedOptions = {}, extraPriceUsd = 0, instructions = '', openDrawer = true) => {
    const basePriceUsd = Number(item.base_price_usd ?? item.price_usd);
    const itemUnitPrice = basePriceUsd + Number(extraPriceUsd);
    const trimmedNotes = (instructions || '').trim();
    const cartItemId = buildCartItemId(item.id, selectedOptions, trimmedNotes);

    setCart(prev => {
      const existingIndex = prev.findIndex(i => i.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }
      return [...prev, {
        ...item,
        base_price_usd: basePriceUsd,
        cartItemId,
        price_usd: itemUnitPrice,
        quantity,
        selectedOptions,
        instructions: trimmedNotes
      }];
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const updateCartItem = (oldCartItemId, item, quantity = 1, selectedOptions = {}, extraPriceUsd = 0, instructions = '') => {
    const basePriceUsd = Number(item.base_price_usd ?? item.price_usd);
    const itemUnitPrice = basePriceUsd + Number(extraPriceUsd);
    const trimmedNotes = (instructions || '').trim();
    const newCartItemId = buildCartItemId(item.id, selectedOptions, trimmedNotes);

    setCart(prev => {
      const filtered = prev.filter(i => i.cartItemId !== oldCartItemId);
      const existingIndex = filtered.findIndex(i => i.cartItemId === newCartItemId);
      if (existingIndex > -1) {
        const updated = [...filtered];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }
      const originalIndex = prev.findIndex(i => i.cartItemId === oldCartItemId);
      const newEntry = {
        ...item,
        base_price_usd: basePriceUsd,
        cartItemId: newCartItemId,
        price_usd: itemUnitPrice,
        quantity,
        selectedOptions,
        instructions: trimmedNotes
      };
      if (originalIndex >= 0 && originalIndex <= filtered.length) {
        const copy = [...filtered];
        copy.splice(originalIndex, 0, newEntry);
        return copy;
      }
      return [...filtered, newEntry];
    });
    setIsCartOpen(true);
  };

  const loadOrderIntoCart = (orderItems = []) => {
    if (!Array.isArray(orderItems) || orderItems.length === 0) return;
    const restored = orderItems.map((it) => {
      const trimmedNotes = (it.instructions || '').trim();
      const cartItemId = it.cartItemId || buildCartItemId(it.id, it.selectedOptions || {}, trimmedNotes);
      return {
        ...it,
        base_price_usd: Number(it.base_price_usd ?? it.price_usd),
        cartItemId,
        instructions: trimmedNotes,
        quantity: Number(it.quantity) || 1
      };
    });
    setCart(restored);
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
      updateCartItem,
      loadOrderIntoCart,
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
