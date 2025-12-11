/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Genskey Brand Colors
                brand: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9', // Primary Genskey Blue
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                },
                // Scientific Semantics
                scientific: {
                    pass: '#10b981',     // Emerald - Safety Pass / Healthy
                    fail: '#ef4444',     // Red - Safety Fail / Pathogen
                    warning: '#f59e0b',  // Amber - Quality Warning
                    info: '#3b82f6',     // Blue - Information
                },
                // Enterprise Gray Scale
                enterprise: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                    950: '#030712',
                }
            },
            fontFamily: {
                // Prioritize Chinese fonts
                sans: [
                    'PingFang SC',
                    'Microsoft YaHei',
                    'Source Han Sans CN',
                    'Noto Sans SC',
                    'system-ui',
                    '-apple-system',
                    'sans-serif'
                ],
                // Monospace for DNA sequences and code
                mono: [
                    'SF Mono',
                    'Monaco',
                    'Consolas',
                    'Liberation Mono',
                    'Courier New',
                    'monospace'
                ],
                // English headings
                en: [
                    'Inter',
                    'system-ui',
                    '-apple-system',
                    'sans-serif'
                ]
            },
            spacing: {
                'dense': '0.25rem',     // 4px - for high-density tables
                'compact': '0.5rem',     // 8px
                'comfortable': '1rem',   // 16px
            },
            fontSize: {
                'xs-cn': ['0.75rem', { lineHeight: '1.2rem' }],
                'sm-cn': ['0.875rem', { lineHeight: '1.5rem' }],
                'base-cn': ['1rem', { lineHeight: '1.75rem' }],
                'lg-cn': ['1.125rem', { lineHeight: '2rem' }],
            },
            boxShadow: {
                'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
                'enterprise': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'dna-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M30 0v60M0 30h60\" stroke=\"%230ea5e9\" stroke-opacity=\"0.05\" stroke-width=\"2\" fill=\"none\"/%3E%3C/svg%3E')",
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 3s linear infinite',
            },
            gridTemplateColumns: {
                'dashboard': 'repeat(12, minmax(0, 1fr))',
            }
        },
    },
    plugins: [],
}
