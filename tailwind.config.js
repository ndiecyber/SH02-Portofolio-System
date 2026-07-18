/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zinc: {
          925: '#111113',
          950: '#09090b',
        },
        dark: {
          bg:      '#09090b',
          surface: '#111113',
          card:    '#18181b',
          elevated:'#27272a',
          border:  '#3f3f46',
          text:    '#fafafa',
          muted:   '#a1a1aa',
          subtle:  '#71717a',
        },
        brand: {
          indigo:  '#6366f1',
          violet:  '#8b5cf6',
          blue:    '#3b82f6',
          cyan:    '#06b6d4',
          navy:    '#0d1b3e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'dark-card':     'linear-gradient(145deg, #1c1c1f 0%, #18181b 100%)',
        'dark-sidebar':  'linear-gradient(180deg, #0d0d10 0%, #111113 100%)',
        'accent-glow':   'radial-gradient(ellipse at top, rgba(99,102,241,0.15), transparent 60%)',
      },
      boxShadow: {
        'dark-card':   '0 4px 12px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset',
        'dark-glow':   '0 0 20px rgba(99,102,241,0.25)',
        'dark-glow-sm':'0 0 8px rgba(99,102,241,0.2)',
      },
    },
  },
  plugins: [],
}
