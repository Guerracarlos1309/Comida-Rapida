/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tavo's Hot Dog brand palette
        tavo: {
          navy:    '#0e1628',  // Logo background (dark)
          navy2:   '#131d34',  // Card surface
          navy3:   '#1a2545',  // Hover surface
          border:  '#1e2d54',  // Borders
          blue:    '#00cfff',  // Electric blue accent (logo ring)
          yellow:  '#ffd000',  // Hot dog yellow (logo)
          pink:    '#ff2d6b',  // Neon pink (logo ring)
        },
        brand: {
          orange: '#FF5722',
          red: '#E53935',
          gold: '#FFC107',
          dark: '#0e1628',
          card: '#131d34',
          cardHover: '#1a2545',
          accent: '#00cfff',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue':   '0 0 25px -5px rgba(0, 207, 255, 0.45)',
        'glow-yellow': '0 0 25px -5px rgba(255, 208, 0, 0.45)',
        'glow-pink':   '0 0 25px -5px rgba(255, 45, 107, 0.45)',
        'glow-orange': '0 0 25px -5px rgba(255, 87, 34, 0.4)',
        'glow-gold':   '0 0 25px -5px rgba(255, 193, 7, 0.4)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'spin-slow': 'spin 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 10px rgba(0,207,255,0.6))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 25px rgba(0,207,255,0.9))' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
