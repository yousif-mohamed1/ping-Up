import React from 'react'
import { Send, Image, Video, Smartphone, X } from 'lucide-react'

function ChatBoxInputBar({
  mediaPreview,
  mediaType,
  handleRemoveMedia,
  handleFileSelect,
  handleOpenCamera,
  inputRef,
  input,
  setInput,
  handleKeyDown,
  handleSend
}) {
  return (
    <div className='px-3 sm:px-4 py-3 bg-white border-t border-gray-200 shrink-0'>
      {mediaPreview && (
        <div className='mb-2 flex items-center gap-2 p-2 bg-slate-100 rounded-lg'>
          {mediaType === 'image' ? (
            <img src={mediaPreview} alt='preview' className='h-12 w-12 rounded object-cover' />
          ) : (
            <video src={mediaPreview} className='h-12 w-12 rounded object-cover' />
          )}
          <span className='text-xs text-slate-600 flex-1'>
            {mediaType === 'image' ? 'Photo' : 'Video'} ready to send
          </span>
          <button onClick={handleRemoveMedia} className='p-1 hover:bg-slate-200 rounded transition'>
            <X className='w-4 h-4 text-slate-600' />
          </button>
        </div>
      )}

      <div className='flex items-center gap-0.5 sm:gap-1 mb-2'>
        <label className='p-2 hover:bg-slate-200 rounded-lg transition text-slate-500 cursor-pointer' title='Upload image'>
          <Image className='w-5 h-5' />
          <input type='file' accept='image/*' onChange={handleFileSelect} className='hidden' />
        </label>
        <label className='p-2 hover:bg-slate-200 rounded-lg transition text-slate-500 cursor-pointer' title='Upload video'>
          <Video className='w-5 h-5' />
          <input type='file' accept='video/*' onChange={handleFileSelect} className='hidden' />
        </label>
        <button
          onClick={handleOpenCamera}
          type='button'
          className='p-2 hover:bg-slate-200 rounded-lg transition text-slate-500 cursor-pointer'
          title='Open camera'
        >
          <Smartphone className='w-5 h-5' />
        </button>
      </div>

      <div className='flex items-center gap-2'>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Type a message...'
          className='flex-1 min-w-0 bg-slate-100 text-sm text-slate-800
              placeholder:text-slate-400 focus:outline-none py-2.5 px-4 rounded-xl'
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() && !mediaPreview}
          type='button'
          className={`p-2.5 rounded-xl transition-all duration-150 shrink-0
              ${input.trim() || mediaPreview
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
        >
          <Send className='w-4 h-4' />
        </button>
      </div>
    </div>
  )
}

export default ChatBoxInputBar
