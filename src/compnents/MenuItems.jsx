import React from 'react'
import { menuItemsData, dummyNotificationsData } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const MenuItems = ({ setSidebarOpen }) => {
  const unreadCount = dummyNotificationsData.filter(n => !n.seen).length

  return (
    <div className='px-4 sm:px-6 text-gray-600 space-y-1 font-medium'>
      {
        menuItemsData.filter((item) => item.to !== '/settings').map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setSidebarOpen?.(false)}
            className={({ isActive }) =>
              `px-3 py-2 sm:px-3.5 flex items-center gap-3 rounded-lg text-sm sm:text-base ${isActive ? 'bg-indigo-700 text-white' : 'hover:bg-gray-50'}`
            }
          >
            <div className='relative'>
              <Icon className='w-5 h-5' />
              {label === 'Notifications' && unreadCount > 0 && (
                <span className='absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500
                text-white text-[9px] font-bold rounded-full flex items-center
                justify-center'>
                  {unreadCount}
                </span>
              )}
            </div>
            {label}
          </NavLink>
        ))
      }
    </div>
  )
}

export default MenuItems
