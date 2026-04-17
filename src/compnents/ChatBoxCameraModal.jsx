import React from 'react'
import { X } from 'lucide-react'

function ChatBoxCameraModal({ isCamOpen, handleCloseCamera, videoRef, canvasRef, handleCapturePhoto }) {
  if (!isCamOpen) return null

  return (
    <div className='fixed inset-0 bg-black/80 z-50 flex items-center justify-center'>
      <div className='bg-white rounded-lg shadow-lg p-4 w-full max-w-md'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-slate-800'>Camera</h3>
          <button onClick={handleCloseCamera} className='p-1 hover:bg-slate-100 rounded transition'>
            <X className='w-5 h-5 text-slate-600' />
          </button>
        </div>
        <video
          ref={videoRef}
          className='w-full rounded-lg bg-black mb-4'
          style={{ transform: 'scaleX(-1)' }}
        />
        <canvas ref={canvasRef} width={320} height={240} className='hidden' />
        <div className='flex gap-2'>
          <button
            onClick={handleCapturePhoto}
            className='flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium'
          >
            Capture
          </button>
          <button
            onClick={handleCloseCamera}
            className='flex-1 bg-slate-200 text-slate-800 py-2 rounded-lg hover:bg-slate-300 transition font-medium'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBoxCameraModal
