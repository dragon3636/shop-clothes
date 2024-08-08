
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
  test: {
    include: ["**/*.spec.ts"],
    globals: true,
    root: './',
    exclude: [".docker"],
    globalSetup: "./test_setup/global-setup.js"
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
    tsconfigPaths()
  ],
})