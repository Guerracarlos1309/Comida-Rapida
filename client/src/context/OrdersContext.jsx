import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { playOrderAlertSound } from '../utils/notificationSound';

const OrdersContext = createContext();

const MY_ORDERS_STORAGE_KEY = 'fastfood_my_orders';
const LAST_CUSTOMER_STORAGE_KEY = 'fastfood_last_customer';

function mergeOrdersUnique(list) {
  const map = new Map();
  list.forEach((order) => {
    if (!order) return;
    const key = order.order_code || String(order.id);
    if (!map.has(key)) {
      map.set(key, order);
    } else {
      map.set(key, { ...map.get(key), ...order });
    }
  });
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
}

export const OrdersProvider = ({ children }) => {
  const { user } = useAuth();

  const [myOrders, setMyOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(MY_ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);

  // Admin real-time alert states
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminLoading, setAdminLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [browserNotifyPermission, setBrowserNotifyPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const myOrdersRef = useRef(myOrders);
  useEffect(() => {
    myOrdersRef.current = myOrders;
    try {
      localStorage.setItem(MY_ORDERS_STORAGE_KEY, JSON.stringify(myOrders.slice(0, 50)));
    } catch {
      // Ignore storage quota errors
    }
  }, [myOrders]);

  const addUserOrder = useCallback((order) => {
    if (!order) return;
    setMyOrders((prev) => mergeOrdersUnique([order, ...prev]));
  }, []);

  const refreshMyOrders = useCallback(async () => {
    try {
      if (user?.id) {
        const res = await fetch(`/api/orders?user_id=${encodeURIComponent(user.id)}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setMyOrders((prev) => mergeOrdersUnique([...data, ...prev]));
          return;
        }
      }

      const codes = myOrdersRef.current.map((o) => o.order_code).filter(Boolean);
      if (codes.length === 0) return;

      const res = await fetch(`/api/orders?codes=${encodeURIComponent(codes.join(','))}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMyOrders((prev) => mergeOrdersUnique([...data, ...prev]));
      }
    } catch (err) {
      console.error('Error actualizando mis pedidos:', err);
    }
  }, [user?.id]);

  const fetchAdminOrders = useCallback(async () => {
    setAdminLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (Array.isArray(data)) {
        setAdminOrders(mergeOrdersUnique(data));
      }
    } catch (err) {
      console.error('Error cargando pedidos admin:', err);
    } finally {
      setAdminLoading(false);
    }
  }, []);

  const requestBrowserNotificationPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setBrowserNotifyPermission('unsupported');
      return 'unsupported';
    }
    try {
      const perm = await Notification.requestPermission();
      setBrowserNotifyPermission(perm);
      return perm;
    } catch {
      return Notification.permission;
    }
  }, []);

  const dismissAlert = useCallback((alertId) => {
    setRecentAlerts((prev) => prev.filter((a) => a.alertId !== alertId));
  }, []);

  const clearAlerts = useCallback(() => {
    setRecentAlerts([]);
  }, []);

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error actualizando estado');
    }
    setAdminOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    setMyOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    return data.order;
  }, []);

  const repeatOrderIdentical = useCallback(async (sourceOrder) => {
    const payload = {
      business_id: sourceOrder.business_id || 1,
      user_id: user ? user.id : sourceOrder.user_id || null,
      customer_name: sourceOrder.customer_name,
      customer_phone: sourceOrder.customer_phone,
      delivery_address: sourceOrder.delivery_address,
      delivery_lat: sourceOrder.delivery_lat,
      delivery_lng: sourceOrder.delivery_lng,
      delivery_notes: sourceOrder.delivery_notes || '',
      currency: sourceOrder.currency || 'USD',
      payment_method: sourceOrder.payment_method || 'EFECTIVO',
      subtotal_usd: Number(sourceOrder.subtotal_usd) || 0,
      delivery_fee_usd: Number(sourceOrder.delivery_fee_usd) ?? 2.5,
      items: sourceOrder.items || [],
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'No se pudo repetir el pedido');
    }
    addUserOrder(data.order);
    return data.order;
  }, [user, addUserOrder]);

  // Global Socket.io connection + polling fallback for real-time order alerts & status tracking
  useEffect(() => {
    fetchAdminOrders();
    refreshMyOrders();

    const socket = io('/');

    socket.on('new_order', (newOrder) => {
      if (!newOrder) return;

      setAdminOrders((prev) => mergeOrdersUnique([newOrder, ...prev]));

      const alertEntry = {
        alertId: `${newOrder.order_code || newOrder.id}-${Date.now()}`,
        order: newOrder,
        receivedAt: Date.now(),
      };
      setRecentAlerts((prev) => [alertEntry, ...prev].slice(0, 5));

      if (soundEnabledRef.current) {
        playOrderAlertSound();
      }

      if (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        try {
          const itemsSummary = Array.isArray(newOrder.items)
            ? newOrder.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')
            : 'Nuevo pedido';
          new Notification(`🍔 Nuevo Pedido #${newOrder.order_code}`, {
            body: `${newOrder.customer_name} • ${itemsSummary}`,
            tag: `order-${newOrder.order_code}`,
          });
        } catch {
          // Ignore browser notification errors
        }
      }
    });

    socket.on('order_status_updated', ({ id, status, order: updatedOrder }) => {
      const targetCode = updatedOrder?.order_code;
      const patch = (list) =>
        list.map((o) =>
          String(o.id) === String(id) || (targetCode && o.order_code === targetCode)
            ? { ...o, status }
            : o
        );
      setAdminOrders(patch);
      setMyOrders(patch);
    });

    const interval = setInterval(() => {
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setAdminOrders(mergeOrdersUnique(data));
            // Also keep user's tracked orders fresh in real time
            const byCode = new Map(data.map((o) => [o.order_code, o]));
            setMyOrders((prev) =>
              prev.map((o) => (byCode.has(o.order_code) ? { ...o, ...byCode.get(o.order_code) } : o))
            );
          }
        })
        .catch(() => {});
    }, 5000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [fetchAdminOrders]);

  useEffect(() => {
    if (user?.id) {
      refreshMyOrders();
    }
  }, [user?.id]);

  const pendingOrdersCount = adminOrders.filter((o) => o.status === 'PENDIENTE').length;
  const activeUserOrdersCount = myOrders.filter(
    (o) => !['ENTREGADO', 'CANCELADO'].includes(o.status)
  ).length;

  return (
    <OrdersContext.Provider
      value={{
        myOrders,
        addUserOrder,
        refreshMyOrders,
        repeatOrderIdentical,
        isMyOrdersOpen,
        setIsMyOrdersOpen,
        activeUserOrdersCount,
        adminOrders,
        adminLoading,
        fetchAdminOrders,
        updateOrderStatus,
        pendingOrdersCount,
        soundEnabled,
        setSoundEnabled,
        recentAlerts,
        dismissAlert,
        clearAlerts,
        browserNotifyPermission,
        requestBrowserNotificationPermission,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);

export function getSavedCustomerInfo() {
  try {
    const raw = localStorage.getItem(LAST_CUSTOMER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCustomerInfo(info) {
  try {
    localStorage.setItem(LAST_CUSTOMER_STORAGE_KEY, JSON.stringify(info));
  } catch {
    // Ignore storage errors
  }
}
