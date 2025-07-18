module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4A90E2",
        success: "#7ED321",
        warning: "#F5A623",
        error: "#D0021B",
        purpleAccent: "#9013FE",
        bg: "#F8F9FA",
        textPrimary: "#2C3E50",
        textSecondary: "#7F8C8D",
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
      },
    },
  },
  plugins: [],
};
