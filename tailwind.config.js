/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#b3ccff',
          300: '#80aaff',
          400: '#4d80ff',
          500: '#2a5cff',
          600: '#1a41e0',
          700: '#1533af',
          800: '#132a89',
          900: '#12266f'
        }
      }
    }
  },
  plugins: []
}
