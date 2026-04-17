import React from 'react'
import {
  dummyConnectionsData as connections,
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyPendingConnectionsData as pendingConnections,
} from '../assets/assets'
import { Users, UserPlus, UserCheck, UserRoundPen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import EmptyState from '../compnents/EmptyState'

const Connections = () => {
  const [currentTab, setCurrentTab] = React.useState('followers')
  const navigate = useNavigate()

  const dataArray = [
    { label: 'followers', value: followers, icon: Users, count: followers.length },
    { label: 'following', value: following, icon: UserCheck, count: following.length },
    { label: 'pending', value: pendingConnections, icon: UserRoundPen, count: pendingConnections.length },
    { label: 'all connections', value: connections, icon: UserPlus, count: connections.length },
  ]

  const getSecondaryActionLabel = () => {
    if (currentTab === 'pending') {
      return 'Accept'
    }

    if (currentTab === 'following' || currentTab === 'followers' || currentTab === 'all connections') {
      return 'Message'
    }

    return null
  }

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-gray-950'>
      <div className='max-w-6xl mx-auto p-4 sm:p-6'>

        {/* Title Section */}
        <div className='mb-8'>
          <h1 className='text-3xl sm:text-4xl font-bold text-slate-900 dark:text-gray-100 mb-2'>Connections</h1>
          <p className='text-slate-600 dark:text-gray-300 text-lg'>Manage your connections and discover new ones</p>
        </div>

        {/* Counts */}
        <div className='mb-8 flex flex-wrap gap-3 sm:gap-6'>
          {dataArray.map((item, index) => (
            <div key={index} className='flex flex-col items-center justify-center gap-1 border h-20 w-[46%] sm:w-40 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 rounded-md'>
              <b>{item.value.length}</b>
              <p className='text-slate-600 dark:text-gray-300'>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className='inline-flex max-w-full overflow-x-auto no-scrollbar items-center border border-gray-200 dark:border-gray-700 rounded-md p-1 bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900'>
          {dataArray.map((tab) => (
            <button
              onClick={() => setCurrentTab(tab.label)}
              key={tab.label}
              className={`cursor-pointer shrink-0 flex items-center px-3 py-1 text-sm rounded-md transition-colors ${currentTab === tab.label ? 'bg-white dark:bg-gray-800 font-medium text-black dark:text-gray-100' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-100'}`}
            >
              <tab.icon className='w-4 h-4' />
              <span className='ml-1'>{tab.label}</span>
              {tab.count !== undefined && (
                <span className='ml-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-full'>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Connections */}
        <div className='flex flex-wrap gap-4 sm:gap-6 mt-6'>
          {dataArray.find(item => item.label === currentTab).value.length === 0
            ? <EmptyState
                icon={Users}
                title={`No ${currentTab} yet`}
                description={
                  currentTab === 'followers'
                    ? 'No one is following you yet. Share your profile to grow your audience.'
                    : currentTab === 'following'
                      ? "You're not following anyone yet. Discover people to follow."
                      : currentTab === 'pending'
                        ? 'No pending connection requests.'
                        : 'No connections yet. Start connecting with people.'
                }
                actionLabel={currentTab !== 'pending' ? 'Discover People' : undefined}
                onAction={currentTab !== 'pending' ? () => navigate('/discover') : undefined}
              />
            : dataArray.find(item => item.label === currentTab).value.map((user) => (
                <div key={user._id} className='w-full max-w-full sm:max-w-88 flex gap-3 sm:gap-5 p-4 sm:p-6 bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 rounded-md'>
                  <img src={user.profile_picture} alt='' className='rounded-full w-12 h-12 shadow-md mx-auto' />
                  <div className='flex-1'>
                    <p className='font-medium text-slate-700 dark:text-gray-200'>{user.full_name}</p>
                    <p className='text-slate-500 dark:text-gray-400'>@{user.username}</p>
                    <p className='text-sm text-gray-600 dark:text-gray-300'>{user.bio?.slice(0, 30)}...</p>
                    <div className='flex max-sm:flex-col gap-2 mt-4'>
                      <button
                        className='cursor-pointer px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-600 text-white text-sm font-medium shadow-sm hover:from-indigo-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all'
                        onClick={() => navigate(`/profile/${user._id}`)}
                      >
                        View Profile
                      </button>
                      {getSecondaryActionLabel() && (
                        <button
                          className='cursor-pointer px-4 py-2 rounded-md border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-200 text-sm hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors'
                        >
                          {getSecondaryActionLabel()}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
        </div>

      </div>
    </div>
  )
}

export default Connections
