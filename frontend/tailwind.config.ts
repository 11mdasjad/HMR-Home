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
          light: "#1e293b",
          DEFAULT: "#0f172a",
          dark: "#020617",
          soft: "#f8fafc",
        },
        secondary: {
          light: "#eff6ff",
          DEFAULT: "#2563eb",
          dark: "#1d4ed8",
        },
        accent: {
          light: "#dbeafe",
          DEFAULT: "#2563eb",
          dark: "#1d4ed8",
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
