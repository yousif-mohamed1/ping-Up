import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '../test/test-utils'
import { setClerkUser } from '../test/mocks/clerk-react'
import App from '../App'

vi.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid='toaster' />,
}))

vi.mock('../pages/login', () => ({
  default: () => <div>Login Page</div>,
}))

vi.mock('../pages/feed', () => ({
  default: () => <div>Feed Page</div>,
}))

vi.mock('../pages/discover', () => ({
  default: () => <div>Discover Page</div>,
}))

vi.mock('../pages/connection', () => ({
  default: () => <div>Connections Page</div>,
}))

vi.mock('../pages/massges', () => ({
  default: () => <div>Messages Page</div>,
}))

vi.mock('../pages/chat_box', () => ({
  default: () => <div>Chat Box Page</div>,
}))

vi.mock('../pages/profile', () => ({
  default: () => <div>Profile Page</div>,
}))

vi.mock('../pages/notifications', () => ({
  default: () => <div>Notifications Page</div>,
}))

vi.mock('../pages/create_post', () => ({
  default: () => <div>Create Post Page</div>,
}))

vi.mock('../pages/settings', () => ({
  default: () => <div>Settings Page</div>,
}))

vi.mock('../pages/layout', async () => {
  const { Outlet } = await import('react-router-dom')
  return {
    default: () => (
      <div>
        <div>Layout Page</div>
        <Outlet />
      </div>
    ),
  }
})

describe('App routes and auth behavior', () => {
  beforeEach(() => {
    setClerkUser(null)
  })

  it('renders login route when no Clerk user is present', () => {
    render(<App />, { initialEntries: ['/'] })

    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Layout Page')).not.toBeInTheDocument()
    expect(screen.getByTestId('toaster')).toBeInTheDocument()
  })

  it('renders protected root route when a Clerk user is present', () => {
    setClerkUser({ id: 'user_1' })

    render(<App />, { initialEntries: ['/'] })

    expect(screen.getByText('Layout Page')).toBeInTheDocument()
    expect(screen.getByText('Feed Page')).toBeInTheDocument()
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })

  it('maps nested routes for authenticated users', () => {
    setClerkUser({ id: 'user_1' })

    render(<App />, { initialEntries: ['/messages/123'] })
    expect(screen.getByText('Chat Box Page')).toBeInTheDocument()

    render(<App />, { initialEntries: ['/settings'] })
    expect(screen.getByText('Settings Page')).toBeInTheDocument()
  })
})