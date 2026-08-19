/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#08090A',
          900: '#0B0D0E',
          800: '#101314',
          700: '#181C1D',
          600: '#242928',
        },
        paper: {
          100: '#F3F4F1',
          300: '#C9CDC8',
          500: '#8A9290',
        },
        mint: {
          400: '#5FE3A4',
          500: '#3FCB8C',
        },
        ice: {
          400: '#8FCBE0',
        },
        violet: {
          400: '#A895D9',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
    },
  },
  plugins: [],
}
