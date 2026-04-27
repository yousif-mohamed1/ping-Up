import React from 'react'

const PostCardSkeleton = () => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-4
      w-full max-w-2xl animate-pulse'>

      {/* User info row */}
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full bg-slate-200 dark:bg-gray-700 shrink-0' />
        <div className='flex-1 space-y-2'>
          <div className='h-3.5 bg-slate-200 dark:bg-gray-700 rounded-full w-32' />
          <div className='h-3 bg-slate-200 dark:bg-gray-700 rounded-full w-24' />
        </div>
      </div>

      {/* Content lines */}
      <div className='space-y-2'>
        <div className='h-3 bg-slate-200 dark:bg-gray-700 rounded-full w-full' />
        <div className='h-3 bg-slate-200 dark:bg-gray-700 rounded-full w-5/6' />
        <div className='h-3 bg-slate-200 dark:bg-gray-700 rounded-full w-4/6' />
      </div>

      {/* Image placeholder */}
      <div className='w-full h-48 bg-slate-200 dark:bg-gray-700 rounded-lg' />

      {/* Actions row */}
      <div className='flex items-center gap-4 pt-2 border-t
        border-gray-100 dark:border-gray-700'>
        <div className='h-3 bg-slate-200 dark:bg-gray-700 rounded-full w-12' />
        <div className='h-3 bg-slate-200 dark:bg-gray-700 rounded-full w-12' />
        <div className='h-3 bg-slate-200 dark:bg-gray-700 rounded-full w-12' />
      </div>
    </div>
  )
}

export default PostCardSkeleton
