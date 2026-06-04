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
        // Primary + accent are the canonical brand roles for the new direction.
        primary: '#121212', // ink — primary actions / type
        accent: '#1FA85D', // fresh green — the brand accent
        leaf: {
          DEFAULT: '#1FA85D',
          deep: '#15633C',
        },
        pine: '#16412B',
        sage: '#AFC6A6',
        paper: '#F7F4EE',
        porcelain: '#EFEAE1',
        mist: '#D9D4CA',
        ink: '#121212',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        // redesign type pair
        display: ['"Clash Display"', '"Hanken Grotesk"', 'sans-serif'],
        grotesk: ['"General Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
      }
    },
  },
  plugins: [],
}
