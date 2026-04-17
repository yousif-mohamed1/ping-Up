import React from 'react'
import { render } from '@testing-library/react'
import { ClerkProvider } from '@clerk/clerk-react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../context/ThemeContext'

const TEST_CLERK_KEY = 'pk_test_vitest'

const Providers = ({ children, initialEntries = ['/'] }) => {
  return (
    <ThemeProvider>
      <ClerkProvider publishableKey={TEST_CLERK_KEY}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </ClerkProvider>
    </ThemeProvider>
  )
}

const customRender = (ui, options = {}) => {
  const { initialEntries = ['/'], ...renderOptions } = options

  const Wrapper = ({ children }) => (
    <Providers initialEntries={initialEntries}>{children}</Providers>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
export { customRender as render }
