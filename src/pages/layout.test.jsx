import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '../test/test-utils'

const { mockSideBar } = vi.hoisted(() => ({
  mockSideBar: vi.fn(),
}))

vi.mock('../compnents/SideBar', () => ({
  default: (props) => {
    mockSideBar(props)
    return <div data-testid='sidebar-mock'>sidebar:{String(props.sidebarOpen)}</div>
  },
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Outlet: () => <div data-testid='layout-outlet'>Outlet content</div>,
  }
})

vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react')
  return {
    ...actual,
    Menu: ({ onClick, className }) => (
      <button type='button' aria-label='open sidebar' onClick={onClick} className={className}>
        open
      </button>
    ),
    X: ({ onClick, className }) => (
      <button type='button' aria-label='close sidebar' onClick={onClick} className={className}>
        close
      </button>
    ),
  }
})

import Layout from './layout'

describe('Layout page', () => {
  beforeEach(() => {
    mockSideBar.mockClear()
  })

  it('renders sidebar and outlet when user data is available', () => {
    render(<Layout />)

    expect(screen.getByTestId('sidebar-mock')).toHaveTextContent('sidebar:false')
    expect(screen.getByTestId('layout-outlet')).toBeInTheDocument()
    expect(mockSideBar.mock.calls.at(-1)[0]).toMatchObject({ sidebarOpen: false })
  })

  it('toggles sidebar state through menu controls', () => {
    render(<Layout />)

    fireEvent.click(screen.getByRole('button', { name: /open sidebar/i }))
    expect(screen.getByRole('button', { name: /close sidebar/i })).toBeInTheDocument()
    expect(mockSideBar.mock.calls.at(-1)[0].sidebarOpen).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: /close sidebar/i }))
    expect(screen.getByRole('button', { name: /open sidebar/i })).toBeInTheDocument()
    expect(mockSideBar.mock.calls.at(-1)[0].sidebarOpen).toBe(false)
  })
})
