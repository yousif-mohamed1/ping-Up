import { render } from '../../test/test-utils'
import { describe, expect, it } from 'vitest'
import UserCardSkeleton from './UserCardSkeleton'

describe('UserCardSkeleton', () => {
  it('renders pulse skeleton shell with avatar and placeholder blocks', () => {
    const { container } = render(<UserCardSkeleton />)

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    expect(container.querySelectorAll('.rounded-full').length).toBeGreaterThan(2)
  })
})
