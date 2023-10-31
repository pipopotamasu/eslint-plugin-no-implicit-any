import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['rules/index.ts'],
  splitting: false,
  minify: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  dts: true,
  format: [
    "cjs",
    "esm"
  ],
});