/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  'oklch(0.97 0.01 45)',
          100: 'oklch(0.92 0.04 45)',
          200: 'oklch(0.84 0.08 45)',
          300: 'oklch(0.74 0.13 45)',
          400: 'oklch(0.63 0.16 45)',
          500: 'oklch(0.52 0.16 45)',
          600: 'oklch(0.44 0.15 45)',
          700: 'oklch(0.36 0.13 45)',
          800: 'oklch(0.28 0.10 45)',
          900: 'oklch(0.20 0.07 45)',
        },
        ink: {
          DEFAULT: 'oklch(0.14 0.008 250)',
          secondary: 'oklch(0.50 0.015 250)',
          muted: 'oklch(0.65 0.015 250)',
        },
        surface: {
          DEFAULT: '#ffffff',
          subtle: 'oklch(0.97 0.004 250)',
          border: 'oklch(0.91 0.006 250)',
          'border-hover': 'oklch(0.85 0.008 250)',
        },
        accent: {
          DEFAULT: 'oklch(0.48 0.14 235)',
          hover: 'oklch(0.40 0.12 235)',
          subtle: 'oklch(0.92 0.03 235)',
        },
        danger: {
          DEFAULT: 'oklch(0.48 0.18 30)',
          hover: 'oklch(0.40 0.16 30)',
          subtle: 'oklch(0.93 0.03 30)',
        },
        success: {
          DEFAULT: 'oklch(0.50 0.14 150)',
          hover: 'oklch(0.42 0.12 150)',
          subtle: 'oklch(0.93 0.03 150)',
        },
        warning: {
          DEFAULT: 'oklch(0.62 0.14 80)',
          hover: 'oklch(0.54 0.13 80)',
          subtle: 'oklch(0.94 0.03 80)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        xs: ['0.75rem', { lineHeight: '1.125rem' }],
        sm: ['0.8125rem', { lineHeight: '1.25rem' }],
        base: ['0.875rem', { lineHeight: '1.375rem' }],
        lg: ['1rem', { lineHeight: '1.5rem' }],
        xl: ['1.125rem', { lineHeight: '1.625rem' }],
        '2xl': ['1.375rem', { lineHeight: '1.875rem' }],
        '3xl': ['1.75rem', { lineHeight: '2.25rem' }],
      },
      borderRadius: {
        btn: '0.5rem',
        card: '0.75rem',
      },
      boxShadow: {
        card: '0 1px 3px oklch(0 0 0 / 0.06), 0 1px 2px oklch(0 0 0 / 0.04)',
        elevated: '0 4px 12px oklch(0 0 0 / 0.08)',
        modal: '0 20px 60px oklch(0 0 0 / 0.15)',
        navbar: '0 1px 0 oklch(0 0 0 / 0.06)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
