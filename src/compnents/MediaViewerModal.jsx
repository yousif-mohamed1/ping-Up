import React from 'react'
import { X } from 'lucide-react'

const MediaViewerModal = ({ openMedia, onClose }) => {
  if (!openMedia) {
    return null
  }

  return (
    <div className='fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4'>
      <button
        type='button'
        onClick={onClose}
        className='absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white hover:bg-white/25 cursor-pointer'
        aria-label='Close media preview'
        title='Close'
      >
        <X className='h-5 w-5' />
      </button>

      <div className='w-full max-w-5xl overflow-hidden rounded-xl'>
        {openMedia.type === 'video' ? (
          <video src={openMedia.url} controls autoPlay className='max-h-[85vh] w-full object-contain' />
        ) : (
          <img src={openMedia.url} alt='Opened media' className='max-h-[85vh] w-full object-contain' />
        )}
      </div>
    </div>
  )
}

export default MediaViewerModal