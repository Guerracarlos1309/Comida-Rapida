import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const EXCHANGE_RATES = {
  USD: { symbol: '$', rate: 1, label: 'Dólares (USD)', flag: '🇺🇸' },
  COP: { symbol: 'COP $', rate: 4000, label: 'Pesos Colombianos (COP)', flag: '🇨🇴' },
  VES: { symbol: 'Bs.', rate: 40, label: 'Bolívares (VES)', flag: '🇻🇪' }
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');

  const formatPrice = (amountUsd) => {
    const numericUsd = Number(amountUsd) || 0;
    const info = EXCHANGE_RATES[currency] || EXCHANGE_RATES.USD;
    const total = numericUsd * info.rate;

    if (currency === 'COP') {
      return `${info.symbol} ${Math.round(total).toLocaleString('es-CO')}`;
    } else if (currency === 'VES') {
      return `${info.symbol} ${total.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${info.symbol}${numericUsd.toFixed(2)}`;
  };

  const getEquivalentText = (amountUsd) => {
    const numericUsd = Number(amountUsd) || 0;
    const cop = (numericUsd * EXCHANGE_RATES.COP.rate).toLocaleString('es-CO');
    const ves = (numericUsd * EXCHANGE_RATES.VES.rate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `~$${numericUsd.toFixed(2)} USD | COP $${cop} | Bs. ${ves}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, getEquivalentText, EXCHANGE_RATES }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
