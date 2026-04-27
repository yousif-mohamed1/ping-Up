import React from 'react'

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => {
  return (
    <div className='flex flex-col items-center justify-center py-16 px-6 text-center'>
      <div className='w-16 h-16 rounded-2xl bg-slate-100 dark:bg-gray-700
        flex items-center justify-center mb-4'>
        <Icon className='w-8 h-8 text-slate-400 dark:text-gray-500' />
      </div>
      <h3 className='text-base font-semibold text-slate-700 dark:text-gray-200 mb-1'>
        {title}
      </h3>
      <p className='text-sm text-slate-400 dark:text-gray-500 max-w-xs leading-relaxed'>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className='mt-5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700
            text-white text-sm font-medium transition active:scale-95 cursor-pointer'
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState
