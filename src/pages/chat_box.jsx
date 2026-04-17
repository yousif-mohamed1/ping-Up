import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { dummyConnectionsData, dummyUserData } from '../assets/assets'
import ChatBoxHeader from '../compnents/ChatBoxHeader'
import ChatBoxMessages from '../compnents/ChatBoxMessages'
import ChatBoxInputBar from '../compnents/ChatBoxInputBar'
import ChatBoxCameraModal from '../compnents/ChatBoxCameraModal'

function ChatBox() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [mediaPreview, setMediaPreview] = useState(null)
  const [mediaType, setMediaType] = useState(null)
  const [isCamOpen, setIsCamOpen] = useState(false)
  const inputRef = useRef(null)
  const bottomRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const otherUser = dummyConnectionsData.find(user => user._id === userId)
  const currentUser = dummyUserData

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  if (!otherUser)
    return (
      <div className='h-full flex items-center justify-center text-slate-400 dark:text-gray-400 text-sm'>
        User not found.
      </div>
    )

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if (!input.trim() && !mediaPreview) return

    const newMessage = {
      _id: `msg_${Date.now()}`,
      senderId: 'me',
      text: input,
      media: mediaPreview,
      mediaType: mediaType,
      createdAt: new Date()
    }

    setMessages([...messages, newMessage])
    setInput('')
    setMediaPreview(null)
    setMediaType(null)
  }

  const handleFileSelect = e => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = event => {
      setMediaPreview(event.target?.result)
      setMediaType(file.type.startsWith('video') ? 'video' : 'image')
    }
    reader.readAsDataURL(file)
  }

  const handleOpenCamera = async () => {
    try {
      setIsCamOpen(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      })
      streamRef.current = stream
      // Delay gives React time to mount the video element before we assign srcObject
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      }, 100)
    } catch (error) {
      alert('Camera access denied')
      setIsCamOpen(false)
    }
  }

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
      const photoData = canvasRef.current.toDataURL('image/jpeg')
      setMediaPreview(photoData)
      setMediaType('image')
      handleCloseCamera()
    }
  }

  const handleCloseCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCamOpen(false)
  }

  const handleRemoveMedia = () => {
    setMediaPreview(null)
    setMediaType(null)
  }

  return (
    <div className='flex flex-col h-screen w-full bg-slate-50 dark:bg-gray-900 overflow-hidden'>
      <ChatBoxHeader navigate={navigate} otherUser={otherUser} />

      <ChatBoxMessages
        messages={messages}
        otherUser={otherUser}
        currentUser={currentUser}
        bottomRef={bottomRef}
      />

      <ChatBoxInputBar
        mediaPreview={mediaPreview}
        mediaType={mediaType}
        handleRemoveMedia={handleRemoveMedia}
        handleFileSelect={handleFileSelect}
        handleOpenCamera={handleOpenCamera}
        inputRef={inputRef}
        input={input}
        setInput={setInput}
        handleKeyDown={handleKeyDown}
        handleSend={handleSend}
      />

      <ChatBoxCameraModal
        isCamOpen={isCamOpen}
        handleCloseCamera={handleCloseCamera}
        videoRef={videoRef}
        canvasRef={canvasRef}
        handleCapturePhoto={handleCapturePhoto}
      />
    </div>
  )
}

export default ChatBox
