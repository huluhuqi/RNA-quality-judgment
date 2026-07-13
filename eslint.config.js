export default [
    {
        rules: {
            'no-unused-vars': ['warn', { varsIgnorePattern: '^_' }],
            'no-undef': 'warn',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'no-trailing-spaces': 'error',
            'eol-last': 'error',
            'comma-spacing': ['error', { before: false, after: true }],
            'space-before-blocks': 'error',
            'keyword-spacing': 'error'
        }
    }
];
