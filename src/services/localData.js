import { dummyPostsData, dummyStoriesData } from '../assets/assets'

const POSTS_KEY = 'pingup_local_posts'
const STORIES_KEY = 'pingup_local_stories'

const readArray = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

const writeArray = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getStoredPosts = () => readArray(POSTS_KEY, dummyPostsData)

export const saveStoredPosts = (posts) => {
  writeArray(POSTS_KEY, posts)
  dummyPostsData.splice(0, dummyPostsData.length, ...posts)
}

export const upsertStoredPost = (post) => {
  const posts = getStoredPosts()
  const existingIndex = posts.findIndex((item) => item._id === post._id)
  const nextPosts = existingIndex === -1
    ? [post, ...posts]
    : posts.map((item) => item._id === post._id ? { ...item, ...post } : item)
  saveStoredPosts(nextPosts)
  return nextPosts
}

export const deleteStoredPost = (postId) => {
  const nextPosts = getStoredPosts().filter((post) => post._id !== postId)
  saveStoredPosts(nextPosts)
  return nextPosts
}

export const getStoredStories = () => readArray(STORIES_KEY, dummyStoriesData)

export const saveStoredStories = (stories) => {
  writeArray(STORIES_KEY, stories)
  dummyStoriesData.splice(0, dummyStoriesData.length, ...stories)
}

export const addStoredStory = (story) => {
  const nextStories = [story, ...getStoredStories()]
  saveStoredStories(nextStories)
  return nextStories
}

export const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = () => reject(reader.error)
  reader.readAsDataURL(file)
})
