import { BadgeCheck, X } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

const StoryViewer = ({ viewStory, setViewStory }) => {
const [progress, setProgress] = React.useState(0)
const videoRef = useRef(null)
const STORY_DURATION = 5000

// Handle timed progress for text/image stories.
useEffect(() => {
  let timer
  let progressInterval

  if (viewStory && viewStory.media_type !== 'video') {
    setProgress(0)
    const stepMs = 50
    let elapsed = 0

    progressInterval = setInterval(() => {
      elapsed += stepMs
      const nextProgress = Math.min((elapsed / STORY_DURATION) * 100, 100)
      setProgress(nextProgress)
    }, stepMs)

    timer = setTimeout(() => {
      setViewStory(null)
    }, STORY_DURATION)
  }

  return () => {
    clearTimeout(timer)
    clearInterval(progressInterval)
  }
}, [viewStory, setViewStory])


const handelClose = () => {
    setViewStory(null)
}

const handleVideoTimeUpdate = () => {
  const video = videoRef.current
  if (!video || !video.duration || Number.isNaN(video.duration)) return

  const nextProgress = Math.min((video.currentTime / video.duration) * 100, 100)
  setProgress(nextProgress)
}

if (!viewStory) return null
const renderContent = () => {
    switch (viewStory?.media_type) {
      case 'text':
        return <div className='w-full flex items-center justify-center p-8 text-white text-2xl text-center'>{viewStory.content}</div>
        case 'image':
        return <img src={viewStory.media_url} alt="Story Media" className='max-w-full max-h-full object-contain' />
        case 'video':
        return (
          <video
            ref={videoRef}
            onEnded={() => setViewStory(null)}
            onLoadedMetadata={handleVideoTimeUpdate}
            onTimeUpdate={handleVideoTimeUpdate}
            src={viewStory.media_url}
            controls
            className='max-h-screen'
            autoPlay
          />
        )
      default:
        return null
    }
  }
  const textStoryColor = viewStory?.background_color || viewStory?.bg_color || '#000000e0'

  return (
    <div className='fixed inset-0 h-screen bg-black bg-opacity-90 z-110
    flex items-center justify-center' style={{ backgroundColor: viewStory?.media_type === 'text' ? textStoryColor : '#000000e0' }}>
    {/*progress Bar*/}
    {viewStory?.media_type !== 'video' && (
      <div className='absolute top-0 left-0 w-full h-1 bg-gray-700'>
        <div className='h-full bg-white transition-all duration-100 ease-linear' style={{ width: `${progress}%` }}>

        </div>

      </div>
    )}
    {/* User Info - Top Left */}
    <div className='absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50'>
      <img src={viewStory.user?.profile_picture} alt="" className='size-7 sm:size-8 rounded-full object-cover border border-white' />
      <div className='text-white font-medium flex items-center gap-1.5'>
      <span>{viewStory.user?.full_name}</span>
      <BadgeCheck size={18} />
        </div>
    </div>
    {/* close button */}
    <button onClick={handelClose} className='absolute top-4 right-4 z-20 text-white text-3xl font-bold focus:outline-none'>
      <X className='w-8 h-8 hover:scale-110 transition cursor-pointer' />

    </button>   
    {/* content Wrapper */}
    <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
        {renderContent()}

    </div>

    </div>
  )
}

export default StoryViewer