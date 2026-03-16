import React, { useEffect, useMemo, useState } from 'react'
import { dummyConnectionsData, dummyMessagesData, dummyUserData } from '../assets/assets'
import { useParams } from 'react-router-dom'
import ChatHeader from '../compnents/ChatHeader'
import ChatMessages from '../compnents/ChatMessages'
import ChatComposer from '../compnents/ChatComposer'
import MediaViewerModal from '../compnents/MediaViewerModal'

const ChatBox = () => {
  const { userId } = useParams()
  const [inputValue, setInputValue] = useState('')
  const [openMedia, setOpenMedia] = useState(null)

  const resolvedContactId = useMemo(() => {
    if (userId && userId !== dummyUserData._id) {
      return userId
    }

    const firstConversation = dummyMessagesData.find((message) => (
      message.from_user_id === dummyUserData._id || message.to_user_id === dummyUserData._id
    ))

    if (!firstConversation) {
      return null
    }

    return firstConversation.from_user_id === dummyUserData._id
      ? firstConversation.to_user_id
      : firstConversation.from_user_id
  }, [userId])

  const activeUser = useMemo(() => {
    const foundUser = dummyConnectionsData.find((user) => user._id === resolvedContactId)
    if (foundUser) {
      return foundUser
    }

    return dummyConnectionsData.find((user) => user._id !== dummyUserData._id) || {
      _id: resolvedContactId || 'contact_user',
      full_name: 'Contact User',
      username: 'contact_user',
      profile_picture: dummyUserData.profile_picture,
    }
  }, [resolvedContactId])

  const initialMessages = useMemo(() => {
    const filtered = dummyMessagesData.filter((msg) => (
      (msg.from_user_id === dummyUserData._id && msg.to_user_id === resolvedContactId) ||
      (msg.to_user_id === dummyUserData._id && msg.from_user_id === resolvedContactId)
    ))

    return filtered.length > 0 ? filtered : dummyMessagesData
  }, [resolvedContactId])

  const [chatMessages, setChatMessages] = useState(initialMessages)

  useEffect(() => {
    setChatMessages(initialMessages)
  }, [initialMessages])

  const formatTime = (isoDate) => {
    return new Date(isoDate).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const nextMessage = {
      _id: `msg_${Date.now()}`,
      from_user_id: dummyUserData._id,
      to_user_id: resolvedContactId || activeUser._id,
      text: inputValue.trim(),
      message_type: 'text',
      media_url: '',
      seen: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setChatMessages((prev) => [...prev, nextMessage])
    setInputValue('')
  }

  return (
    <div className='h-full bg-slate-100'>
      <div className='mx-auto flex h-full w-full max-w-5xl flex-col'>
        <ChatHeader activeUser={activeUser} />
        <ChatMessages
          chatMessages={chatMessages}
          currentUserId={dummyUserData._id}
          formatTime={formatTime}
          onOpenMedia={setOpenMedia}
        />
        <ChatComposer
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
        />
      </div>
      <MediaViewerModal openMedia={openMedia} onClose={() => setOpenMedia(null)} />
    </div>
  )
}

export default ChatBox