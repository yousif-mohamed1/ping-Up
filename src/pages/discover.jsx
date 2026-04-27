import React from 'react'
import { Search } from 'lucide-react'
import { dummyConnectionsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import Loading from '../compnents/loading'
import UserCard from '../compnents/UserCard'
import { api, ensureDemoSession, normalizeUser } from '../services/api'

const Discover = () => {
  const navigate = useNavigate()
  const [input, setInput] = React.useState('')
  const [users, setUsers] = React.useState(dummyConnectionsData)
  const [followingMap, setFollowingMap] = React.useState(
    Object.fromEntries(dummyConnectionsData.map((user, index) => [user._id, index !== 0]))
  )

  React.useEffect(() => {
    api.users.list()
      .then((data) => setUsers(data.map(normalizeUser)))
      .catch(() => setUsers(dummyConnectionsData))
  }, [])

  const handleSearch = async (e) => {
    const query = e.target.value.trim()

    if (!query) {
      try {
        const data = await api.users.list()
        setUsers(data.map(normalizeUser))
      } catch {
        setUsers(dummyConnectionsData)
      }
      return
    }

    try {
      const data = await api.users.list(query)
      setUsers(data.map(normalizeUser))
    } catch {
      const lowerQuery = query.toLowerCase()
      const filteredUsers = dummyConnectionsData.filter((item) =>
        `${item.full_name} ${item.username} ${item.bio || ''} ${item.location || ''}`
          .toLowerCase()
          .includes(lowerQuery)
      )
      setUsers(filteredUsers)
    }
  }

  const toggleFollow = async (userId) => {
    const nextValue = !followingMap[userId]
    setFollowingMap((prev) => ({
      ...prev,
      [userId]: nextValue,
    }))
    try {
      await ensureDemoSession()
      if (nextValue) {
        await api.connections.follow(userId)
      } else {
        await api.connections.unfollow(userId)
      }
    } catch {
      // Keep the optimistic UI in demo mode if the API is offline.
    }
  }

  if (dummyConnectionsData.length === 0) {
    return (
      <section className='min-h-full bg-[#f6f7fb] px-4 py-6 sm:px-6 lg:px-8'>
        <Loading height='70vh' />
      </section>
    )
  }

  return (
    <section className='min-h-full bg-[#f6f7fb] px-4 py-6 sm:px-6 lg:px-8'>
      <div className='mx-auto w-full max-w-5xl'>
        <div className='mb-5'>
          <h1 className='text-3xl font-semibold tracking-tight text-[#151a29] md:text-[2.25rem]'>
            Discover People
          </h1>
          <p className='mt-1.5 text-base text-[#6a7185]'>Connect with amazing people and grow your network</p>
        </div>

        <div className='rounded-2xl border border-[#ececf2] bg-white p-4 shadow-[0_6px_18px_rgba(24,39,75,0.06)]'>
          <label
            htmlFor='discover-search'
            className='flex h-14 items-center gap-3 rounded-xl border border-[#e4e6ee] px-4 transition-colors focus-within:border-[#bcc3d9]'
          >
            <Search className='h-5 w-5 text-[#9098ad]' />
            <input
              id='discover-search'
              className='h-full w-full bg-transparent text-base text-[#20273b] outline-none placeholder:text-[#9aa1b4]'
              placeholder='Search people by name, username, bio, or location...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyUp={handleSearch}
            />
          </label>
        </div>

        <div className='mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
          {users.map((user) => {
            const isFollowing = Boolean(followingMap[user._id])
            return (
              <UserCard
                key={user._id}
                user={user}
                isFollowing={isFollowing}
                onToggleFollow={toggleFollow}
                onOpenProfile={(userId) => navigate(`/profile/${userId}`)}
              />
            )
          })}

          {users.length === 0 && (
            <div className='col-span-full rounded-xl border border-dashed border-[#d8dce8] bg-white py-14 text-center text-[#7c8398]'>
              No people matched your search.
              <button
                type='button'
                className='ml-2 font-semibold text-[#4f61ff] hover:underline'
                onClick={() => {
                  setInput('')
                  setUsers(dummyConnectionsData)
                }}
              >
                Clear search
              </button>
              .
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Discover
