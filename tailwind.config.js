/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        scroll: 'scroll 4s linear infinite',
        rotate: 'rotate 8s linear infinite',
        marquee: 'marqueeAnimation 20s linear infinite'
      },
      keyframes: {
        scroll: {
          'from': { position: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' },
        },
        rotate: {
          from: { transform: 'rotateZ(0deg)' },
          to: { transform: 'rotateZ(360deg)' }
        },
        marqueeAnimation: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      fontFamily: {
        'font-title': ['Poiret One', 'cursive']
      },
    },
  },
  plugins: [],
}
