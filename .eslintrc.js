module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  root: true,
  // "ignorePatterns": ["**/*.js"],
  extends: ['prettier', 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'unused-imports', 'simple-import-sort', 'react-hooks', 'react', 'import'],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
      tsx: true, // Allows for the parsing of TSX ???
      ts: true,
    },
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
      react: {
        createClass: 'createReactClass', // Regex for Component Factory to use,
        // default to "createReactClass"
        pragma: 'React', // Pragma to use, default to "React"
        fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
        version: 'latest', // React version. "detect" automatically picks the version you have installed.
        // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
        // It will default to "latest" and warn if missing, and to "detect" in the future
        flowVersion: '0.53', // Flow version
      },
    },
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    // 'prettier/prettier': ['error'],
    '@typescript-eslint/no-empty-interface': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'object-shorthand': 'error',
    'no-confusing-arrow': [
      'error',
      {
        allowParens: true,
      },
    ],
    semi: ['error', 'always'],
    'semi-style': ['error', 'last'],
    'no-extra-semi': 'error',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-restricted-imports': ['error', { patterns: ['../*'] }],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'linebreak-style': 0,
    'arrow-body-style': ['error', 'as-needed'],
    indent: ['error', 2],
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'arrow-parens': ['error', 'always'],
    quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
    'no-multi-spaces': 'error',
    'no-trailing-spaces': 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'space-before-blocks': ['error', { functions: 'always', keywords: 'always', classes: 'always' }],
    'padded-blocks': ['error', { classes: 'never', blocks: 'never' }],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'function' },
      { blankLine: 'always', prev: 'function', next: '*' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'never', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
    ],
    'arrow-spacing': ['error', { before: true, after: true }],
    'max-len': ['error', { code: 180, ignoreUrls: true, ignoreStrings: true, ignoreTrailingComments: true, ignoreTemplateLiterals: true }],

    // 'no-mixed-operators': 'error',
    'quote-props': ['error', 'as-needed'],
    '@typescript-eslint/no-unused-vars': ['warn'],
    'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }],
    'jsx-quotes': ['error', 'prefer-double'],
    'lines-around-comment': [
      'error',
      {
        beforeBlockComment: false,
        beforeLineComment: false,
        allowBlockStart: true,
        allowBlockEnd: false,
        allowObjectStart: true,
        allowObjectEnd: false,
        allowArrayStart: true,
        allowArrayEnd: false,
      },
    ],
    'spaced-comment': [
      'error',
      'always',
      {
        line: {
          markers: ['/'],
          exceptions: ['-', '+'],
        },
        block: {
          markers: ['!'],
          exceptions: ['*'],
          balanced: true,
        },
      },
    ],
    // 'newline-before-return': 'error',
    'react/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
    'react/jsx-closing-tag-location': 'error',
    'react/display-name': 'off',
    'react/jsx-closing-bracket-location': [1, 'tag-aligned'],
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
    'newline-before-return': 'error',
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: false }],
    'simple-import-sort/imports': 'error',

    'keyword-spacing': ['error', { before: true, after: true }],
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    'no-whitespace-before-property': 'error',
    'no-mixed-operators': 'error',
    'import/newline-after-import': ['error', { count: 1 }],
  },
  overrides: [
    {
      files: ['**/*.json', '**/*.jsonc', '*.json5'],
      parser: 'jsonc-eslint-parser', // Set this parser.
      rules: {
        'comma-dangle': ['error', 'never'],
        semi: ['error', 'never'],
        quotes: ['error', 'double'],
        'quote-props': ['error', 'consistent'],
        'max-len': ['error', { code: 180, ignoreStrings: true, ignoreRegExpLiterals: true, ignoreTemplateLiterals: true }],
      },
    },
    {
      files: ['**/*.js'],
      parser: '@typescript-eslint/parser',
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
};
