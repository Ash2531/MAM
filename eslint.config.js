const typescriptEslintParser = require('@typescript-eslint/parser');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const angularEslintPlugin = require('@angular-eslint/eslint-plugin');
const angularTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');
const importPlugin = require('eslint-plugin-import');
const jsdocPlugin = require('eslint-plugin-jsdoc');
const preferArrowPlugin = require('eslint-plugin-prefer-arrow');
const htmlPlugin = require('eslint-plugin-html');

// Base rules for all files (equivalent to 'eslint:recommended')
const eslintRecommended = {
  rules: {
    'no-undef': 'error',
    'no-unused-vars': 'off', // Disabled in favor of @typescript-eslint/no-unused-vars
    'no-console': ['warn', { allow: ['log', 'error'] }],
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'prefer-const': 'error',
  },
};

// TypeScript-specific rules (equivalent to 'plugin:@typescript-eslint/recommended' and 'recommended-requiring-type-checking')
const typescriptRecommended = {
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
  },
};

// Import plugin rules (equivalent to 'plugin:import/recommended' and 'plugin:import/typescript')
const importRecommended = {
  rules: {
    'import/no-unresolved': 'error',
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
};

// Angular-specific rules (equivalent to 'plugin:@angular-eslint/recommended')
const angularRecommended = {
  rules: {
    '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
    '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
    '@angular-eslint/no-input-rename': 'error',
    '@angular-eslint/no-output-rename': 'error',
  },
};

// JSDoc rules
const jsdocRules = {
  rules: {
    'jsdoc/require-jsdoc': [
      'warn',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
        },
      },
    ],
    'jsdoc/require-param': 'warn',
    'jsdoc/require-returns': 'warn',
  },
};

// Prefer arrow functions
const preferArrowRules = {
  rules: {
    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      },
    ],
  },
};

module.exports = [
  // Configuration for TypeScript files (excluding tests)
  {
    files: ['src/**/*.ts'],
    ignores: ['dist/', 'node_modules/', '**/*.spec.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptEslintParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        browser: true,
        node: true,
        es2021: true,
        window: true,
        console: true,
        localStorage:true
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      '@angular-eslint': angularEslintPlugin,
      import: importPlugin,
      jsdoc: jsdocPlugin,
      'prefer-arrow': preferArrowPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      ...eslintRecommended.rules,
      ...typescriptRecommended.rules,
      ...importRecommended.rules,
      ...angularRecommended.rules,
      ...jsdocRules.rules,
      ...preferArrowRules.rules,
      indent: ['error', 2, { SwitchCase: 1 }],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
    },
  },
  // Configuration for TypeScript test files
  {
    files: ['src/**/*.spec.ts'],
    ignores: ['dist/', 'node_modules/'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptEslintParser,
      parserOptions: {
        project: './tsconfig.spec.json',
      },
      globals: {
        browser: true,
        node: true,
        es2021: true,
        jasmine: true,
        window: true,
        console: true,
        localStorage: true,
        // Explicitly define Jasmine globals
        describe: true,
        beforeEach: true,
        afterEach: true,
        it: true,
        expect: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      '@angular-eslint': angularEslintPlugin,
      import: importPlugin,
      jsdoc: jsdocPlugin,
      'prefer-arrow': preferArrowPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.spec.json',
        },
      },
    },
    rules: {
      ...eslintRecommended.rules,
      ...typescriptRecommended.rules,
      ...importRecommended.rules,
      ...angularRecommended.rules,
      ...jsdocRules.rules,
      ...preferArrowRules.rules,
      indent: ['error', 2, { SwitchCase: 1 }],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      // Relax some rules for test files
      '@typescript-eslint/explicit-function-return-type': 'off',
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
    },
  },
  // Configuration for HTML templates
  {
    files: ['src/**/*.html'],
    ignores: ['dist/', 'node_modules/'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint': angularEslintPlugin,
      '@angular-eslint/template': angularTemplatePlugin,
      html: htmlPlugin,
    },
    settings: {
      'html/html-extensions': ['.html'],
    },
    rules: {
      '@angular-eslint/template/no-duplicate-attributes': 'error',
      '@angular-eslint/template/use-track-by-function': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/click-events-have-key-events': 'warn',
    },
  },
];
