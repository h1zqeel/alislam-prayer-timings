module.exports = {
  darkMode: 'class', // or 'media' for system preference
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)'],
        mono: ['var(--font-geist-mono)'],
        nastaliq: ['var(--font-nastaliq)'],
      },
    },
    
  },
  plugins: [],
};
