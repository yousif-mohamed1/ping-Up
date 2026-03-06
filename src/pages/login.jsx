import React from 'react'
import { Star } from 'lucide-react'
import { assets } from '../assets/assets'
import { SignIn } from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* back ground image */}
      <img 
        src={assets.bgImage} 
        alt="background" 
        className='absolute inset-0 w-full h-full object-cover -z-10' 
      />

      <div className='relative z-10 min-h-screen px-8 py-6 md:px-12'>
        <div className='min-h-screen grid items-center gap-10 md:grid-cols-2'>

          <div className='flex flex-col items-start -mt-32 md:-mt-40'>
            <div className='flex items-center gap-2 -mt-6 md:-mt-8'>
              <img src={assets.logo} alt="brand logo" className='h-8 w-8 object-contain' />
              <span className='text-lg font-semibold text-indigo-900'>pingup</span>
            </div>

            <div className='mt-16 md:mt-20 flex items-center gap-3'>
              <img src={assets.group_users} alt="group of users" className='h-8 md:h-10 object-contain' />
              <div>
                <div className='flex items-center gap-1 text-amber-400'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className='h-4 w-4 fill-amber-400' />
                  ))}
                </div>
                <p className='text-xs md:text-sm text-slate-600'>Used by 12k+ developers</p>
              </div>
            </div>

            <h1 className='mt-4 text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent'>
              More than just friends truly connect
            </h1>

            <p className='text-sm md:text-lg text-indigo-900 max-w-xs'>
              connect with global community on pingup.
            </p>
          </div>

          {/* Right Side : Login Form */}
          <div className='flex-1 flex items-center justify-center p-6 sm:p-10'>
            <SignIn />
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login