import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fastfood_token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('fastfood_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('fastfood_user');
      }
    }
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('fastfood_user', JSON.stringify(userData));
    localStorage.setItem('fastfood_token', userToken);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fastfood_user');
    localStorage.removeItem('fastfood_token');
  };

  const updateUserProfile = async (profileData) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('fastfood_user', JSON.stringify(data.user));
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error };
    } catch (err) {
      // Local update fallback if offline
      const updated = { ...user, ...profileData };
      setUser(updated);
      localStorage.setItem('fastfood_user', JSON.stringify(updated));
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      updateUserProfile,
      isAuthModalOpen,
      setIsAuthModalOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
