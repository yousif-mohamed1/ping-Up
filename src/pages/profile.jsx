import React from 'react'
import { BadgeCheck, CalendarDays, Link2, MapPin, SquarePen } from 'lucide-react'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import { dummyConnectionsData, dummyPostsData, dummyUserData } from '../assets/assets'
import PostCard from '../compnents/postCard'
import EditProfileDrawer from '../compnents/EditProfileDrawer'
import { api, ensureDemoSession, normalizePost, normalizeUser } from '../services/api'

const Profile = () => {
  const { profileId } = useParams()
  const [activeTab, setActiveTab] = React.useState('posts')
  const [editOpen, setEditOpen] = React.useState(false)
  const [fetchedPosts, setFetchedPosts] = React.useState([])

  const resolvedProfile = React.useMemo(() => {
    if (!profileId) {
      return dummyUserData
    }

    return dummyConnectionsData.find((user) => user._id === profileId) || dummyUserData
  }, [profileId])
  const [profile, setProfile] = React.useState(resolvedProfile)

  React.useEffect(() => {
    setProfile(resolvedProfile)
  }, [resolvedProfile])

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        if (profileId) {
          const user = await api.users.get(profileId)
          setProfile(normalizeUser(user))
          return
        }
        await ensureDemoSession()
        const user = await api.users.me()
        setProfile(normalizeUser(user))
      } catch {
        setProfile(resolvedProfile)
      }
    }
    loadProfile()
  }, [profileId, resolvedProfile])

  React.useEffect(() => {
    const loadPosts = async () => {
      try {
        const userId = profileId || profile?._id
        if (!userId) return
        const data = await api.posts.byUser(userId)
        setFetchedPosts(data.map(normalizePost))
      } catch {
        setFetchedPosts(dummyPostsData)
      }
    }
    loadPosts()
  }, [profileId, profile?._id])

  const posts = React.useMemo(() => {
    const sourcePosts = fetchedPosts.length > 0 ? fetchedPosts : dummyPostsData
    if (activeTab === 'media') {
      return sourcePosts.filter((post) => post.image_urls?.length > 0)
    }

    if (activeTab === 'likes') {
      return sourcePosts.filter((post) => post.likes_count?.length > 0)
    }

    return sourcePosts
  }, [activeTab, fetchedPosts])

  const tabButtonClass = (tab) =>
    `h-10 rounded-lg px-8 text-sm font-semibold transition ${
      activeTab === tab
        ? 'bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-[0_8px_18px_rgba(88,72,255,0.35)]'
        : 'text-slate-500 hover:text-slate-700'
    }`

  const handleProfileSave = async (updatedData) => {
    const payload = {
      fullName: updatedData.full_name,
      username: updatedData.username,
      bio: updatedData.bio,
      location: updatedData.location,
      website: updatedData.website,
      profilePicture: updatedData.profile_picture,
      coverPhoto: updatedData.cover_photo,
      privateAccount: updatedData.isPrivate,
    }
    try {
      await ensureDemoSession()
      const saved = await api.users.updateMe(payload)
      setProfile(normalizeUser(saved))
      return
    } catch {
      // Fall back to local state when the API is not available.
    }
    setProfile((prev) => {
      const merged = {
        ...prev,
        ...updatedData,
        updatedAt: new Date().toISOString(),
      }

      if (!profileId) {
        Object.assign(dummyUserData, merged)
      }

      return merged
    })
  }

  const coverStyle = profile.cover_gradient
    ? { backgroundImage: `linear-gradient(90deg, ${profile.cover_gradient.from}, ${profile.cover_gradient.to})` }
    : undefined

  return (
    <section className='min-h-full bg-[#f1f4f8] py-7'>
      <div className='mx-auto w-full max-w-5xl px-4 sm:px-6'>
        <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
          <div className='h-36 bg-gradient-to-r from-indigo-200 via-indigo-100 to-pink-200 sm:h-40' style={coverStyle} />

          <div className='relative px-5 pb-5 sm:px-7'>
            <img
              src={profile.profile_picture}
              alt={profile.full_name}
              className='-mt-12 h-24 w-24 rounded-full border-4 border-white bg-white object-cover shadow sm:-mt-14 sm:h-28 sm:w-28'
            />

            <div className='mt-3 flex flex-wrap items-start justify-between gap-4'>
              <div>
                <div className='flex items-center gap-2'>
                  <h1 className='text-3xl font-semibold text-slate-900'>{profile.full_name}</h1>
                  {profile.is_verified && <BadgeCheck className='h-5 w-5 text-sky-500' />}
                </div>
                <p className='text-base text-slate-500'>@{profile.username}</p>
                <p className='mt-3 max-w-2xl text-sm leading-6 text-slate-600 whitespace-pre-line'>{profile.bio}</p>

                <div className='mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500'>
                  <span className='inline-flex items-center gap-1.5'>
                    <MapPin className='h-4 w-4' />
                    {profile.location || 'Unknown'}
                  </span>
                  {profile.website && (
                    <a href={profile.website} target='_blank' rel='noreferrer' className='inline-flex items-center gap-1.5 hover:text-indigo-600'>
                      <Link2 className='h-4 w-4' />
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                  <span className='inline-flex items-center gap-1.5'>
                    <CalendarDays className='h-4 w-4' />
                    Joined {moment(profile.createdAt).fromNow()}
                  </span>
                </div>
              </div>

              <button
                type='button'
                onClick={() => setEditOpen(true)}
                className='inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'
              >
                <SquarePen className='h-4 w-4' />
                Edit
              </button>
            </div>

            <div className='mt-4 border-t border-slate-200 pt-4'>
              <div className='flex flex-wrap items-center gap-6 text-sm text-slate-600'>
                <p>
                  <span className='mr-1 font-semibold text-slate-900'>{dummyPostsData.length}</span>
                  Posts
                </p>
                <p>
                  <span className='mr-1 font-semibold text-slate-900'>{profile.followers?.length || 0}</span>
                  Followers
                </p>
                <p>
                  <span className='mr-1 font-semibold text-slate-900'>{profile.following?.length || 0}</span>
                  Following
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='mx-auto mt-5 w-full max-w-md rounded-xl border border-slate-200 bg-white p-1 shadow-sm'>
          <div className='grid grid-cols-3 gap-1'>
            <button type='button' className={tabButtonClass('posts')} onClick={() => setActiveTab('posts')}>
              Posts
            </button>
            <button type='button' className={tabButtonClass('media')} onClick={() => setActiveTab('media')}>
              Media
            </button>
            <button type='button' className={tabButtonClass('likes')} onClick={() => setActiveTab('likes')}>
              Likes
            </button>
          </div>
        </div>

        <div className='mx-auto mt-5 flex w-full max-w-3xl flex-col gap-3 pb-8'>
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className='rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500'>
              No {activeTab} yet.
            </div>
          )}
        </div>
      </div>

      <EditProfileDrawer
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleProfileSave}
        profile={profile}
      />
    </section>
  )
}

export default Profile
