import React, { useState, useEffect, useRef } from 'react'
import { Search, X, User, FileText, MapPin, BadgeCheck } from 'lucide-react'
import { dummyConnectionsData, dummyPostsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import PostDetailModal from './PostDetailModal'

const GlobalSearch = ({ onClose, onPostClick }) => {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedPost, setSelectedPost] = useState(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Auto focus input on open
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const q = query.trim().toLowerCase()

  const filteredUsers = q
    ? dummyConnectionsData.filter(u =>
        `${u.full_name} ${u.username} ${u.bio || ''} ${u.location || ''}`
          .toLowerCase().includes(q)
      )
    : []

  const filteredPosts = q
    ? dummyPostsData.filter(p =>
        p.content?.toLowerCase().includes(q)
      )
    : []

  const showUsers = activeTab === 'all' || activeTab === 'people'
  const showPosts = activeTab === 'all' || activeTab === 'posts'

  const hasResults = filteredUsers.length > 0 || filteredPosts.length > 0

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`)
    onClose()
  }

  const handlePostClick = (post) => {
    if (onPostClick) {
      onPostClick(post)
      return
    }

    setSelectedPost(post)
  }

  const trendingTags = dummyPostsData
    .flatMap(post => (post.content || '').match(/#[\p{L}\p{N}_]+/gu) || [])
    .slice(0, 6)

  const highlightMatch = (text, searchQuery) => {
    if (!searchQuery || !text) return text
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase()
        ? <mark key={i} className='bg-indigo-100 text-indigo-700 rounded px-0.5 not-italic'>{part}</mark>
        : part
    )
  }

  return (
    // Backdrop
    <div
      className='fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md p-4 sm:p-6'
      onClick={onClose}
    >
      {/* Search panel */}
      <div
        className='mx-auto mt-6 sm:mt-10 w-full max-w-4xl'
        onClick={e => e.stopPropagation()}
      >
        <div className='rounded-3xl border border-white/30 dark:border-gray-700 bg-white/95 dark:bg-gray-800 shadow-2xl dark:shadow-gray-900 overflow-hidden'>
          {/* Search input box */}
          <div className='flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-slate-100 dark:border-gray-700'>
            <div className='w-9 h-9 rounded-xl bg-slate-100 dark:bg-gray-700 flex items-center justify-center shrink-0'>
              <Search className='w-4.5 h-4.5 text-slate-500 dark:text-gray-300' />
            </div>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder='Search people, posts, hashtags...'
              className='flex-1 text-[15px] sm:text-base text-slate-800 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-400
                focus:outline-none bg-transparent'
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className='p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition text-slate-400 dark:text-gray-400 cursor-pointer'
                title='Clear'
              >
                <X className='w-4 h-4' />
              </button>
            )}
            <kbd className='hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-gray-700 text-slate-400 dark:text-gray-300 text-xs font-mono shrink-0'>
              ESC
            </kbd>
            <button
              onClick={onClose}
              className='p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition text-slate-400 dark:text-gray-400 cursor-pointer'
              title='Close'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Results panel */}
          {q && (
            <div className='max-h-[70vh] flex flex-col'>

              {/* Tabs */}
              <div className='flex items-center gap-1 px-4 pt-3 pb-2 border-b border-gray-100 dark:border-gray-700 shrink-0'>
                {['all', 'people', 'posts'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition cursor-pointer
                      ${activeTab === tab
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
                <span className='ml-auto text-xs text-slate-400 dark:text-gray-400'>
                  {filteredUsers.length + filteredPosts.length} results
                </span>
              </div>

              {/* Results list */}
              <div className='overflow-y-auto no-scrollbar flex-1'>

                {/* People results */}
                {showUsers && filteredUsers.length > 0 && (
                  <div>
                    {activeTab === 'all' && (
                      <div className='px-4 pt-3 pb-1 flex items-center gap-2'>
                        <User className='w-3.5 h-3.5 text-slate-400 dark:text-gray-400' />
                        <span className='text-xs font-semibold text-slate-400 dark:text-gray-400 uppercase tracking-wider'>
                          People
                        </span>
                      </div>
                    )}
                    {filteredUsers.map(user => (
                      <div
                        key={user._id}
                        onClick={() => handleUserClick(user._id)}
                        className='flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-700 cursor-pointer transition-colors'
                      >
                        <img
                          src={user.profile_picture}
                          alt=''
                          className='w-10 h-10 rounded-full object-cover shadow-sm shrink-0'
                        />
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-semibold text-slate-800 dark:text-gray-100 flex items-center gap-1'>
                            {highlightMatch(user.full_name, q)}
                            {user.is_verified && <BadgeCheck className='w-3.5 h-3.5 text-blue-500 shrink-0' />}
                          </p>
                          <p className='text-xs text-slate-400 dark:text-gray-400 truncate'>
                            @{highlightMatch(user.username, q)}
                            {user.location && (
                              <span className='ml-2 inline-flex items-center gap-0.5'>
                                <MapPin className='w-3 h-3' />
                                {user.location}
                              </span>
                            )}
                          </p>
                        </div>
                        <span className='text-xs text-slate-400 dark:text-gray-400 shrink-0'>
                          {user.followers?.length || 0} followers
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Divider between sections in 'all' tab */}
                {activeTab === 'all' && filteredUsers.length > 0 && filteredPosts.length > 0 && (
                  <div className='border-t border-gray-100 dark:border-gray-700 mx-4' />
                )}

                {/* Posts results */}
                {showPosts && filteredPosts.length > 0 && (
                  <div>
                    {activeTab === 'all' && (
                      <div className='px-4 pt-3 pb-1 flex items-center gap-2'>
                        <FileText className='w-3.5 h-3.5 text-slate-400 dark:text-gray-400' />
                        <span className='text-xs font-semibold text-slate-400 dark:text-gray-400 uppercase tracking-wider'>
                          Posts
                        </span>
                      </div>
                    )}
                    {filteredPosts.map(post => (
                      <div
                        key={post._id}
                        onClick={() => handlePostClick(post)}
                        className='flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-700 cursor-pointer transition-colors'
                      >
                        <img
                          src={post.user.profile_picture}
                          alt=''
                          className='w-8 h-8 rounded-full object-cover shadow-sm shrink-0 mt-0.5'
                        />
                        <div className='flex-1 min-w-0'>
                          <p className='text-xs font-semibold text-slate-600 dark:text-gray-300 mb-0.5'>
                            {post.user.full_name} . {moment(post.createdAt).fromNow()}
                          </p>
                          <p className='text-sm text-slate-800 dark:text-gray-100 line-clamp-2 leading-relaxed'>
                            {highlightMatch(post.content, q)}
                          </p>
                          {post.image_urls?.length > 0 && (
                            <img
                              src={post.image_urls[0]}
                              alt=''
                              className='mt-2 h-16 w-24 object-cover rounded-lg'
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No results */}
                {!hasResults && q && (
                  <div className='text-center py-14'>
                    <Search className='w-10 h-10 text-slate-200 dark:text-gray-600 mx-auto mb-3' />
                    <p className='text-slate-500 dark:text-gray-300 font-medium'>No results for "{query}"</p>
                    <p className='text-slate-400 dark:text-gray-400 text-sm mt-1'>
                      Try searching for a name, username, or keyword
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty state - before typing */}
          {!q && (
            <div className='px-5 sm:px-6 py-7 sm:py-8'>
              <p className='text-sm text-slate-500 dark:text-gray-300 font-medium mb-3'>Try searching</p>
              <div className='flex flex-wrap gap-2'>
                {trendingTags.length > 0 ? trendingTags.map((tag, idx) => (
                  <button
                    key={`${tag}-${idx}`}
                    onClick={() => setQuery(tag)}
                    className='px-3 py-1.5 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-200 text-sm hover:bg-slate-200 dark:hover:bg-gray-600 transition cursor-pointer'
                  >
                    {tag}
                  </button>
                )) : (
                  <p className='text-slate-400 dark:text-gray-400 text-sm'>Find people, posts, and hashtags</p>
                )}
              </div>
              <p className='text-xs text-slate-400 dark:text-gray-400 mt-5'>Press Esc to close</p>
            </div>
          )}
        </div>
      </div>

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          likes={Array.isArray(selectedPost.likes_count) ? selectedPost.likes_count : []}
          onToggleLike={() => {}}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  )
}

export default GlobalSearch
