/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f6f5',
          100: '#cceceb',
          200: '#99d9d6',
          300: '#66c6c2',
          400: '#33b3ad',
          500: '#00a099',
          600: '#00807a',
          700: '#00605c',
          800: '#00403d',
          900: '#00201f',
        },
      },
    },
  },
  plugins: [],
};
