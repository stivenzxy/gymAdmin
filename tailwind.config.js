/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      boxShadow: {
        'custom': '0.063rem 0 1.25rem 0 #8690a3'
      },
      spacing: {
        '23/25': '0.938rem',
      },
      minWidth: {
        '12': '3rem',  
        '2' : '3rem',
      },
      height: {
        'custom-calc': 'calc(100% - 3.65rem)',
      },
    },
  },
  plugins: [],
}