/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 60-30-10 palette.
        background: '#ffffff',
        surface: '#eeeeee',
        primary: {
          DEFAULT: '#422ad5',
          hover: '#3722b0',
        },
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        card: '0.75rem',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
