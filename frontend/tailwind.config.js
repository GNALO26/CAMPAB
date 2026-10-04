/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B2942',
          deep: '#071A2C',
          mid: '#123F5E',
          light: '#1F5578',
        },
        olive: {
          DEFAULT: '#5A8F32',
          light: '#6EA83E',
          dark: '#4A7529',
        },
        sky: {
          DEFAULT: '#DCECF4',
          deep: '#C5DCE8',
        },
        ivory: '#F8FAF9',
        ink: {
          DEFAULT: '#17212B',
          soft: '#5D6872',
          mute: '#8B959F',
        },
        line: {
          DEFAULT: '#D8E0E4',
          strong: '#B8C4CB',
        },
        /* Palette sombre inspirée de Facebook */
        fb: {
          bg: '#18191A',
          surface: '#242526',
          elevated: '#3A3B3C',
          border: '#3E4042',
          text: '#E4E6EB',
          muted: '#B0B3B8',
          accent: '#2D88FF',
          'accent-hover': '#4A9EFF',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '12px',
        'card-sm': '8px',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(11, 41, 66, 0.06)',
        card: '0 8px 24px rgba(11, 41, 66, 0.08)',
        hover: '0 16px 48px rgba(11, 41, 66, 0.12)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.5)' },
          '50%': { boxShadow: '0 0 0 6px rgba(34, 197, 94, 0)' },
        },
        cursorBlink: {
          '50%': { borderColor: 'transparent' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 0.7s ease-out forwards',
        marquee: 'marquee 28s linear infinite',
        'pulse-green': 'pulseGreen 2s ease infinite',
        'cursor-blink': 'cursorBlink 0.85s step-end infinite',
      },
    },
  },
  plugins: [],
};