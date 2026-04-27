import React from 'react'
import { MapPin, User, UserPlus, Users } from 'lucide-react'

const UserCard = ({ user, isFollowing, onToggleFollow, onOpenProfile }) => {
  return (
    <article className='rounded-xl border border-[#e5e8ef] bg-white p-5 shadow-[0_8px_24px_rgba(30,41,59,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_26px_rgba(30,41,59,0.1)]'>
      <button type='button' className='mx-auto block' onClick={() => onOpenProfile(user._id)}>
        <img
          src={user.profile_picture}
          alt={user.full_name}
          className='h-16 w-16 rounded-full border-4 border-[#eff1f7] object-cover'
        />
      </button>

      <div className='mt-3 text-center'>
        <button
          type='button'
          className='text-[2rem] font-semibold leading-none text-[#1e2538]'
          onClick={() => onOpenProfile(user._id)}
        >
          {user.full_name}
        </button>
        <p className='mt-1.5 text-2xl text-[#8a90a4]'>@{user.username}</p>
        <p className='mx-auto mt-2 min-h-[64px] max-w-[240px] text-[1rem] leading-relaxed text-[#5c6478]'>
          {(user.bio || '')
            .replace(/\r?\n/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()}
        </p>
      </div>

      <div className='mt-3.5 flex flex-wrap items-center justify-center gap-2'>
        <div className='inline-flex items-center gap-1 rounded-full border border-[#e3e7ef] bg-[#fdfdff] px-3 py-1 text-sm font-medium text-[#6b7388]'>
          <MapPin className='h-4 w-4' />
          <span>{user.location || 'Unknown'}</span>
        </div>
        <div className='inline-flex items-center gap-1 rounded-full border border-[#e3e7ef] bg-[#fdfdff] px-3 py-1 text-sm font-medium text-[#6b7388]'>
          <Users className='h-4 w-4' />
          <span>{user.followers?.length || 0} Followers</span>
        </div>
      </div>

      <div className='mt-4 flex items-center gap-2'>
        <button
          type='button'
          onClick={() => onToggleFollow(user._id)}
          className='flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#4b5fff] to-[#a22bf7] px-4 text-base font-medium text-white shadow-[0_8px_20px_rgba(87,63,255,0.35)] transition hover:brightness-105 active:scale-[0.99]'
        >
          <UserPlus className='h-4 w-4' />
          <span>{isFollowing ? 'Following' : 'Follow'}</span>
        </button>
        <button
          type='button'
          onClick={() => isFollowing && onOpenProfile(user._id)}
          className={`h-10 rounded-md border border-[#ced4e3] text-[#6f7690] transition hover:bg-[#f7f8fc] ${
            isFollowing ? 'w-auto px-3 text-sm font-medium' : 'grid w-11 place-items-center'
          }`}
        >
          {isFollowing ? (
            <span className='inline-flex items-center gap-1'>
              <User className='h-4 w-4' />
              Profile
            </span>
          ) : (
            <span className='text-2xl'>+</span>
          )}
        </button>
      </div>
    </article>
  )
}

export default UserCard