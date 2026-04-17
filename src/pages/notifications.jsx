import React, { useEffect, useState } from 'react'
import { dummyNotificationsData } from '../assets/assets'
import { Heart, MessageCircle, UserPlus, AtSign, Bell, CheckCheck } from 'lucide-react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import NotificationSkeleton from '../compnents/skeletons/NotificationSkeleton'
import EmptyState from '../compnents/EmptyState'

const getNotificationIcon = (type) => {
  switch (type) {
    case 'like':
      return <div className='w-8 h-8 rounded-full bg-red-100 flex items-center justify-center'>
        <Heart className='w-4 h-4 text-red-500 fill-red-500' />
      </div>
    case 'comment':
      return <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
        <MessageCircle className='w-4 h-4 text-blue-500' />
      </div>
    case 'follow':
      return <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center'>
        <UserPlus className='w-4 h-4 text-green-500' />
      </div>
    case 'mention':
      return <div className='w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center'>
        <AtSign className='w-4 h-4 text-purple-500' />
      </div>
    default:
      return <div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center'>
        <Bell className='w-4 h-4 text-gray-500' />
      </div>
  }
}

const Notifications = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState(dummyNotificationsData)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900)
    return () => clearTimeout(timer)
  }, [])

  const unreadCount = notifications.filter(n => !n.seen).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, seen: true })))
  }

  const markOneRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n._id === id ? { ...n, seen: true } : n)
    )
  }

  // Group by Today / This Week / Earlier
  const now = moment()
  const groups = {
    'Today': notifications.filter(n => moment(n.createdAt).isSame(now, 'day')),
    'This Week': notifications.filter(n =>
      moment(n.createdAt).isSame(now, 'week') && !moment(n.createdAt).isSame(now, 'day')
    ),
    'Earlier': notifications.filter(n => !moment(n.createdAt).isSame(now, 'week')),
  }

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-2xl mx-auto'>

        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900 dark:text-gray-100'>Notifications</h1>
            <p className='text-slate-500 dark:text-gray-400 text-sm mt-0.5'>
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition cursor-pointer'
            >
              <CheckCheck className='w-4 h-4' />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notification Groups */}
        <div className='space-y-6'>
          {isLoading
            ? <NotificationSkeleton />
            : Object.entries(groups).map(([groupLabel, items]) => {
                if (items.length === 0) return null
                return (
                  <div key={groupLabel}>
                    <h2 className='text-xs font-semibold text-slate-400 dark:text-gray-400 uppercase
                      tracking-wider mb-2 px-1'>
                      {groupLabel}
                    </h2>
                    <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700
                      shadow-sm dark:shadow-gray-900 overflow-hidden'>
                      {items.map((notification, index) => (
                        <div
                          key={notification._id}
                          onClick={() => {
                            markOneRead(notification._id)
                            if (notification.type === 'follow') {
                              navigate(`/profile/${notification.user._id}`)
                            }
                          }}
                          className={`flex items-start gap-4 px-5 py-4 cursor-pointer
                            transition-colors hover:bg-slate-50 dark:hover:bg-gray-700
                            ${!notification.seen ? 'bg-indigo-50/60 dark:bg-indigo-900/20' : ''}
                            ${index !== items.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}
                          `}
                        >
                          {/* User avatar + type icon */}
                          <div className='relative shrink-0'>
                            <img
                              src={notification.user.profile_picture}
                              alt=''
                              className='w-11 h-11 rounded-full object-cover'
                            />
                            <div className='absolute -bottom-1 -right-1'>
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm text-slate-800 dark:text-gray-100'>
                              <span className='font-semibold'>
                                {notification.user.full_name}
                              </span>
                              {' '}{notification.message}
                            </p>
                            {notification.post_preview && (
                              <p className='text-xs text-slate-500 dark:text-gray-400 mt-0.5 truncate'>
                                "{notification.post_preview}"
                              </p>
                            )}
                            {notification.comment_text && (
                              <p className='text-xs text-slate-600 dark:text-gray-300 mt-1 bg-slate-100 dark:bg-gray-700
                                px-2 py-1 rounded-lg inline-block'>
                                {notification.comment_text}
                              </p>
                            )}
                            <p className='text-xs text-slate-400 dark:text-gray-500 mt-1'>
                              {moment(notification.createdAt).fromNow()}
                            </p>
                          </div>

                          {/* Unread dot */}
                          {!notification.seen && (
                            <div className='w-2.5 h-2.5 rounded-full bg-indigo-500
                              shrink-0 mt-1.5' />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
        </div>

        {/* Empty state */}
        {!isLoading && notifications.length === 0 && (
          <EmptyState
            icon={Bell}
            title='No notifications yet'
            description="When someone likes or comments on your posts, you'll see it here."
          />
        )}

      </div>
    </div>
  )
}

export default Notifications
