/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      paper: '#f5f1dc',
      ink: '#191d19',
      sand: '#e6d9b6',
      navy: '#465779',
      fern: '#568b78',
      clay: '#b77956',
      ochre: '#c6a34d',
      error: '#a43828',
      white: '#fffdf3',
    },
    fontFamily: {
      sans: ['Oswald', 'Arial Narrow', 'sans-serif'],
      body: ['Arial', 'sans-serif'],
    },
    extend: {
      backgroundImage: { paper: "url('/art/paper.webp')" },
      boxShadow: { stamp: '2px 2px 0 #191d19' },
      screens: { desktop: '1100px' },
    },
  },
  plugins: [],
};
