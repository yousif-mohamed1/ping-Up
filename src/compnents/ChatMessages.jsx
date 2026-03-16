import React from 'react'

const ChatMessages = ({ chatMessages, currentUserId, formatTime, onOpenMedia }) => {
  return (
    <div className='flex-1 overflow-y-auto px-6 py-4'>
      <div className='space-y-4'>
        {chatMessages.map((message) => {
          const isMyMessage = message.from_user_id === currentUserId
          const wrapperAlign = isMyMessage ? 'justify-start' : 'justify-end'
          const bubbleBase = 'rounded-lg bg-white px-3 py-2 text-sm text-slate-700 shadow-sm'
          const isMediaMessage = (message.message_type === 'image' || message.message_type === 'video') && message.media_url

          return (
            <div key={message._id} className={`flex ${wrapperAlign}`}>
              <div className='max-w-xs sm:max-w-sm'>
                {isMediaMessage ? (
                  <div className='rounded-lg bg-white p-2 shadow-sm'>
                    <button
                      type='button'
                      onClick={() => onOpenMedia({ url: message.media_url, type: message.message_type })}
                      className='w-full cursor-pointer overflow-hidden rounded-md'
                    >
                      {message.message_type === 'video' ? (
                        <video src={message.media_url} className='h-44 w-full object-cover' />
                      ) : (
                        <img src={message.media_url} alt='Chat media' className='h-44 w-full object-cover' />
                      )}
                    </button>
                    <p className='mt-1 text-right text-[10px] text-slate-400'>{formatTime(message.createdAt)}</p>
                  </div>
                ) : (
                  <>
                    <div className={bubbleBase}>{message.text}</div>
                    <p className='mt-1 text-[10px] text-slate-400'>{formatTime(message.createdAt)}</p>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ChatMessages