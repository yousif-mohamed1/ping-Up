import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '../test/test-utils'

vi.mock('../assets/assets', () => ({
  assets: {
    bgImage: 'bg-image.png',
    logo: 'logo.png',
    group_users: 'group-users.png',
  },
}))

vi.mock('@clerk/clerk-react', () => ({
  ClerkProvider: ({ children }) => <>{children}</>,
  SignIn: () => <div data-testid='sign-in-widget'>SignIn widget</div>,
}))

vi.mock('lucide-react', () => ({
  Star: (props) => <svg data-testid='star-icon' {...props} />,
}))

import Login from './login'

describe('Login page', () => {
  it('renders core hero and brand elements', () => {
    render(<Login />)

    expect(screen.getByAltText('background')).toBeInTheDocument()
    expect(screen.getByAltText('brand logo')).toBeInTheDocument()
    expect(screen.getByAltText('group of users')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /more than just friends truly connect/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/connect with global community on pingup\./i)).toBeInTheDocument()
  })

  it('renders the sign in widget and five rating stars', () => {
    render(<Login />)

    expect(screen.getByTestId('sign-in-widget')).toBeInTheDocument()
    expect(screen.getAllByTestId('star-icon')).toHaveLength(5)
  })
})
