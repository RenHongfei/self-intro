/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F8',
          100: '#FFE8EE',
          200: '#FFD0DD',
          300: '#FFA8BF',
          400: '#FF789D',
          500: '#FF6B9D',
          600: '#E85A8A',
          700: '#C44569',
          800: '#A33A58',
          900: '#8A334D'
        },
        cute: {
          pink: '#FFB6C1',
          lavender: '#E6E6FA',
          mint: '#98FB98',
          peach: '#FFDAB9',
          sky: '#87CEEB'
        }
      },
      fontFamily: {
        cute: ['Comic Sans MS', 'cursive', 'sans-serif']
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'heart-beat': 'heartBeat 0.6s ease-in-out'
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        sparkle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(1.2)' }
        },
        heartBeat: {
          '0%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.3)' },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      boxShadow: {
        'cute': '0 4px 14px 0 rgba(255, 107, 157, 0.39)',
        'cute-lg': '0 8px 24px 0 rgba(255, 107, 157, 0.45)'
      }
    }
  },
  plugins: []
}
