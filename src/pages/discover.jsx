import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { dummyConnectionsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import UserCard from '../compnents/UserCard'
import GlobalSearch from '../compnents/GlobalSearch'
import UserCardSkeleton from '../compnents/skeletons/UserCardSkeleton'

const Discover = () => {
  const navigate = useNavigate()
  const users = dummyConnectionsData
  const [searchOpen, setSearchOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [followingMap, setFollowingMap] = useState(
    Object.fromEntries(dummyConnectionsData.map((user, index) => [user._id, index !== 0]))
  )

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const toggleFollow = (userId) => {
    setFollowingMap((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  return (
    <section className='min-h-full bg-[#f6f7fb] dark:bg-gray-950 px-4 py-6 sm:px-6 lg:px-8'>
      <div className='mx-auto w-full max-w-5xl'>
        <div className='mb-5'>
          <h1 className='text-3xl font-semibold tracking-tight text-[#151a29] dark:text-gray-100 md:text-[2.25rem]'>
            Explore
          </h1>
          <p className='mt-1.5 text-base text-[#6a7185] dark:text-gray-300'>People you might know</p>
          <button
            onClick={() => setSearchOpen(true)}
            className='mt-3 h-12 w-full max-w-[360px] rounded-2xl border border-[#e4e6ee] dark:border-gray-700 bg-white dark:bg-gray-800 px-4 flex items-center gap-2 text-[#9098ad] dark:text-gray-400 hover:border-[#d4d9e7] transition cursor-pointer shadow dark:shadow-gray-900'
            title='Search'
          >
            <Search className='h-5 w-5 shrink-0' />
            <span className='text-xl sm:text-2xl leading-none'>Search</span>
          </button>
        </div>

        <div className='mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <UserCardSkeleton key={i} />
              ))
            : users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  isFollowing={Boolean(followingMap[user._id])}
                  onToggleFollow={toggleFollow}
                  onOpenProfile={userId => navigate(`/profile/${userId}`)}
                />
              ))}

          {!isLoading && users.length === 0 && (
            <div className='col-span-full rounded-xl border border-dashed border-[#d8dce8] dark:border-gray-700 bg-white dark:bg-gray-800 py-14 text-center text-[#7c8398] dark:text-gray-400'>
              No people to show right now.
            </div>
          )}
        </div>
        {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
      </div>
    </section>
  )
}

export default Discover