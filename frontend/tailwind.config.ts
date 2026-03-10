import type { Config } from 'tailwindcss'

export default {
  darkMode: ['selector', '.dark'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
