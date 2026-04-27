import React from 'react'
import { dummyConnectionsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { Eye, MessageSquare } from 'lucide-react'
import { api, normalizeUser } from '../services/api'

const massges = () => {
  const navigate = useNavigate()
  const [users, setUsers] = React.useState(dummyConnectionsData)

  React.useEffect(() => {
    api.users.list()
      .then((data) => setUsers(data.map(normalizeUser)))
      .catch(() => setUsers(dummyConnectionsData))
  }, [])

  const handleUserClick = (userId) => {
    navigate(`/messages/${userId}`)
  }

  return (
    <div className='min-h-screen bg-slate-50 py-8'>
      <div className='max-w-2xl px-4 sm:px-6 lg:px-8'>
        {/* Title Section */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-slate-900 mb-2'>Messages</h1>
          <p className='text-slate-600 text-lg'>Talk to your friends and family</p>
        </div>

        {/* Users List */}
        <div className='space-y-4'>
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user._id)}
              className='flex items-start gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md hover:bg-slate-50 transition-all duration-200 cursor-pointer'
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
                  <h3 className='text-lg font-semibold text-slate-900'>
                    {user.full_name}
                  </h3>
                </div>
                <p className='text-sm text-slate-500 mb-2'>@{user.username}</p>
                <p className='text-sm text-slate-600 line-clamp-2'>
                  {user.bio}
                </p>
              </div>
              <div className='flex flex-col gap-2 mt-4'>
              <button onClick={() => navigate(`/messages/${user._id}`)} className='size-10 flex items-center justify-center text-sm
              rounded bg-slate-100 hover:bg-slate-200 text-slate-800
              active:scale-95 transtion cursor-pointer gap-1'>
                <MessageSquare className='w-4 h-4'/>
              </button>

             <button onClick={() => navigate(`/profile/${user._id}`)} className='size-10 flex items-center justify-center text-sm
              rounded bg-slate-100 hover:bg-slate-200 text-slate-800
              active:scale-95 transtion cursor-pointer '>
                <Eye className='w-4 h-4'/>
              </button>

              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default massges
