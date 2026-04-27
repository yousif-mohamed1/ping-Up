import React from 'react'
import { ImagePlus, Sparkles, Video } from 'lucide-react'

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

      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        rows={4}
        placeholder="What's happening?"
        className='mt-5 w-full resize-none border-none bg-transparent text-base text-slate-700 placeholder:text-slate-400 focus:outline-none'
      />

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
        <label className='inline-flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700'>
          <input
            type='file'
            accept='image/*,video/*'
            onChange={onMediaUpload}
            className='hidden'
          />
          <ImagePlus className='h-5 w-5' />
          <Video className='h-5 w-5' />
        </label>

        <button
          type='button'
          onClick={onSubmit}
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