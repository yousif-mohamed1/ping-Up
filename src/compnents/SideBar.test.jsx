import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '../test/test-utils'

const { mockNavigate, mockSignOut } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockSignOut: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('./MenuItems', () => ({
  default: ({ setSidebarOpen }) => (
    <button type='button' data-testid='menu-items-close' onClick={() => setSidebarOpen(false)}>
      Close from MenuItems
    </button>
  ),
}))

vi.mock('../assets/assets', () => ({
  assets: {
    logo: 'logo.png',
  },
  dummyUserData: {
    full_name: 'John Warren',
    username: 'john_warren',
  },
}))

vi.mock('@clerk/clerk-react', () => ({
  ClerkProvider: ({ children }) => <>{children}</>,
  UserButton: () => <button type='button'>User</button>,
  useClerk: () => ({
    signOut: mockSignOut,
  }),
}))

vi.mock('lucide-react', () => ({
  CirclePlus: (props) => <svg data-testid='circle-plus-icon' {...props} />,
  LogOut: (props) => <svg data-testid='logout-icon' {...props} />,
  Settings2: (props) => <svg data-testid='settings-icon' {...props} />,
}))

import SideBar from './SideBar'

describe('SideBar component', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockSignOut.mockClear()
  })

  it('renders main links and user identity details', () => {
    render(<SideBar sidebarOpen setSidebarOpen={vi.fn()} />)

    expect(screen.getByRole('link', { name: /create post/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument()
    expect(screen.getByText('John Warren')).toBeInTheDocument()
    expect(screen.getByText('@john_warren')).toBeInTheDocument()
  })

  it('applies hidden or visible class based on sidebarOpen prop', () => {
    const setSidebarOpen = vi.fn()
    const { container, rerender } = render(
      <SideBar sidebarOpen={false} setSidebarOpen={setSidebarOpen} />,
    )

    expect(container.firstChild.className).toContain('-translate-x-full')

    rerender(<SideBar sidebarOpen setSidebarOpen={setSidebarOpen} />)
    expect(container.firstChild.className).toContain('translate-x-0')
  })

  it('navigates home when brand logo is clicked', () => {
    render(<SideBar sidebarOpen setSidebarOpen={vi.fn()} />)

    fireEvent.click(screen.getByAltText('brand logo'))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('calls signOut when logout button is clicked', () => {
    render(<SideBar sidebarOpen setSidebarOpen={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: /logout/i }))
    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })

  it('passes setSidebarOpen to MenuItems and closes when menu item triggers action', () => {
    const setSidebarOpen = vi.fn()
    render(<SideBar sidebarOpen setSidebarOpen={setSidebarOpen} />)

    fireEvent.click(screen.getByTestId('menu-items-close'))
    expect(setSidebarOpen).toHaveBeenCalledWith(false)
  })
})
