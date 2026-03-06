import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../assets/assets'
import Loading from '../compnents/loading'
import StoriesBar from '../compnents/StoriesBar'

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
        <div className='px-4 pt-4'>
          List of post
        </div>
      </div>
      {/* Right Sidebar */}
      <div className='hidden lg:block min-w-44 pt-2'>
        <div>
          <h1>Sponsored</h1>
        </div>
        <h1>Recent messages</h1>
      </div>
    </div>
  ) : <Loading />
}

export default Feed