/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#94A3B8', // Slate 400 (Bluish Gray)
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                },
                secondary: {
                    DEFAULT: '#FFFFFF', // White Accent
                    50: '#FFFFFF',
                    100: '#F8FAFC',
                    200: '#F1F5F9',
                    300: '#E2E8F0',
                    400: '#CBD5E1',
                    500: '#94A3B8',
                    600: '#64748B',
                    700: '#475569',
                    800: '#334155',
                    900: '#1E293B',
                },
                background: '#020617', // Slate 950 (Very Dark Bluish Gray)
                surface: '#0F172A', // Slate 900
                text: '#F8FAFC', // Slate 50 (White-ish)
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
};
