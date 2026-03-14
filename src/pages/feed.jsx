import React, { useEffect, useState } from 'react'
import { assets, dummyPostsData } from '../assets/assets'
import Loading from '../compnents/loading'
import StoriesBar from '../compnents/StoriesBar'
import PostCard from '../compnents/postCard'
import RecentMassges from '../compnents/RecentMassges'

const Feed = () => {
  const [feeds, setFeeds] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchFeeds = async () => {
    setIsLoading(false)
    setFeeds(dummyPostsData) // will be replaced by api call to fetch posts in future
    
  }

  useEffect(() => {
    fetchFeeds()
  }, [])

  return !isLoading ? (
    <div className='h-full overflow-y-scroll py-6 px-4 xl:px-6 flex items-start justify-center xl:gap-8'>
      {/* stories and post list */}
      <div className='w-full max-w-3xl'>
        <StoriesBar />
        <div className='px-4 pt-4 flex flex-col gap-2'>
          {feeds.map((post) => (
              <PostCard key={post._id} post={post} />
            
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