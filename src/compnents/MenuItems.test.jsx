import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '../test/test-utils'
import MenuItems from './MenuItems'

describe('MenuItems component', () => {
  it('renders menu links, excludes settings, and shows unread notifications badge', () => {
    render(<MenuItems setSidebarOpen={vi.fn()} />, { initialEntries: ['/'] })

    expect(screen.queryByRole('link', { name: /settings/i })).not.toBeInTheDocument()

    const notificationsLink = screen.getByRole('link', { name: /notifications/i })
    expect(within(notificationsLink).getByText('2')).toBeInTheDocument()

    const feedLink = screen.getByRole('link', { name: /feed/i })
    expect(feedLink.className).toContain('bg-indigo-700')
  })

  it('calls setSidebarOpen(false) when an item is clicked', () => {
    const setSidebarOpen = vi.fn()
    render(<MenuItems setSidebarOpen={setSidebarOpen} />, { initialEntries: ['/discover'] })

    fireEvent.click(screen.getByRole('link', { name: /messages/i }))
    expect(setSidebarOpen).toHaveBeenCalledWith(false)
  })
})
