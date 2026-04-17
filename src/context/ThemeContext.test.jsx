import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, useTheme } from './ThemeContext'

const ThemeConsumer = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button type='button' onClick={toggleTheme}>
      Current: {isDark ? 'dark' : 'light'}
    </button>
  )
}

const ThemeConsumerWithoutProvider = () => {
  const value = useTheme()
  return <span>Value: {String(value)}</span>
}

describe('ThemeProvider and useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('initializes dark mode from localStorage and applies dark class', () => {
    localStorage.setItem('pingup-theme', 'dark')

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    )

    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('pingup-theme')).toBe('dark')
  })

  it('defaults to light mode and persists light setting', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    )

    expect(screen.getByRole('button', { name: /current: light/i })).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('pingup-theme')).toBe('light')
  })

  it('toggles theme and updates both classList and localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    )

    const toggleButton = screen.getByRole('button', { name: /current: light/i })
    fireEvent.click(toggleButton)

    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('pingup-theme')).toBe('dark')
  })

  it('returns undefined from useTheme when no provider is present', () => {
    render(<ThemeConsumerWithoutProvider />)

    expect(screen.getByText('Value: undefined')).toBeInTheDocument()
  })
})