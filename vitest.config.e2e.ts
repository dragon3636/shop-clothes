import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    globalSetup: "./test_setup/global-setup.js",
    exclude: [".docker"],
    setupFiles: ["./test_setup/vitest.config.e2e.js"]
  },
  plugins: [swc.vite(), tsconfigPaths()],
});