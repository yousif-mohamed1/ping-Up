import React, { useState, useEffect, useRef } from 'react'
import { X, Heart, Send, BadgeCheck } from 'lucide-react'
import moment from 'moment'
import { dummyUserData } from '../assets/assets'

const PostDetailModal = ({ post, onClose, likes = [], onToggleLike }) => {
  const [comments, setComments] = useState([])
  const [commentInput, setCommentInput] = useState('')
  const inputRef = useRef(null)
  const currentUser = dummyUserData
  const safeLikes = Array.isArray(likes) ? likes : []
  const isLiked = safeLikes.includes(currentUser._id)

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Focus comment input on open
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  const handleLike = () => {
    onToggleLike?.()
  }

  const handleAddComment = () => {
    if (!commentInput.trim()) return
    const newComment = {
      _id: `c_${Date.now()}`,
      user: currentUser,
      text: commentInput.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    }
    setComments(prev => [...prev, newComment])
    setCommentInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddComment()
    }
  }

  const renderContentWithHashtags = (content) => {
    if (!content) return null
    const parts = content.split(/(#[\p{L}\p{N}_]+)/gu)
    return parts.map((part, i) =>
      /^#[\p{L}\p{N}_]+$/u.test(part)
        ? <span key={i} className='text-indigo-500 cursor-pointer'>{part}</span>
        : <React.Fragment key={i}>{part}</React.Fragment>
    )
  }

  return (
    // Backdrop
    <div
      className='fixed inset-0 z-50 bg-black/70 backdrop-blur-sm
        flex items-center justify-center p-4'
      onClick={onClose}
    >
      {/* Modal panel - stop click from closing when clicking inside */}
      <div
        className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900 w-full max-w-2xl
          max-h-[90vh] flex flex-col overflow-hidden'
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-5 py-4
          border-b border-gray-100 dark:border-gray-700 shrink-0'>
          <div className='flex items-center gap-3'>
            <img
              src={post.user.profile_picture}
              alt=''
              className='w-10 h-10 rounded-full object-cover shadow-sm'
            />
            <div>
              <p className='font-semibold text-slate-800 dark:text-gray-100 text-sm flex items-center gap-1'>
                {post.user.full_name}
                <BadgeCheck className='w-4 h-4 text-blue-500' />
              </p>
              <p className='text-xs text-slate-400 dark:text-gray-500'>
                @{post.user.username} . {moment(post.createdAt).fromNow()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition
              text-gray-400 cursor-pointer'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Scrollable content */}
        <div className='flex-1 overflow-y-auto no-scrollbar'>

          {/* Post content */}
          <div className='px-5 py-4'>
            {post.content && (
              <p className='text-slate-800 dark:text-gray-100 text-sm leading-relaxed whitespace-pre-line'>
                {renderContentWithHashtags(post.content)}
              </p>
            )}
          </div>

          {/* Post media */}
          {post.image_urls?.length > 0 && (
            <div className={`grid gap-1 px-5 pb-4 ${
              post.image_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            }`}>
              {post.image_urls.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=''
                  className={`w-full object-cover rounded-xl
                    ${post.image_urls.length === 1 ? 'max-h-80' : 'h-48'}`}
                />
              ))}
            </div>
          )}
          {post.video_url && (
            <div className='px-5 pb-4'>
              <video
                src={post.video_url}
                controls
                className='w-full rounded-xl'
              />
            </div>
          )}

          {/* Like + comment counts */}
          <div className='flex items-center gap-4 px-5 py-3
            border-t border-gray-100 dark:border-gray-700 text-sm text-slate-500 dark:text-gray-400'>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition cursor-pointer
                ${isLiked ? 'text-red-500' : 'hover:text-red-400'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
              <span>{safeLikes.length} {safeLikes.length === 1 ? 'like' : 'likes'}</span>
            </button>
            <span className='flex items-center gap-1.5'>
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </span>
          </div>

          {/* Comments list */}
          <div className='px-5 pb-4 space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4'>
            {comments.map(comment => (
              <div key={comment._id} className='flex items-start gap-3'>
                <img
                  src={comment.user.profile_picture}
                  alt=''
                  className='w-8 h-8 rounded-full object-cover shrink-0 shadow-sm'
                />
                <div className='flex-1'>
                  <div className='bg-slate-50 dark:bg-gray-700 rounded-2xl px-4 py-2.5'>
                    <p className='text-xs font-semibold text-slate-800 dark:text-gray-100 mb-0.5'>
                      {comment.user.full_name}
                    </p>
                    <p className='text-sm text-slate-700 dark:text-gray-200 leading-relaxed'>
                      {renderContentWithHashtags(comment.text)}
                    </p>
                  </div>
                  <p className='text-xs text-slate-400 dark:text-gray-500 mt-1 px-1'>
                    {moment(comment.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            ))}

            {/* Empty comments state */}
            {comments.length === 0 && (
              <p className='text-center text-sm text-slate-400 dark:text-gray-500 py-4'>
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>

        {/* Comment input - pinned to bottom */}
        <div className='px-5 py-4 border-t border-gray-100 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-800'>
          <div className='flex items-center gap-3'>
            <img
              src={currentUser.profile_picture}
              alt=''
              className='w-8 h-8 rounded-full object-cover shadow-sm shrink-0'
            />
            <div className='flex-1 flex items-center gap-2 bg-slate-100 dark:bg-gray-700
              rounded-2xl px-4 py-2'>
              <input
                ref={inputRef}
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Write a comment...'
                className='flex-1 bg-transparent text-sm text-slate-800 dark:text-gray-100
                  placeholder:text-slate-400 dark:placeholder:text-gray-400 focus:outline-none min-w-0'
              />
              <button
                onClick={handleAddComment}
                disabled={!commentInput.trim()}
                className={`transition cursor-pointer shrink-0
                  ${commentInput.trim()
                    ? 'text-indigo-600 hover:text-indigo-700'
                    : 'text-slate-300 cursor-not-allowed'
                  }`}
              >
                <Send className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetailModal
