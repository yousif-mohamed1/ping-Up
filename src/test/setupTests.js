import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { installBrowserApiMocks, resetBrowserApiMocks } from './mocks/browserApis'
import { createClerkReactMock, resetClerkMocks } from './mocks/clerk-react'

vi.mock('@clerk/clerk-react', () => createClerkReactMock())

installBrowserApiMocks()

beforeEach(() => {
  resetBrowserApiMocks()
  resetClerkMocks()
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
