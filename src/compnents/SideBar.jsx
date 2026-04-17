import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems'
import { assets, dummyUserData } from '../assets/assets'
import { CirclePlus, LogOut, Settings2 } from 'lucide-react'
import {UserButton,useClerk} from '@clerk/clerk-react'

const SideBar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate()
  const user= dummyUserData   // will be replaced by clerk user data in future
  const { signOut } = useClerk()
  return (
    <div
      className={`w-60 xl:w-72 max-sm:w-[82vw] max-sm:max-w-[300px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20 overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className='w-full'>
        <div className='px-5 sm:px-7 mt-2 mb-1'>
          <img onClick={() => navigate('/')} src={assets.logo} alt="brand logo" className='w-26 cursor-pointer' />
        </div>
        <hr className='border-gray-300 dark:border-gray-700 mb-8' />
        <MenuItems setSidebarOpen={setSidebarOpen} />
        <Link to='/create-post' className='flex items-center justify-center gap-2 py-2.5 mt-6 mx-4 sm:mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white text-sm sm:text-base cursor-pointer'>
          <CirclePlus className='w-5 h-5' />
          Create Post
        </Link>
      </div>
      <div className='w-full'>
        <div className='px-4 sm:px-6 mb-2'>
          <NavLink
            to='/settings'
            className={({ isActive }) =>
              `px-3.5 py-2 flex items-center gap-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 ${isActive ? 'bg-indigo-700 text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`
            }
          >
            <Settings2 className='w-5 h-5' />
            Settings
          </NavLink>
        </div>
        <div className='w-full border-t border-gray-200 dark:border-gray-700 p-4 px-5 sm:px-7'>
          <div className='flex gap-2 items-center justify-between'>
            <div className='flex gap-2 items-center cursor-pointer'>
            <UserButton />
            <div>
              <h1 className='text-sm font-medium dark:text-gray-300'>{user.full_name}</h1>
              <p className='text-xs text-gray-500 dark:text-gray-400'>@{user.username}</p>
            </div>
            </div>
            <button
              onClick={() => signOut()}
              className='p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-800'
              aria-label='Logout'
              title='Logout'
            >
              <LogOut className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBar
