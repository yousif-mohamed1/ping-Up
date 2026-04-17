import React, { useEffect, useState } from 'react'
import { assets, dummyPostsData } from '../assets/assets'
import StoriesBar from '../compnents/StoriesBar'
import PostCard from '../compnents/postCard'
import RecentMassges from '../compnents/RecentMassges'
import { toast } from 'react-hot-toast'
import PostCardSkeleton from '../compnents/skeletons/PostCardSkeleton'
import EmptyState from '../compnents/EmptyState'
import { FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Feed = () => {
  const navigate = useNavigate()
  const [feeds, setFeeds] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchFeeds = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1200))
    setFeeds(dummyPostsData) // will be replaced by api call to fetch posts in future
    setIsLoading(false)
  }

  useEffect(() => {
    fetchFeeds()
  }, [])

  const handleDeletePost = (postId) => {
    setFeeds((prev) => prev.filter((post) => post._id !== postId))

    const targetIndex = dummyPostsData.findIndex((post) => post._id === postId)
    if (targetIndex !== -1) {
      dummyPostsData.splice(targetIndex, 1)
    }

    toast.success('Post deleted')
  }

  return (
    <div className='h-full overflow-y-scroll py-4 px-2 sm:px-4 xl:px-6 flex items-start justify-center xl:gap-8 bg-slate-50 dark:bg-gray-900'>
      {/* stories and post list */}
      <div className='w-full max-w-3xl'>
        <StoriesBar />
        <div className='px-2 sm:px-4 pt-4 flex flex-col gap-2'>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))
            : feeds.length === 0
              ? <EmptyState
                  icon={FileText}
                  title='No posts yet'
                  description='Be the first to share something with the world.'
                  actionLabel='Create Post'
                  onAction={() => navigate('/create-post')}
                />
              : feeds.map((post) => (
                  <PostCard key={post._id} post={post} onDeletePost={handleDeletePost} />
                ))}
        </div>
      </div>
      {/* Right Sidebar */}
      <div className='hidden xl:block sticky top-0'>
        <div className='max-w-xs bg-white dark:bg-gray-800 text-xs p-4 rounded-md inline-flex
        flex-col gap-4 shadow dark:shadow-gray-900'>
          <h3 className='text-slate-800 dark:text-gray-100 font-semibold'>Sponsored</h3>
          <img src={assets.sponsored_img} alt="" className='w-full h-auto sm:h-50 rounded-md'/>
          <p className='text-slate-600 dark:text-gray-300'>
            Email marketing
          </p>
          <p className='text-slate-400 dark:text-gray-500'>supercharge your marketing with a powerfull ,easy-to-use 
            platform bulid for reasults.</p>
        </div>
        <RecentMassges />
      </div>
    </div>
  )
}

export default Feed