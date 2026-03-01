import js from 'eslint-config-kswedberg/flat/js.mjs';
import {defineConfig} from 'eslint/config';

export default defineConfig([
  js,
  {
    rules: {
      'no-var': 'off',
      'prefer-template': 'off',
      'prefer-arrow-callback': 'off',
    },
  },
]);
