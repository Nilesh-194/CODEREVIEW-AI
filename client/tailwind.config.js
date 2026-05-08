export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0B0F',
        surface: '#111318',
        surface2: '#181B24',
        border: '#1E2130',
        border2: '#252A3A',
        accent: '#00E5A0',
        accent2: '#0097FF',
        accent3: '#FF5C8D',
        accent4: '#FFB800',
        'text-primary': '#E8EAF0',
        'text-secondary': '#8B92A8',
        'text-dim': '#4A5068',
        'code-bg': '#0D1117',
        red: '#FF4560',
        green: '#00C47A',
        yellow: '#FFB800',
        purple: '#A855F7',
      },
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'count-up': 'countUp 1s ease-out forwards',
        'ring-fill': 'ringFill 1.2s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        countUp: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        ringFill: {
          from: { strokeDashoffset: 276 },
          to: { strokeDashoffset: 'var(--target-offset)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
