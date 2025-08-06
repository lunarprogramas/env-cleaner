module.exports = {
    root: true,
    env: {
        browser: true, // code runs in browsers
        node: true, // code runs in Node.js
        es2021: true, // supports modern ECMAScript 2021 features
        jest: true, // jest testing environment enabled
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json', // path to TypeScript config
        tsconfigRootDir: __dirname,
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        'no-console': 'warn', // warn when using console.log/debug (avoid in prod)
        'no-unused-vars': 'off', // disable base rule for unused vars (use TS version)
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // warn on unused vars, but ignore variables starting with _
        '@typescript-eslint/explicit-function-return-type': 'off', // don't require specifying return type on functions
        '@typescript-eslint/interface-name-prefix': 'off', // don't force interfaces to have I prefix (like IUser)
        '@typescript-eslint/explicit-module-boundary-types': 'off', // don't require explicit types on exported functions
        '@typescript-eslint/no-explicit-any': 'off', // allow usage of the 'any' type without errors
    },
};