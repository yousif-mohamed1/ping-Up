import { describe, expect, it } from 'vitest'
import {
  assets,
  menuItemsData,
  dummyUserData,
  dummyStoriesData,
  dummyPostsData,
  dummyRecentMessagesData,
  dummyMessagesData,
  dummyConnectionsData,
  dummyFollowersData,
  dummyFollowingData,
  dummyPendingConnectionsData,
  dummyNotificationsData,
  dummyCommentsData,
} from './assets'

describe('assets module exports', () => {
  it('exposes expected static asset keys with string-like values', () => {
    expect(Object.keys(assets).sort()).toEqual(
      ['bgImage', 'group_users', 'logo', 'sample_cover', 'sample_profile', 'sponsored_img'].sort(),
    )

    for (const value of Object.values(assets)) {
      expect(typeof value).toBe('string')
      expect(value.length).toBeGreaterThan(0)
    }
  })

  it('defines menu items with route and icon shape', () => {
    expect(menuItemsData.length).toBeGreaterThan(0)

    for (const item of menuItemsData) {
      expect(item).toEqual(
        expect.objectContaining({
          to: expect.any(String),
          label: expect.any(String),
        }),
      )
      expect(['function', 'object']).toContain(typeof item.Icon)
      expect(item.Icon).toBeTruthy()
      expect(item.to.startsWith('/')).toBe(true)
    }
  })

  it('keeps dummy user profile shape stable', () => {
    expect(dummyUserData).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        email: expect.any(String),
        full_name: expect.any(String),
        username: expect.any(String),
        profile_picture: expect.any(String),
        cover_photo: expect.any(String),
        followers: expect.any(Array),
        following: expect.any(Array),
        connections: expect.any(Array),
      }),
    )
  })

  it('exports non-empty mock collections with representative object fields', () => {
    expect(dummyStoriesData[0]).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        user: expect.any(Object),
        media_type: expect.any(String),
      }),
    )

    expect(dummyPostsData[0]).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        user: expect.any(Object),
        image_urls: expect.any(Array),
        post_type: expect.any(String),
      }),
    )

    expect(dummyRecentMessagesData[0]).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        message_type: expect.any(String),
        seen: expect.any(Boolean),
      }),
    )

    expect(dummyMessagesData[0]).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        message_type: expect.any(String),
      }),
    )

    expect(dummyConnectionsData).not.toHaveLength(0)
    expect(dummyFollowersData).not.toHaveLength(0)
    expect(dummyFollowingData).not.toHaveLength(0)
    expect(dummyPendingConnectionsData).not.toHaveLength(0)

    expect(dummyNotificationsData[0]).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        type: expect.any(String),
        user: expect.any(Object),
        seen: expect.any(Boolean),
      }),
    )

    expect(dummyCommentsData[0]).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        user: expect.any(Object),
        text: expect.any(String),
      }),
    )
  })
})