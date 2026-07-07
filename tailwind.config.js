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
        },
        // Palette du site vitrine (inspirée du template de référence EduSmart)
        teal: {
          50: '#eafaf6',
          100: '#d0f2e8',
          200: '#a3e6d3',
          300: '#6fd6ba',
          400: '#3cc39f',
          500: '#1bab8a',
          600: '#149179',
          700: '#127462',
          800: '#125d50',
          900: '#0f4c43'
        },
        coral: {
          50: '#fef1f1',
          100: '#fde0df',
          200: '#fbc5c3',
          300: '#f79c99',
          400: '#f16f6a',
          500: '#e94e48',
          600: '#d5352f',
          700: '#b22824',
          800: '#932522',
          900: '#7c2521'
        },
        sunshine: {
          50: '#fff9eb',
          100: '#fff0c6',
          200: '#ffe08a',
          300: '#ffcb4d',
          400: '#ffb821',
          500: '#f89b08',
          600: '#dc7503',
          700: '#b65307',
          800: '#94400c',
          900: '#7a350e'
        },
        violet: {
          50: '#f2f0ff',
          100: '#e6e2ff',
          200: '#d0c8ff',
          300: '#aea0ff',
          400: '#8b72ff',
          500: '#7048f5',
          600: '#5f34dc',
          700: '#4f29b4',
          800: '#412692',
          900: '#372275'
        },
        pastel: {
          mint: '#e7f7f1',
          rose: '#fdeaf0',
          cream: '#fff6e2',
          lavender: '#efecfe',
          sky: '#e8f3fc'
        },
        ink: '#161a20'
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' }
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(6deg)' }
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.5)' },
          '50%': { transform: 'scale(1.06)', boxShadow: '0 0 0 12px rgba(37, 211, 102, 0)' }
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'float-delay': 'float 5s ease-in-out 1.2s infinite',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
