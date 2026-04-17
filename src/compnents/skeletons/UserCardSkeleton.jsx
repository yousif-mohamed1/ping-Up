import React from 'react'

const UserCardSkeleton = () => {
  return (
    <div className='rounded-xl border border-[#e5e8ef] dark:border-gray-700
      bg-white dark:bg-gray-800 p-5 shadow animate-pulse'>

      {/* Avatar */}
      <div className='mx-auto w-16 h-16 rounded-full
        bg-slate-200 dark:bg-gray-700' />

      {/* Name + username */}
      <div className='mt-3 flex flex-col items-center gap-2'>
        <div className='h-4 bg-slate-200 dark:bg-gray-700 rounded-full w-28' />
        <div className='h-3 bg-slate-200 dark:bg-gray-700 rounded-full w-20' />
      </div>

      {/* Bio lines */}
      <div className='mt-3 space-y-2 flex flex-col items-center'>
        <div className='h-3 bg-slate-200 dark:bg-gray-700 rounded-full w-40' />
        <div className='h-3 bg-slate-200 dark:bg-gray-700 rounded-full w-32' />
        <div className='h-3 bg-slate-200 dark:bg-gray-700 rounded-full w-24' />
      </div>

      {/* Tags row */}
      <div className='mt-3.5 flex justify-center gap-2'>
        <div className='h-6 w-24 bg-slate-200 dark:bg-gray-700 rounded-full' />
        <div className='h-6 w-24 bg-slate-200 dark:bg-gray-700 rounded-full' />
      </div>

      {/* Button */}
      <div className='mt-4 h-10 bg-slate-200 dark:bg-gray-700 rounded-md w-full' />
    </div>
  )
}

export default UserCardSkeleton
