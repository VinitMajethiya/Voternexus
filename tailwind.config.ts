import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          blue:    '#1A56DB',
          orange:  '#FF6B2C',
          green:   '#18A96F',
          amber:   '#F59E0B',
          red:     '#EF4444',
          muted:   '#64748B',
        },
        phase: {
          'pre-election':  '#1A56DB',
          'campaign':      '#F59E0B',
          'election-week': '#FF6B2C',
          'election-day':  '#18A96F',
          'post-election': '#64748B',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        'bento': '1.5rem',    // 24px — primary card radius
        'pill':  '9999px',
      },
    },
  },
  plugins: [],
};
export default config;
