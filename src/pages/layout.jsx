import React, { useState } from 'react'
import SideBar from '../compnents/SideBar'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { dummyUserData } from '../assets/assets'
import Loading from '../compnents/loading'

const Layout = () => {
  const user = dummyUserData
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return user ? (
    <div className='w-full flex h-screen bg-slate-100 dark:bg-gray-950'>
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className='flex-1 min-h-0 p-2 sm:p-3 lg:p-4 flex flex-col'>
        <div className='h-full min-h-0 overflow-y-auto rounded-2xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900'>
          <Outlet />
        </div>
      </div>
      {
        sidebarOpen
          ? <X className='absolute top-3 right-3 p-2 z-100 bg-white dark:bg-gray-800 rounded-md shadow dark:shadow-gray-900 w-10 h-10 text-gray-600 dark:text-gray-300 sm:hidden' onClick={() => setSidebarOpen(false)} />
          : <Menu className='absolute top-3 right-3 p-2 z-100 bg-white dark:bg-gray-800 rounded-md shadow dark:shadow-gray-900 w-10 h-10 text-gray-600 dark:text-gray-300 sm:hidden' onClick={() => setSidebarOpen(true)} />
      }
    </div>
  ) : (
    <Loading />
  )
}

export default Layout