/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- dark obsidian showroom (legacy, untouched) ---
        obsidian: '#050505',
        yuzu: '#CCFF00',
        silver: '#A1A1AA',
        glass: 'rgba(255,255,255,0.08)',

        // --- light-immersive redesign tokens (/redesign, .tapin-light) ---
        // Brand direction: Warm Sand × Pine.
        primary: '#2E1E16', // espresso — primary actions / type (warm black)
        accent: '#214335', // pine — the brand green accent
        honey: '#DDA84C', // spark — action / intelligence moments
        leaf: {
          DEFAULT: '#214335',
          deep: '#16301F',
        },
        pine: {
          DEFAULT: '#214335',
          deep: '#16301F',
        },
        sage: '#A9B89E',
        sand: '#F4E7D0',
        paper: '#F4E7D0',
        cream: '#FAF3E6',
        porcelain: '#FAF3E6',
        mist: '#EADFC8',
        ink: '#2E1E16',
        espresso: '#2E1E16',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        // redesign type pair
        display: ['"Clash Display"', '"Hanken Grotesk"', 'sans-serif'],
        grotesk: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
      }
    },
  },
  plugins: [],
}
