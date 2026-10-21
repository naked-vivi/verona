/** @type {import('tailwindcss').Config} */

// * Colors are CSS variables from src/index.css, so both themes share class names
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    fontFamily: {
      sans: ['Jost', 'Helvetica Neue', 'Arial', 'sans-serif'],
      display: ['Italiana', 'Didot', 'Georgia', 'serif'],
    },

    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        subtle: token('subtle'),
        line: token('line'),
        ink: token('ink'),
        muted: token('muted'),
        accent: {
          DEFAULT: token('accent'),
          hover: token('accent-hover'),
          ink: token('accent-ink'),
        },
        bar: {
          DEFAULT: token('bar'),
          ink: token('bar-ink'),
        },
        success: {
          DEFAULT: token('success'),
          ink: token('success-ink'),
        },
        danger: {
          DEFAULT: token('danger'),
          soft: token('danger-soft'),
        },
      },
      fontSize: {
        huge: ['80rem', { lineHeight: '1' }],
      },
      height: {
        screen: '100dvh',
      },
    },
  },
  plugins: [],
};
