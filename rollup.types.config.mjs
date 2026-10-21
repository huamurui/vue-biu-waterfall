import { defineConfig } from 'rollup'
import { dts } from 'rollup-plugin-dts'

export default defineConfig({
  input: '.types/index.d.ts',
  output: [
    { file: 'dist/index.d.ts', format: 'es' },
    { file: 'dist/index.d.cts', format: 'es' },
  ],
  plugins: [dts()],
})
