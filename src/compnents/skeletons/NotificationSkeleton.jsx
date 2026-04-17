import React from 'react'

const NotificationSkeleton = () => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl border
      border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden
      animate-pulse'>
      {[1, 2, 3].map(i => (
        <div key={i} className={`flex items-start gap-4 px-5 py-4
          ${i !== 3 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
          <div className='w-11 h-11 rounded-full bg-slate-200 dark:bg-gray-700 shrink-0' />
          <div className='flex-1 space-y-2'>
            <div className='h-3.5 bg-slate-200 dark:bg-gray-700 rounded-full w-48' />
            <div className='h-3 bg-slate-200 dark:bg-gray-700 rounded-full w-32' />
            <div className='h-3 bg-slate-200 dark:bg-gray-700 rounded-full w-20' />
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotificationSkeleton
