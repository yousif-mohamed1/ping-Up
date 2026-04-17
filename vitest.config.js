import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setupTests.js'],
      include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      exclude: [...configDefaults.exclude, 'server/**'],
      passWithNoTests: true,
      coverage: {
        provider: 'v8',
        reportsDirectory: './coverage',
        reporter: ['text', 'html', 'lcov', 'json-summary'],
      },
    },
  }),
)
