/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3E276D',
          hover: '#311E57',
        },
        accent: {
          DEFAULT: '#8955F3',
          hover: '#7A4CE0',
        },
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        }
      },
      fontFamily: {
        sans: [
          'Walone',
          'Irrawaddy',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Helvetica',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'SF Mono',
          'Menlo',
          'Consolas',
          'Liberation Mono',
          'monospace',
        ],
      },
      boxShadow: {
        'sm': '0 1px 0 rgba(27,31,36,0.04)',
        'md': '0 3px 6px rgba(140,149,159,0.15)',
        'lg': '0 8px 24px rgba(140,149,159,0.2)',
        'xl': '0 12px 28px rgba(140,149,159,0.3)',
      }
    },
  },
  plugins: [],
}
