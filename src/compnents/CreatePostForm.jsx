import React, { useEffect, useRef, useState } from 'react'
import { AtSign, ChevronDown, Globe, ImagePlus, Lock, Smile, Sparkles, Users, Video } from 'lucide-react'

const CreatePostForm = ({
  user,
  content,
  onContentChange,
  previewUrl,
  previewType,
  onMediaUpload,
  onSubmit,
  isEditing,
}) => {
  const MAX_CHARS = 280
  const EMOJIS = ['😀', '😂', '😍', '🔥', '🎉', '🙌', '🤝', '❤️', '👍', '😎', '🥳', '🤍']
  const [audience, setAudience] = useState('Public')
  const [audienceOpen, setAudienceOpen] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [customEmoji, setCustomEmoji] = useState('')
  const audienceRef = useRef(null)
  const emojiRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (audienceOpen && audienceRef.current && !audienceRef.current.contains(event.target)) {
        setAudienceOpen(false)
      }

      if (emojiOpen && emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [audienceOpen, emojiOpen])

  const renderContentWithHashtags = (text) => {
    if (!text) return null
    const parts = text.split(/(#[\p{L}\p{N}_]+)/gu)
    return parts.map((part, i) =>
      /^#[\p{L}\p{N}_]+$/u.test(part)
        ? <span key={i} className='text-indigo-500'>{part}</span>
        : <React.Fragment key={i}>{part}</React.Fragment>
    )
  }

  const insertAtCursor = (value) => {
    const el = textareaRef.current
    if (!el) {
      onContentChange(`${content}${value}`)
      return
    }

    const start = el.selectionStart ?? content.length
    const end = el.selectionEnd ?? content.length
    const next = `${content.slice(0, start)}${value}${content.slice(end)}`
    onContentChange(next)

    requestAnimationFrame(() => {
      const cursor = start + value.length
      el.focus()
      el.setSelectionRange(cursor, cursor)
    })
  }

  const handleEmojiPick = (emoji) => {
    insertAtCursor(` ${emoji} `)
    setEmojiOpen(false)
  }

  const handleCustomEmojiAdd = () => {
    const value = customEmoji.trim()
    if (!value) return
    insertAtCursor(` ${value} `)
    setCustomEmoji('')
    setEmojiOpen(false)
  }

  return (
    <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
      <div className='flex items-center gap-3'>
        <img
          src={user.profile_picture}
          alt={user.full_name}
          className='h-12 w-12 rounded-full object-cover'
        />
        <div>
          <h2 className='text-lg font-semibold text-slate-900'>{user.full_name}</h2>
          <p className='text-sm text-slate-500'>@{user.username}</p>
        </div>
      </div>

      <div className='relative mb-3' ref={audienceRef}>
        <button
          onClick={() => setAudienceOpen(prev => !prev)}
          className='flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100
      hover:bg-slate-200 transition text-xs text-slate-600 font-medium cursor-pointer'
          type='button'
        >
          {audience === 'Public'
            ? <Globe className='w-3 h-3' />
            : audience === 'Connections only'
              ? <Users className='w-3 h-3' />
              : <Lock className='w-3 h-3' />
          }
          {audience}
          <ChevronDown className='w-3 h-3' />
        </button>
        {audienceOpen && (
          <div className='absolute top-8 left-0 bg-white border border-gray-200
      rounded-xl shadow-lg z-10 w-48 overflow-hidden'>
            {['Public', 'Connections only', 'Only me'].map(opt => (
              <button
                key={opt}
                onClick={() => { setAudience(opt); setAudienceOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm transition
            hover:bg-slate-50 flex items-center gap-2
            ${audience === opt ? 'text-indigo-600 font-medium bg-indigo-50' : 'text-slate-700'}`}
                type='button'
              >
                {opt === 'Public' && <Globe className='w-4 h-4' />}
                {opt === 'Connections only' && <Users className='w-4 h-4' />}
                {opt === 'Only me' && <Lock className='w-4 h-4' />}
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className='relative mt-5'>
        <div
          aria-hidden='true'
          className='absolute inset-0 px-3 py-2 text-sm text-slate-800
      whitespace-pre-wrap break-words pointer-events-none select-none
      leading-relaxed'
        >
          {renderContentWithHashtags(content)}
          <span className='opacity-0'>|</span>
        </div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          rows={4}
          placeholder="What's happening?"
          className='w-full resize-none border-none text-base placeholder:text-slate-400 focus:outline-none text-transparent caret-slate-800 bg-transparent relative'
        />
      </div>

      <div className='flex justify-end px-1 mt-1'>
        <span className={`text-xs font-medium transition-colors ${
          content.length >= MAX_CHARS ? 'text-red-500' :
          content.length >= MAX_CHARS - 30 ? 'text-orange-400' :
          'text-slate-400'
        }`}>
          {content.length}/{MAX_CHARS}
        </span>
      </div>

      {previewUrl && (
        <div className='mt-2 overflow-hidden rounded-lg border border-slate-200'>
          {previewType === 'image' ? (
            <img src={previewUrl} alt='Selected media' className='max-h-80 w-full object-cover' />
          ) : (
            <video src={previewUrl} controls className='max-h-80 w-full object-cover' />
          )}
        </div>
      )}

      <div className='mt-2 flex items-center justify-between border-t border-slate-200 pt-3'>
        <div className='inline-flex items-center gap-1'>
          <label className='inline-flex cursor-pointer items-center rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700' title='Add photo'>
            <input
              type='file'
              accept='image/*'
              onChange={onMediaUpload}
              className='hidden'
            />
            <ImagePlus className='h-5 w-5' />
          </label>

          <label className='inline-flex cursor-pointer items-center rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700' title='Add video'>
            <input
              type='file'
              accept='video/*'
              onChange={onMediaUpload}
              className='hidden'
            />
            <Video className='h-5 w-5' />
          </label>

          <div className='relative' ref={emojiRef}>
            <button
              type='button'
              onClick={() => setEmojiOpen(prev => !prev)}
              className='p-2 rounded-lg hover:bg-slate-100 transition text-slate-500 cursor-pointer'
              title='Add emoji'
            >
              <Smile className='w-5 h-5' />
            </button>

            {emojiOpen && (
              <div className='absolute bottom-11 left-0 w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-lg z-20'>
                <p className='mb-2 text-xs font-medium text-slate-500'>Pick an emoji</p>
                <div className='grid grid-cols-6 gap-1 mb-2'>
                  {EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      type='button'
                      onClick={() => handleEmojiPick(emoji)}
                      className='rounded-md p-1.5 text-lg hover:bg-slate-100 transition'
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className='flex items-center gap-1'>
                  <input
                    value={customEmoji}
                    onChange={(e) => setCustomEmoji(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleCustomEmojiAdd()
                      }
                    }}
                    placeholder='Type emoji'
                    className='w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  />
                  <button
                    type='button'
                    onClick={handleCustomEmojiAdd}
                    className='rounded-md bg-indigo-500 px-2 py-1.5 text-xs font-medium text-white hover:bg-indigo-600 transition'
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            type='button'
            onClick={() => insertAtCursor(' #')}
            className='p-2 rounded-lg hover:bg-slate-100 transition text-slate-500 cursor-pointer'
            title='Add hashtag'
          >
            <AtSign className='w-5 h-5' />
          </button>
        </div>

        <button
          type='button'
          onClick={onSubmit}
          disabled={content.length > MAX_CHARS}
          className='rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-2 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02] active:scale-95'
        >
          <span className='inline-flex items-center gap-2'>
            <Sparkles className='h-4 w-4' /> {isEditing ? 'Update Post' : 'Create Post'}
          </span>
        </button>
      </div>
    </div>
  )
}

export default CreatePostForm