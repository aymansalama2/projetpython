/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Activer le mode sombre avec la classe 'dark'
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#e6f1ff',
          100: '#cce3ff',
          200: '#99c7ff',
          300: '#66aaff',
          400: '#338eff',
          500: '#0072ff',
          600: '#005bcc',
          700: '#004499',
          800: '#002d66',
          900: '#001733',
        },
        'secondary': {
          50: '#fffae6',
          100: '#fff5cc',
          200: '#ffeb99',
          300: '#ffe066',
          400: '#ffd633',
          500: '#ffcc00',
          600: '#cca300',
          700: '#997a00',
          800: '#665200',
          900: '#332900',
        },
      },
      boxShadow: {
        'card': '0 0 20px rgba(0, 0, 0, 0.05)',
        'card-dark': '0 0 20px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in-up': 'slideInUp 0.5s ease-out forwards',
        'pulse-subtle': 'pulse 2s infinite',
      },
    },
  },
  plugins: [],
} 