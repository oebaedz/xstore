import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#064E3B",
          dark: "#043027",
          mid: "#075a45",
          foreground: "#ffffff",
        },

        gold: {
          DEFAULT: "#EBD197",
        },

        accent: {
          green: "#00A000",
          "green-dark": "#008800",
        },

        surface: "#ffffff",
        muted: "#f9fafb",
        border: "rgba(0,0,0,0.1)",

        "text-muted": "rgba(255,255,255,0.6)",
      },

      borderRadius: {
        sm: "0.25rem", // konsisten, formal
      },

      boxShadow: {
        card: "0 20px 40px rgba(0,0,0,0.15)",
      },

      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["Outfit", "system-ui", "sans-serif"],
      },

      spacing: {
        section: "5rem", // py-section
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 25s linear infinite",
        "pulse-gold": "pulseGold 20s infinite",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(235,209,151,0.6)" },
          "50%": { boxShadow: "0 0 0 12px rgba(235,209,151,0)" },
        },
      },
    },
  },
  plugins:  [daisyui],
}

