module.exports = {
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    printWidth: 100,     // Prevents aggressive wrapping
    tabWidth: 4,         // Use 4 spaces per level
    useTabs: true,      // Use real tabs or not

    arrowParens: 'avoid', // Makes small arrow functions cleaner: x => x instead of (x) => x
    bracketSpacing: true, // Keep space between brackets in object literals: { foo: bar }
    endOfLine: 'lf', // Normalize EOL to LF (cross-platform consistency)
};