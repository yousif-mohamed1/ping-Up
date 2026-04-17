import React from 'react'
import moment from 'moment'

function ChatBoxMessages({ messages, otherUser, currentUser, bottomRef }) {
  return (
    <div className='flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 no-scrollbar'>
      {messages.map((msg, index) => {
        const isMe = msg.senderId === 'me'
        const showTimestamp =
          index === 0 ||
          moment(msg.createdAt).diff(moment(messages[index - 1].createdAt), 'minutes') > 10

        return (
          <React.Fragment key={msg._id}>
            {showTimestamp && (
              <div className='text-center text-xs text-gray-400 my-2'>
                {moment(msg.createdAt).calendar()}
              </div>
            )}
            <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && (
                <img
                  src={otherUser?.profile_picture || null}
                  alt=''
                  className='w-7 h-7 rounded-full object-cover shadow-sm shrink-0'
                />
              )}
              <div
                className={`max-w-[78%] sm:max-w-[70%] rounded-2xl overflow-hidden
                  ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-white text-slate-800 shadow-sm border border-gray-100 rounded-bl-sm'
                  }`}
              >
                {msg.media && (
                  <div className='w-full'>
                    {msg.mediaType === 'image' ? (
                      <img src={msg.media} alt='message' className='w-full h-auto block' />
                    ) : (
                      <video src={msg.media} controls className='w-full h-auto block' />
                    )}
                  </div>
                )}
                {msg.text && <div className='px-4 py-2.5 text-sm leading-relaxed'>{msg.text}</div>}
              </div>
              {isMe && (
                <img
                  src={currentUser?.profile_picture || null}
                  alt=''
                  className='w-7 h-7 rounded-full object-cover shadow-sm shrink-0'
                />
              )}
            </div>
          </React.Fragment>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}

export default ChatBoxMessages
