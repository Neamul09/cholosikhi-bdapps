import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'Anek Bangla', 'sans-serif'],
        bangla: ['Anek Bangla', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          500: '#58cc02', // Duo Green
          600: '#58a700', // Green Shadow
        },
        duo: {
          green: '#58cc02',
          red: '#ff4b4b',
          blue: '#1cb0f6',
          gold: '#ffc800',
          yellow: '#ffdc00',
          gray: '#e5e5e5',
        },
        border: {
          DEFAULT: 'var(--border-subtle)'
        }
      },
      backgroundColor: {
        app: 'var(--app-bg)',
        panel: 'var(--duo-card-bg)',
      },
      textColor: {
        app: 'var(--app-fg)',
      },
      borderColor: {
        subtle: 'var(--border-subtle)',
      },
      animation: {
        'bounce-in':  'bounceIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        'slide-up':   'slideUp 0.3s ease-out',
      },
      keyframes: {
        bounceIn: { '0%': { opacity: '0', transform: 'scale(0.8)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        slideUp:  { '0%': { opacity: '0', transform: 'translateY(100%)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
} satisfies Config
