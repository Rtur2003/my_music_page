// ESLint v9+ configuration for my_music_page
export default [
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                console: 'readonly',
                document: 'readonly',
                window: 'readonly',
                localStorage: 'readonly',
                fetch: 'readonly',
                navigator: 'readonly',
                performance: 'readonly',
                alert: 'readonly',
                confirm: 'readonly',
                setTimeout: 'readonly',
                setInterval: 'readonly',
                clearTimeout: 'readonly',
                clearInterval: 'readonly',
                requestAnimationFrame: 'readonly',
                IntersectionObserver: 'readonly',
                ResizeObserver: 'readonly',
                MutationObserver: 'readonly',
                URL: 'readonly',
                URLSearchParams: 'readonly',
                FormData: 'readonly',
                Blob: 'readonly',
                FileReader: 'readonly',
                ServiceWorker: 'readonly',
                caches: 'readonly',
                self: 'readonly'
            }
        },
        rules: {
            'indent': ['error', 4],
            'linebreak-style': ['error', 'unix'],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'no-unused-vars': 'warn',
            'no-console': 'off',
            'no-undef': 'error',
            'no-var': 'warn',
            'prefer-const': 'warn',
            'no-multiple-empty-lines': ['warn', { 'max': 2 }],
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all']
        }
    }
];
