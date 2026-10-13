/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                slate: { 50:'rgb(var(--sl-50) / <alpha-value>)', 100:'rgb(var(--sl-100) / <alpha-value>)', 200:'rgb(var(--sl-200) / <alpha-value>)', 300:'rgb(var(--sl-300) / <alpha-value>)', 400:'rgb(var(--sl-400) / <alpha-value>)', 500:'rgb(var(--sl-500) / <alpha-value>)', 600:'rgb(var(--sl-600) / <alpha-value>)', 700:'rgb(var(--sl-700) / <alpha-value>)', 800:'rgb(var(--sl-800) / <alpha-value>)', 900:'rgb(var(--sl-900) / <alpha-value>)', 950:'rgb(var(--sl-950) / <alpha-value>)' },
                zinc: { 50:'rgb(var(--sl-50) / <alpha-value>)', 100:'rgb(var(--sl-100) / <alpha-value>)', 200:'rgb(var(--sl-200) / <alpha-value>)', 300:'rgb(var(--sl-300) / <alpha-value>)', 400:'rgb(var(--sl-400) / <alpha-value>)', 500:'rgb(var(--sl-500) / <alpha-value>)', 600:'rgb(var(--sl-600) / <alpha-value>)', 700:'rgb(var(--sl-700) / <alpha-value>)', 800:'rgb(var(--sl-800) / <alpha-value>)', 900:'rgb(var(--sl-900) / <alpha-value>)', 950:'rgb(var(--sl-950) / <alpha-value>)' },
                gray: { 50:'rgb(var(--sl-50) / <alpha-value>)', 100:'rgb(var(--sl-100) / <alpha-value>)', 200:'rgb(var(--sl-200) / <alpha-value>)', 300:'rgb(var(--sl-300) / <alpha-value>)', 400:'rgb(var(--sl-400) / <alpha-value>)', 500:'rgb(var(--sl-500) / <alpha-value>)', 600:'rgb(var(--sl-600) / <alpha-value>)', 700:'rgb(var(--sl-700) / <alpha-value>)', 800:'rgb(var(--sl-800) / <alpha-value>)', 900:'rgb(var(--sl-900) / <alpha-value>)', 950:'rgb(var(--sl-950) / <alpha-value>)' },
                neutral: { 50:'rgb(var(--sl-50) / <alpha-value>)', 100:'rgb(var(--sl-100) / <alpha-value>)', 200:'rgb(var(--sl-200) / <alpha-value>)', 300:'rgb(var(--sl-300) / <alpha-value>)', 400:'rgb(var(--sl-400) / <alpha-value>)', 500:'rgb(var(--sl-500) / <alpha-value>)', 600:'rgb(var(--sl-600) / <alpha-value>)', 700:'rgb(var(--sl-700) / <alpha-value>)', 800:'rgb(var(--sl-800) / <alpha-value>)', 900:'rgb(var(--sl-900) / <alpha-value>)', 950:'rgb(var(--sl-950) / <alpha-value>)' },
                indigo: { 50:'rgb(var(--mi-50) / <alpha-value>)', 100:'rgb(var(--mi-100) / <alpha-value>)', 200:'rgb(var(--mi-200) / <alpha-value>)', 300:'rgb(var(--mi-300) / <alpha-value>)', 400:'rgb(var(--mi-400) / <alpha-value>)', 500:'rgb(var(--mi-500) / <alpha-value>)', 600:'rgb(var(--mi-600) / <alpha-value>)', 700:'rgb(var(--mi-700) / <alpha-value>)', 800:'rgb(var(--mi-800) / <alpha-value>)', 900:'rgb(var(--mi-900) / <alpha-value>)', 950:'rgb(var(--mi-950) / <alpha-value>)' },
                violet: { 50:'rgb(var(--mi-50) / <alpha-value>)', 100:'rgb(var(--mi-100) / <alpha-value>)', 200:'rgb(var(--mi-200) / <alpha-value>)', 300:'rgb(var(--mi-300) / <alpha-value>)', 400:'rgb(var(--mi-400) / <alpha-value>)', 500:'rgb(var(--mi-500) / <alpha-value>)', 600:'rgb(var(--mi-600) / <alpha-value>)', 700:'rgb(var(--mi-700) / <alpha-value>)', 800:'rgb(var(--mi-800) / <alpha-value>)', 900:'rgb(var(--mi-900) / <alpha-value>)', 950:'rgb(var(--mi-950) / <alpha-value>)' },
                purple: { 50:'rgb(var(--mi-50) / <alpha-value>)', 100:'rgb(var(--mi-100) / <alpha-value>)', 200:'rgb(var(--mi-200) / <alpha-value>)', 300:'rgb(var(--mi-300) / <alpha-value>)', 400:'rgb(var(--mi-400) / <alpha-value>)', 500:'rgb(var(--mi-500) / <alpha-value>)', 600:'rgb(var(--mi-600) / <alpha-value>)', 700:'rgb(var(--mi-700) / <alpha-value>)', 800:'rgb(var(--mi-800) / <alpha-value>)', 900:'rgb(var(--mi-900) / <alpha-value>)', 950:'rgb(var(--mi-950) / <alpha-value>)' },
                blue: { 50:'rgb(var(--mi-50) / <alpha-value>)', 100:'rgb(var(--mi-100) / <alpha-value>)', 200:'rgb(var(--mi-200) / <alpha-value>)', 300:'rgb(var(--mi-300) / <alpha-value>)', 400:'rgb(var(--mi-400) / <alpha-value>)', 500:'rgb(var(--mi-500) / <alpha-value>)', 600:'rgb(var(--mi-600) / <alpha-value>)', 700:'rgb(var(--mi-700) / <alpha-value>)', 800:'rgb(var(--mi-800) / <alpha-value>)', 900:'rgb(var(--mi-900) / <alpha-value>)', 950:'rgb(var(--mi-950) / <alpha-value>)' },
                sky: { 50:'rgb(var(--mi-50) / <alpha-value>)', 100:'rgb(var(--mi-100) / <alpha-value>)', 200:'rgb(var(--mi-200) / <alpha-value>)', 300:'rgb(var(--mi-300) / <alpha-value>)', 400:'rgb(var(--mi-400) / <alpha-value>)', 500:'rgb(var(--mi-500) / <alpha-value>)', 600:'rgb(var(--mi-600) / <alpha-value>)', 700:'rgb(var(--mi-700) / <alpha-value>)', 800:'rgb(var(--mi-800) / <alpha-value>)', 900:'rgb(var(--mi-900) / <alpha-value>)', 950:'rgb(var(--mi-950) / <alpha-value>)' },
                cyan: { 50:'rgb(var(--mi-50) / <alpha-value>)', 100:'rgb(var(--mi-100) / <alpha-value>)', 200:'rgb(var(--mi-200) / <alpha-value>)', 300:'rgb(var(--mi-300) / <alpha-value>)', 400:'rgb(var(--mi-400) / <alpha-value>)', 500:'rgb(var(--mi-500) / <alpha-value>)', 600:'rgb(var(--mi-600) / <alpha-value>)', 700:'rgb(var(--mi-700) / <alpha-value>)', 800:'rgb(var(--mi-800) / <alpha-value>)', 900:'rgb(var(--mi-900) / <alpha-value>)', 950:'rgb(var(--mi-950) / <alpha-value>)' },
                teal: { 50:'rgb(var(--mi-50) / <alpha-value>)', 100:'rgb(var(--mi-100) / <alpha-value>)', 200:'rgb(var(--mi-200) / <alpha-value>)', 300:'rgb(var(--mi-300) / <alpha-value>)', 400:'rgb(var(--mi-400) / <alpha-value>)', 500:'rgb(var(--mi-500) / <alpha-value>)', 600:'rgb(var(--mi-600) / <alpha-value>)', 700:'rgb(var(--mi-700) / <alpha-value>)', 800:'rgb(var(--mi-800) / <alpha-value>)', 900:'rgb(var(--mi-900) / <alpha-value>)', 950:'rgb(var(--mi-950) / <alpha-value>)' },
                fuchsia: { 50:'rgb(var(--mi-50) / <alpha-value>)', 100:'rgb(var(--mi-100) / <alpha-value>)', 200:'rgb(var(--mi-200) / <alpha-value>)', 300:'rgb(var(--mi-300) / <alpha-value>)', 400:'rgb(var(--mi-400) / <alpha-value>)', 500:'rgb(var(--mi-500) / <alpha-value>)', 600:'rgb(var(--mi-600) / <alpha-value>)', 700:'rgb(var(--mi-700) / <alpha-value>)', 800:'rgb(var(--mi-800) / <alpha-value>)', 900:'rgb(var(--mi-900) / <alpha-value>)', 950:'rgb(var(--mi-950) / <alpha-value>)' },
                white: 'rgb(var(--ink) / <alpha-value>)',
                paper: 'rgb(var(--paper) / <alpha-value>)',
                deep: 'rgb(var(--deep) / <alpha-value>)',
                surface: 'rgb(var(--surface) / <alpha-value>)',
                mint: 'rgb(var(--mint) / <alpha-value>)',
                'mint-soft': 'rgb(var(--mint-soft) / <alpha-value>)',
                snow: 'rgb(var(--snow) / <alpha-value>)',
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: "hsl(var(--card))",
                border: "hsl(var(--border))",
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    hover: "rgb(var(--mint-soft))",
                    dim: "hsl(var(--accent) / 0.1)",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                bg: {
                    primary: 'hsl(var(--background))',
                    secondary: 'hsl(var(--card))',
                    tertiary: 'hsl(var(--muted))',
                    surface: 'rgb(var(--surface))',
                    hover: 'rgb(var(--sl-900))',
                },
                text: {
                    primary: 'rgb(var(--ink))',
                    secondary: 'rgb(var(--t-secondary))',
                    muted: 'rgb(var(--t-muted))',
                },
                status: {
                    success: 'rgb(var(--st-success))',
                    warning: 'rgb(var(--st-warning))',
                    error: 'rgb(var(--st-error))',
                    info: 'rgb(var(--st-info))',
                },
            },
            fontFamily: {
                sans: ['Rubik', '-apple-system', 'system-ui', 'Segoe UI', 'sans-serif'],
                serif: ['Rubik', '-apple-system', 'system-ui', 'Segoe UI', 'sans-serif'],
                mono: ['Roboto Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            },
            borderRadius: {
                DEFAULT: '4px', sm: '4px', md: '4px', lg: '4px', xl: '4px', '2xl': '4px', '3xl': '4px',
            },
            fontSize: {
                xs: '11px',      // Minimum readable size
                sm: '13px',      // Secondary/helper text
                base: '14px',    // Default body text
                lg: '15px',      // Slightly larger body
                xl: '16px',      // Subheadings
                '2xl': '18px',   // Section headings
                '3xl': '20px',   // Major section titles
                '4xl': '24px',   // Page headings
                '5xl': '28px',   // Hero headings
            },
            lineHeight: {
                tight: '1.3',
                normal: '1.5',
                relaxed: '1.65',
            },
            backgroundImage: {
                'gradient-hero': 'var(--gradient-hero)',
                'gradient-card': 'var(--gradient-card)',
                'gradient-accent': 'var(--gradient-accent)',
                'gradient-glow': 'var(--gradient-glow)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
