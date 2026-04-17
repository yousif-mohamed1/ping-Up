import { describe, expect, it } from 'vitest'
import { render } from '../test/test-utils'
import Loading from './loading'

describe('loading component', () => {
  it('renders with default height and spinner element', () => {
    const { container } = render(<Loading />)

    expect(container.firstChild).toHaveStyle({ height: '100vh' })
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('accepts a custom height prop', () => {
    const { container } = render(<Loading height='40vh' />)

    expect(container.firstChild).toHaveStyle({ height: '40vh' })
  })
})
