import React from 'react'
import {
  dummyConnectionsData as connections,
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyPendingConnectionsData as pendingConnections,
} from '../assets/assets'
import { Users, UserPlus, UserCheck, UserRoundPen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api, ensureDemoSession, normalizeUser } from '../services/api'

const Connections = () => {
  const [currentTab, setCurrentTab] = React.useState('followers')
  const [allUsers, setAllUsers] = React.useState(connections)
  const [followersList, setFollowersList] = React.useState(followers)
  const [followingList, setFollowingList] = React.useState(following)
  const navigate = useNavigate()

  React.useEffect(() => {
    const loadConnections = async () => {
      try {
        await ensureDemoSession()
        const me = normalizeUser(await api.users.me())
        const [users, apiFollowers, apiFollowing] = await Promise.all([
          api.users.list(),
          api.connections.followers(me._id),
          api.connections.following(me._id),
        ])
        setAllUsers(users.map(normalizeUser))
        setFollowersList(apiFollowers.map(normalizeUser))
        setFollowingList(apiFollowing.map(normalizeUser))
      } catch {
        setAllUsers(connections)
        setFollowersList(followers)
        setFollowingList(following)
      }
    }
    loadConnections()
  }, [])

  const dataArray = [
    { label: 'followers', value: followersList, icon: Users, count: followersList.length },
    { label: 'following', value: followingList, icon: UserCheck, count: followingList.length },
    { label: 'pending', value: pendingConnections, icon: UserRoundPen, count: pendingConnections.length },
    { label: 'all connections', value: allUsers, icon: UserPlus, count: allUsers.length },
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
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>

        {/* Title Section */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-slate-900 mb-2'>Connections</h1>
          <p className='text-slate-600 text-lg'>Manage your connections and discover new ones</p>
        </div>

        {/* Counts */}
        <div className='mb-8 flex flex-wrap gap-6'>
          {dataArray.map((item, index) => (
            <div key={index} className='flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md'>
              <b>{item.value.length}</b>
              <p className='text-slate-600'>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className='inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 bg-white shadow-sm'>
          {dataArray.map((tab) => (
            <button
              onClick={() => setCurrentTab(tab.label)}
              key={tab.label}
              className={`cursor-pointer flex items-center px-3 py-1 text-sm rounded-md transition-colors ${currentTab === tab.label ? 'bg-white font-medium text-black' : 'text-gray-500 hover:text-black'}`}
            >
              <tab.icon className='w-4 h-4' />
              <span className='ml-1'>{tab.label}</span>
              {tab.count !== undefined && (
                <span className='ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full'>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Connections */}
        <div className='flex flex-wrap gap-6 mt-6'>
          {dataArray.find((item) => item.label === currentTab).value.map((user) => (
            <div key={user._id} className='w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md'>
              <img src={user.profile_picture} alt='' className='rounded-full w-12 h-12 shadow-md mx-auto' />
              <div className='flex-1'>
                <p className='font-medium text-slate-700'>{user.full_name}</p>
                <p className='text-slate-500'>@{user.username}</p>
                <p className='text-sm text-gray-600'>{user.bio?.slice(0, 30)}...</p>
                <div className='flex max-sm:flex-col gap-2 mt-4'>
                  <button
                    className='cursor-pointer px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-600 text-white text-sm font-medium shadow-sm hover:from-indigo-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all'
                    onClick={() => navigate(`/profile/${user._id}`)}
                  >
                    View Profile
                  </button>
                  {getSecondaryActionLabel() && (
                    <button
                      className='cursor-pointer px-4 py-2 rounded-md border border-slate-300 bg-white text-slate-700 text-sm hover:bg-slate-100 transition-colors'
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
