import { render } from '../../test/test-utils'
import { describe, expect, it } from 'vitest'
import NotificationSkeleton from './NotificationSkeleton'

describe('NotificationSkeleton', () => {
  it('renders three loading notification rows', () => {
    const { container } = render(<NotificationSkeleton />)

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    expect(container.querySelectorAll('div[class*="items-start"]')).toHaveLength(3)
  })
})
