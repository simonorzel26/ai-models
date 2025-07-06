import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.js'],
    exclude: ['node_modules', 'dist'],
    typecheck: {
      tsconfig: './tsconfig.json'
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.d.ts',
        'vitest.config.ts',
        'tsup.config.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': './src'
    }
  }
});