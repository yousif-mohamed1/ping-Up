import React from 'react'
import { ImagePlus, SendHorizontal } from 'lucide-react'

const ChatComposer = ({ inputValue, onInputChange, onSendMessage }) => {
  return (
    <div className='border-t border-slate-200 bg-white px-6 py-3'>
      <div className='mx-auto flex w-full max-w-3xl items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5'>
        <input
          type='text'
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onSendMessage()
            }
          }}
          placeholder='Type a message...'
          className='h-9 flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none'
        />

        <button
          type='button'
          className='rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 cursor-pointer'
          aria-label='Upload image'
          title='Upload image'
        >
          <ImagePlus className='h-5 w-5' />
        </button>

        <button
          type='button'
          onClick={onSendMessage}
          className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-500 text-white transition-colors hover:bg-violet-600 cursor-pointer'
          aria-label='Send message'
          title='Send message'
        >
          <SendHorizontal className='h-4 w-4' />
        </button>
      </div>
    </div>
  )
}

export default ChatComposer