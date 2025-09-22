import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import';
import { defineConfig } from 'eslint/config';

export default defineConfig(js.configs.recommended, ...tseslint.configs.recommended, prettier, {
  plugins: {
    'unused-imports': unusedImports,
    import: importPlugin,
  },
  rules: {
    'import/no-absolute-path': 'error',
    'import/no-useless-path-segments': ['warn', { noUselessIndex: true }],
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-unsafe-function-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-wrapper-object-types': 'off',
    '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
  },
});
