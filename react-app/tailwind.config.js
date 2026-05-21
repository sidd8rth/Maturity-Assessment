/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        airtel: {
          red: '#d40000',
          'red-hover': '#a50000',
          'red-light': 'rgba(212,0,0,0.06)',
          'red-ring': 'rgba(212,0,0,0.20)',
          navy: '#101418',
          'navy-hover': '#394556',
        },
        bg: {
          DEFAULT: '#f3f4f7',
          card: '#ffffff',
          secondary: '#f5f5f5',
        },
        border: {
          DEFAULT: '#dadfe7',
          red: 'rgba(212,0,0,0.25)',
        },
        ink: {
          DEFAULT: '#141414',
          dark: '#000000',
          sub: '#474747',
          mute: '#666666',
          light: '#8f8f8f',
        },
      },
      fontFamily: {
        sans: ['"Airtel Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 2px 8px rgba(16,20,24,0.06)',
        md: '0 4px 20px rgba(16,20,24,0.08)',
        lg: '0 8px 40px rgba(16,20,24,0.10)',
      },
      maxWidth: {
        quiz: '1000px',
        results: '1440px',
      },
    },
  },
  plugins: [],
};
