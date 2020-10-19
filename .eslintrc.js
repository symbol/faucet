module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'semi': ['error', 'always'],
    'vue/max-attributes-per-line': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/html-indent': ['error', 'tab', {
        'attribute': 1,
        'baseIndent': 1,
        'closeBracket': 0,
        'alignAttributesVertically': false,
        'ignores': []
    }],
    'vue/html-closing-bracket-spacing': 'off',
    'vue/html-closing-bracket-newline': 'error',
    'vue/html-self-closing': ['error', {'html': {'normal': 'never', 'void': 'always'}}],
    'curly': ['error', 'multi-or-nest'],
    'no-var': 'error',
    'space-before-function-paren': ['error', {
        'anonymous': 'always',
        'named': 'never',
        'asyncArrow': 'always'
    }],
    'indent': ['error', 'tab'],
    'no-unused-expressions': 'off',
    'no-tabs': 'off',
    'no-mixed-spaces-and-tabs': 'off',
    'newline-per-chained-call': ['error'],
    'brace-style': ['error', 'stroustrup'],
    'newline-after-var': ['error', 'always']
  }
}
