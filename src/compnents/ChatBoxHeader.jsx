import React from 'react'
import { ArrowLeft } from 'lucide-react'

function ChatBoxHeader({ navigate, otherUser }) {
  return (
    <div className='flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 bg-white border-b border-gray-200 shadow-sm shrink-0'>
      <button
        onClick={() => navigate('/messages')}
        className='p-2 rounded-lg hover:bg-gray-100 transition text-gray-500 cursor-pointer'
      >
        <ArrowLeft className='w-5 h-5' />
      </button>
      <img
        src={otherUser?.profile_picture || null}
        alt=''
        className='w-10 h-10 rounded-full object-cover shadow-sm'
      />
      <div className='min-w-0'>
        <p className='font-semibold text-slate-800 text-sm'>{otherUser?.full_name}</p>
        <p className='text-xs text-green-500 font-medium'>Online</p>
      </div>
    </div>
  )
}

export default ChatBoxHeader
