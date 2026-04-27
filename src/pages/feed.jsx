import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Loading from '../compnents/loading'
import StoriesBar from '../compnents/StoriesBar'
import PostCard from '../compnents/postCard'
import RecentMassges from '../compnents/RecentMassges'
import { toast } from 'react-hot-toast'
import { api, ensureDemoSession, normalizePost } from '../services/api'
import { deleteStoredPost, getStoredPosts } from '../services/localData'

const Feed = () => {
  const [feeds, setFeeds] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchFeeds = async () => {
    try {
      const posts = await api.posts.feed()
      setFeeds(posts.map(normalizePost))
    } catch {
      setFeeds(getStoredPosts())
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeeds()
  }, [])

  const handleDeletePost = (postId) => {
    toast.promise((async () => {
      try {
        await ensureDemoSession()
        await api.posts.delete(postId)
      } catch {
        deleteStoredPost(postId)
      }
      setFeeds((prev) => prev.filter((post) => post._id !== postId))
    })(), {
      loading: 'Deleting post...',
      success: 'Post deleted',
      error: (e) => e.message,
    })
  }

  return !isLoading ? (
    <div className='h-full overflow-y-scroll py-6 px-4 xl:px-6 flex items-start justify-center xl:gap-8'>
      {/* stories and post list */}
      <div className='w-full max-w-3xl'>
        <StoriesBar />
        <div className='px-4 pt-4 flex flex-col gap-2'>
          {feeds.map((post) => (
              <PostCard key={post._id} post={post} onDeletePost={handleDeletePost} />
            
          ))
          }
        </div>
      </div>
      {/* Right Sidebar */}
      <div className='max-x1:hidden sticky top-0'>
        <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex
        flex-col gap-4 shadow'>
          <h3 className='text-slate-800 font-semibold'>Sponsored</h3>
          <img src={assets.sponsored_img} alt="" className='w-75 h-50 rounded-md'/>
          <p className='text-slate-600'>
            Email marketing
          </p>
          <p className='text-slate-400'>supercharge your marketing with a powerfull ,easy-to-use 
            platform bulid for reasults.</p>
        </div>
        <RecentMassges />
      </div>
    </div>
  ) : <Loading />
}

export default Feed
