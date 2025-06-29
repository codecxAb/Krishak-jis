/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './lib/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'brand-primary': 'var(--brand-primary)',
                'brand-accent': 'var(--brand-accent)',
                'background-primary': 'var(--background-primary)',
                'background-secondary': 'var(--background-secondary)',
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                border: 'var(--border-color)',
            },
            boxShadow: {
                DEFAULT: '0 1px 3px 0 var(--shadow-color)',
                md: '0 4px 6px -1px var(--shadow-color)',
                lg: '0 10px 15px -3px var(--shadow-color)',
            },
        },
    },
    plugins: [],
};