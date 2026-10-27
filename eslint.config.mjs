// ESLint flat config. Replaces Create React App's "react-app" preset and the
// old .eslintrc.js: core recommended rules, typescript-eslint, React,
// the two React Hooks rules CRA enforced, and Prettier formatting.
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['build/', 'coverage/'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    languageOptions: { globals: globals.browser },
    // eslint-plugin-react's version: 'detect' calls an API that ESLint 10
    // removed, so the React major is stated here. Update it with React.
    settings: { react: { version: '17.0' } },
  },
  {
    files: ['src/**/*.test.{js,jsx,ts,tsx}', 'src/setupTests.ts'],
    languageOptions: { globals: globals.vitest },
  },
  {
    files: ['*.config.{js,mjs,mts,ts}', '.prettierrc.js'],
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      // Allow intentionally unused arguments when prefixed with _
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
  prettierRecommended,
  {
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
);
