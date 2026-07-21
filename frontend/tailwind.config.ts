import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#ffffff",
          soft: "#f8fafc",
        },
        secondary: {
          light: "#e0f2fe",
          DEFAULT: "#0284c7",
          dark: "#0369a1",
        },
        accent: {
          light: "#d1fae5",
          DEFAULT: "#10b981",
          dark: "#059669",
        },
        warning: {
          light: "#ffedd5",
          DEFAULT: "#f97316",
          dark: "#ea580c",
        },
        danger: {
          light: "#fee2e2",
          DEFAULT: "#ef4444",
          dark: "#dc2626",
        },
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        }
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '16px', // Premium rounded
        '3xl': '1.5rem',
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 8px -1px rgba(0, 0, 0, 0.03)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
      }
    },
  },
  plugins: [],
};
export default config;
