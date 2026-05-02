const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const TOKEN_KEY = 'pingup_api_token'

export const apiToken = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

const request = async (path, options = {}) => {
  const token = apiToken.get()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let message = 'Request failed'
    try {
      const error = await response.json()
      message = error.message || message
    } catch {
      message = response.statusText || message
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export const api = {
  auth: {
    login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  },
  users: {
    me: () => request('/users/me'),
    list: (q = '') => request(`/users${q ? `?q=${encodeURIComponent(q)}` : ''}`),
    get: (id) => request(`/users/${id}`),
    updateMe: (payload) => request('/users/me', { method: 'PUT', body: JSON.stringify(payload) }),
  },
  posts: {
    feed: () => request('/posts/feed'),
    byUser: (userId) => request(`/posts/user/${userId}`),
    create: (payload) => request('/posts', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
    like: (id) => request(`/posts/${id}/like`, { method: 'POST' }),
  },
  stories: {
    list: () => request('/stories'),
    create: (payload) => request('/stories', { method: 'POST', body: JSON.stringify(payload) }),
  },
  messages: {
    recent: () => request('/messages/recent'),
    conversation: (userId) => request(`/messages/${userId}`),
    send: (payload) => request('/messages', { method: 'POST', body: JSON.stringify(payload) }),
  },
  connections: {
    follow: (userId) => request(`/connections/${userId}`, { method: 'POST' }),
    unfollow: (userId) => request(`/connections/${userId}`, { method: 'DELETE' }),
    followers: (userId) => request(`/connections/${userId}/followers`),
    following: (userId) => request(`/connections/${userId}/following`),
  },
  admin: {
    stats: () => request('/admin/stats'),
    userGrowth: (range = '7d') => request(`/admin/analytics/users?range=${range}`),
    postActivity: (range = '7d') => request(`/admin/analytics/posts?range=${range}`),
    engagement: (range = '7d') => request(`/admin/analytics/engagement?range=${range}`),
    trendingHashtags: (range = '24h') => request(`/admin/trending/hashtags?range=${range}`),
    viralProfiles: (range = '7d') => request(`/admin/trending/profiles?range=${range}`),
    viralPosts: (range = '7d') => request(`/admin/trending/posts?range=${range}`),
    users: () => request('/admin/users'),
    reports: (status) => request(`/admin/reports${status ? `?status=${status}` : ''}`),
    reviewReport: (id, action) => request(`/admin/reports/${id}`, { method: 'PATCH', body: JSON.stringify({ action }) }),
    deletePost: (id) => request(`/admin/posts/${id}`, { method: 'DELETE' }),
    muteUser: (id, muted) => request(`/admin/users/${id}/mute`, { method: 'PATCH', body: JSON.stringify({ muted }) }),
    banUser: (id, banned) => request(`/admin/users/${id}/ban`, { method: 'PATCH', body: JSON.stringify({ banned }) }),
    updateRole: (id, role) => request(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
    deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
    pinHashtag: (name) => request('/admin/hashtags/pin', { method: 'POST', body: JSON.stringify({ name }) }),
    getBannedWords: () => request('/admin/banned-words'),
    addBannedWord: (word) => request('/admin/banned-words', { method: 'POST', body: JSON.stringify({ word }) }),
    removeBannedWord: (id) => request(`/admin/banned-words/${id}`, { method: 'DELETE' }),
  },
  reports: {
    create: (payload) => request('/reports', { method: 'POST', body: JSON.stringify(payload) }),
  },
}

export const ensureDemoSession = async () => {
  if (apiToken.get()) return apiToken.get()
  const response = await api.auth.login({
    email: 'admin@example.com',
    password: 'password123',
  })
  if (response?.token) {
    apiToken.set(response.token)
  }
  return response?.token
}

export const normalizeUser = (user) => ({
  ...user,
  _id: String(user?._id ?? user?.id ?? ''),
  full_name: user?.full_name ?? user?.fullName ?? '',
  profile_picture: user?.profile_picture || user?.profilePicture || '',
  cover_photo: user?.cover_photo || user?.coverPhoto || '',
  is_verified: Boolean(user?.is_verified ?? user?.verified ?? false),
  isPrivate: Boolean(user?.isPrivate ?? user?.privateAccount ?? false),
  role: user?.role || 'USER',
  followers: Array.from({ length: user?.followersCount || user?.followers?.length || 0 }),
  following: Array.from({ length: user?.followingCount || user?.following?.length || 0 }),
})

export const normalizePost = (post) => {
  const likesCount = Array.isArray(post?.likes_count)
    ? post.likes_count
    : Array.isArray(post?.likesCount)
      ? post.likesCount
      : Array.from({ length: Number(post?.likesTotal || 0) })

  return {
    ...post,
    _id: String(post?._id ?? post?.id ?? ''),
    user: normalizeUser(post?.user || {}),
    image_urls: post?.image_urls || post?.imageUrls || [],
    video_url: post?.video_url || post?.videoUrl || '',
    post_type: post?.post_type || post?.postType || 'text',
    likes_count: likesCount,
    likesTotal: Number(post?.likesTotal ?? likesCount.length ?? 0),
    likedByMe: Boolean(post?.likedByMe ?? post?.liked_by_me ?? false),
  }
}

export const normalizeStory = (story) => ({
  ...story,
  _id: String(story?._id ?? story?.id ?? ''),
  user: normalizeUser(story?.user || {}),
  media_url: story?.media_url || story?.mediaUrl || '',
  media_type: story?.media_type || story?.mediaType || 'text',
  background_color: story?.background_color || story?.backgroundColor || '#4f46e5',
})

export const normalizeMessage = (message) => {
  const fromSource = message?.from_user_id ?? message?.fromUserId ?? message?.sender
  const toSource = message?.to_user_id ?? message?.toUserId ?? message?.receiver
  const sender = message?.sender || (typeof fromSource === 'object' ? fromSource : null)
  const receiver = message?.receiver || (typeof toSource === 'object' ? toSource : null)

  return {
    ...message,
    _id: String(message?._id ?? message?.id ?? ''),
    from_user_id: String(typeof fromSource === 'object' ? fromSource?._id ?? fromSource?.id ?? '' : fromSource ?? ''),
    to_user_id: String(typeof toSource === 'object' ? toSource?._id ?? toSource?.id ?? '' : toSource ?? ''),
    sender: sender ? normalizeUser(sender) : sender,
    receiver: receiver ? normalizeUser(receiver) : receiver,
    message_type: message?.message_type || message?.messageType || 'text',
    media_url: message?.media_url || message?.mediaUrl || '',
  }
}
