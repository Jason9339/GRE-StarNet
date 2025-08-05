/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'storybook': ['Fredoka One', 'cursive'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // 繪本風格色彩系統
        story: {
          night: '#1e1b4b',     // 深夜藍
          twilight: '#3730a3',  // 黃昏紫
          star: '#fbbf24',      // 星星金
          aurora: '#a855f7',    // 極光紫
          dream: '#ec4899',     // 夢境粉
          ocean: '#0ea5e9',     // 海洋藍
          forest: '#10b981',    // 森林綠
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.1)',
        }
      },
      animation: {
        'twinkle-magic': 'twinkle-magic 3s ease-in-out infinite',
        'star-birth': 'star-birth 1.5s ease-out forwards',
        'constellation-connect': 'constellation-connect 2s ease-out forwards',
        'float-gentle': 'float-gentle 4s ease-in-out infinite',
        'card-entrance': 'card-entrance 0.6s ease-out forwards',
        'button-pulse': 'button-pulse 2s infinite',
        'typewriter': 'typewriter 3s steps(40) 1s both',
        'burst': 'burst 0.6s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'twinkle-magic': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '25%': { opacity: '0.8', transform: 'scale(1.1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
          '75%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        'star-birth': {
          '0%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '50%': { opacity: '0.8', transform: 'scale(1.3) rotate(180deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(360deg)' },
        },
        'constellation-connect': {
          '0%': { 'stroke-dasharray': '0, 100', opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { 'stroke-dasharray': '100, 0', opacity: '1' },
        },
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-5px) rotate(1deg)' },
          '50%': { transform: 'translateY(-8px) rotate(0deg)' },
          '75%': { transform: 'translateY(-3px) rotate(-1deg)' },
        },
        'card-entrance': {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'button-pulse': {
          '0%': { 'box-shadow': '0 0 0 0 rgba(139, 92, 246, 0.4)' },
          '70%': { 'box-shadow': '0 0 0 10px rgba(139, 92, 246, 0)' },
          '100%': { 'box-shadow': '0 0 0 0 rgba(139, 92, 246, 0)' },
        },
        'typewriter': {
          'from': { width: '0', 'border-right': '2px solid' },
          'to': { width: '100%', 'border-right': '2px solid transparent' },
        },
        'burst': {
          '0%': { opacity: '0', transform: 'translate(-50%, -50%) scale(0)' },
          '50%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1.5)' },
          '100%': { opacity: '0', transform: 'translate(-50%, -50%) scale(2)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'starfield': "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'star': '0 0 15px rgba(251, 191, 36, 0.5)',
        'magic': '0 10px 40px rgba(139, 92, 246, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [
    // 自定義插件
    function({ addUtilities }) {
      const newUtilities = {
        '.glass-effect': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
          'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        },
        '.glass-dark': {
          'background': 'rgba(0, 0, 0, 0.2)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.text-gradient': {
          'background': 'linear-gradient(45deg, #a855f7, #ec4899, #3b82f6)',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}