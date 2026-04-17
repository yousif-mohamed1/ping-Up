import React from 'react'
import { dummyConnectionsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { Eye, MessageCircle, MessageSquare } from 'lucide-react'
import EmptyState from '../compnents/EmptyState'

const massges = () => {
  const navigate = useNavigate()

  const handleUserClick = (userId) => {
    navigate(`/messages/${userId}`)
  }

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-gray-900 py-6 sm:py-8'>
      <div className='max-w-2xl mx-auto px-3 sm:px-6 lg:px-8'>
        {/* Title Section */}
        <div className='mb-8'>
          <h1 className='text-3xl sm:text-4xl font-bold text-slate-900 dark:text-gray-100 mb-2'>Messages</h1>
          <p className='text-slate-600 dark:text-gray-300 text-lg'>Talk to your friends and family</p>
        </div>

        {/* Users List */}
        <div className='space-y-4'>
          {dummyConnectionsData.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user._id)}
              className='flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 hover:shadow-md hover:bg-slate-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer'
            >
              {/* Profile Picture */}
              <img
                src={user.profile_picture}
                alt={user.full_name}
                className='w-14 h-14 rounded-full object-cover flex-shrink-0 shadow-sm'
              />

              {/* User Info */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                  <h3 className='text-lg font-semibold text-slate-900 dark:text-gray-100'>
                    {user.full_name}
                  </h3>
                </div>
                <p className='text-sm text-slate-500 dark:text-gray-400 mb-2'>@{user.username}</p>
                <p className='text-sm text-slate-600 dark:text-gray-300 line-clamp-2'>
                  {user.bio}
                </p>
              </div>
              <div className='flex flex-col gap-2 mt-4'>
              <button onClick={() => navigate(`/messages/${user._id}`)} className='size-10 flex items-center justify-center text-sm
              rounded bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-800 dark:text-gray-100
              active:scale-95 transtion cursor-pointer gap-1'>
                <MessageSquare className='w-4 h-4'/>
              </button>

             <button onClick={() => navigate(`/profile/${user._id}`)} className='size-10 flex items-center justify-center text-sm
              rounded bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-800 dark:text-gray-100
              active:scale-95 transtion cursor-pointer '>
                <Eye className='w-4 h-4'/>
              </button>

              </div>

            </div>
          ))}

          {dummyConnectionsData.length === 0 && (
            <EmptyState
              icon={MessageCircle}
              title='No conversations yet'
              description='Start a conversation with someone from your connections.'
              actionLabel='Find People'
              onAction={() => navigate('/discover')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default massges
