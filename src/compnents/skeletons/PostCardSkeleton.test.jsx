import { render } from '../../test/test-utils'
import { describe, expect, it } from 'vitest'
import PostCardSkeleton from './PostCardSkeleton'

describe('PostCardSkeleton', () => {
  it('renders pulse skeleton with user row, content lines, image and actions', () => {
    const { container } = render(<PostCardSkeleton />)

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    expect(container.querySelector('.h-48')).toBeInTheDocument()
    expect(container.querySelectorAll('.rounded-full').length).toBeGreaterThan(3)
  })
})
