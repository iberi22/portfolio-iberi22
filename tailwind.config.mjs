/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,svelte,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0a0a0f',
          100: '#0d0d14',
          200: '#111120',
          300: '#161628',
          400: '#1a1a30',
        },
        neon: {
          green: '#00ff88',
          blue: '#0066ff',
          purple: '#7c3aed',
          cyan: '#00e5ff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.8s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.8s ease-out forwards',
        'border-glow': 'border-glow 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 136, 0.35)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-60px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(60px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: 'rgba(0, 255, 136, 0.3)' },
          '50%': { borderColor: 'rgba(0, 102, 255, 0.5)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundSize: {
        '300%': '300% 300%',
      },
    },
  },
  plugins: [],
};
