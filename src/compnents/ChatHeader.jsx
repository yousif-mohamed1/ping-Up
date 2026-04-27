import React from 'react'

const ChatHeader = ({ activeUser }) => {
  return (
    <div className='border-b border-slate-200 bg-white px-6 py-3'>
      <div className='inline-flex items-center gap-2'>
        <img
          src={activeUser.profile_picture}
          alt={activeUser.full_name}
          className='h-8 w-8 rounded-full object-cover'
        />
        <div className='leading-tight'>
          <h2 className='text-sm font-semibold text-slate-900'>{activeUser.full_name}</h2>
          <p className='text-xs text-slate-500'>@{activeUser.username}</p>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader