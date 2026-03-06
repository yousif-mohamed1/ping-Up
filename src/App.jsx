import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Feed from './pages/feed'
import Discover from './pages/discover'
import Connections from './pages/connection'
import Messages from './pages/massges'
import ChatBox from './pages/chat_box'
import Profile from './pages/profile'
import CreatePost from './pages/create_post'
import Layout from './pages/layout'
import { useUser } from '@clerk/clerk-react'
import { Toaster } from 'react-hot-toast'

export const App = () => {
  const { user } = useUser()
  return (
  <>
    <Toaster />
    <Routes>
      <Route path='/' element={!user ? <Login /> : <Layout />}>
        <Route index element={<Feed />} />
        <Route path='feed' element={<Feed />} />
        <Route path='messages' element={<Messages />} />
        <Route path='messages/:userId' element={<ChatBox />} />
        <Route path='connections' element={<Connections />} />
        <Route path='discover' element={<Discover />} />
        <Route path='profile' element={<Profile />} />
        <Route path='profile/:profileId' element={<Profile />} />
        <Route path='create-post' element={<CreatePost />} />
      </Route>
    </Routes>
  </>
  )
}

export default App
