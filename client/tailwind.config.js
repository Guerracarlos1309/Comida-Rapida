/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF5722',
          red: '#E53935',
          gold: '#FFC107',
          dark: '#0F0F12',
          card: '#18181F',
          cardHover: '#22222B',
          accent: '#FF9800',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 25px -5px rgba(255, 87, 34, 0.4)',
        'glow-gold': '0 0 25px -5px rgba(255, 193, 7, 0.4)',
        'glow-green': '0 0 25px -5px rgba(76, 175, 80, 0.4)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 10px rgba(255,193,7,0.6))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 25px rgba(255,87,34,0.9))' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
