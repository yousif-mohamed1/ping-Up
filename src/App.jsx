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
import Settings from './pages/settings'
import Layout from './pages/layout'
import AdminPage from './pages/admin'
import { useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Loading from './compnents/loading'

export const App = () => {
  const { user, loading } = useAuth()

  if (loading) return <Loading />

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
        <Route path='settings' element={<Settings />} />
        <Route path='create-post' element={<CreatePost />} />
        <Route path='admin' element={<AdminPage />} />
      </Route>
    </Routes>
  </>
  )
}

export default App
