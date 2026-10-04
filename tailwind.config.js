/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                slate: { 50:'#f1f2ef',100:'#e5e9e6',200:'#d3d8d5',300:'#bdc4c0',400:'#a3a9a7',500:'#858c88',600:'#5d6560',700:'#3c4440',800:'#292e2c',900:'#1a201d',950:'#101413' },
                zinc: { 50:'#f1f2ef',100:'#e5e9e6',200:'#d3d8d5',300:'#bdc4c0',400:'#a3a9a7',500:'#858c88',600:'#5d6560',700:'#3c4440',800:'#292e2c',900:'#1a201d',950:'#101413' },
                gray: { 50:'#f1f2ef',100:'#e5e9e6',200:'#d3d8d5',300:'#bdc4c0',400:'#a3a9a7',500:'#858c88',600:'#5d6560',700:'#3c4440',800:'#292e2c',900:'#1a201d',950:'#101413' },
                neutral: { 50:'#f1f2ef',100:'#e5e9e6',200:'#d3d8d5',300:'#bdc4c0',400:'#a3a9a7',500:'#858c88',600:'#5d6560',700:'#3c4440',800:'#292e2c',900:'#1a201d',950:'#101413' },
                indigo: { 50:'#effaf4',100:'#d5f7e4',200:'#c9f2dc',300:'#b6edce',400:'#b6edce',500:'#8fd9ae',600:'#5fb78a',700:'#3f8a66',800:'#2f5a47',900:'#243b31',950:'#17241d' },
                violet: { 50:'#effaf4',100:'#d5f7e4',200:'#c9f2dc',300:'#b6edce',400:'#b6edce',500:'#8fd9ae',600:'#5fb78a',700:'#3f8a66',800:'#2f5a47',900:'#243b31',950:'#17241d' },
                purple: { 50:'#effaf4',100:'#d5f7e4',200:'#c9f2dc',300:'#b6edce',400:'#b6edce',500:'#8fd9ae',600:'#5fb78a',700:'#3f8a66',800:'#2f5a47',900:'#243b31',950:'#17241d' },
                blue: { 50:'#effaf4',100:'#d5f7e4',200:'#c9f2dc',300:'#b6edce',400:'#b6edce',500:'#8fd9ae',600:'#5fb78a',700:'#3f8a66',800:'#2f5a47',900:'#243b31',950:'#17241d' },
                sky: { 50:'#effaf4',100:'#d5f7e4',200:'#c9f2dc',300:'#b6edce',400:'#b6edce',500:'#8fd9ae',600:'#5fb78a',700:'#3f8a66',800:'#2f5a47',900:'#243b31',950:'#17241d' },
                cyan: { 50:'#effaf4',100:'#d5f7e4',200:'#c9f2dc',300:'#b6edce',400:'#b6edce',500:'#8fd9ae',600:'#5fb78a',700:'#3f8a66',800:'#2f5a47',900:'#243b31',950:'#17241d' },
                teal: { 50:'#effaf4',100:'#d5f7e4',200:'#c9f2dc',300:'#b6edce',400:'#b6edce',500:'#8fd9ae',600:'#5fb78a',700:'#3f8a66',800:'#2f5a47',900:'#243b31',950:'#17241d' },
                fuchsia: { 50:'#effaf4',100:'#d5f7e4',200:'#c9f2dc',300:'#b6edce',400:'#b6edce',500:'#8fd9ae',600:'#5fb78a',700:'#3f8a66',800:'#2f5a47',900:'#243b31',950:'#17241d' },
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: "hsl(var(--card))",
                border: "hsl(var(--border))",
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    hover: "#d5f7e4",
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
                    surface: '#151b18',
                    hover: '#1a201d',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#a1a1aa',
                    muted: '#71717a',
                },
                status: {
                    success: '#10b981',
                    warning: '#f59e0b',
                    error: '#f43f5e',
                    info: '#38bdf8',
                },
            },
            fontFamily: {
                sans: ['Arial', 'Helvetica', 'sans-serif'],
                serif: ['Arial', 'Helvetica', 'sans-serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            },
            borderRadius: {
                md: '3px', lg: '4px', xl: '6px', '2xl': '6px', '3xl': '8px',
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
