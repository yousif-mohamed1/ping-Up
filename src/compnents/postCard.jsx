import React from 'react'
import { BadgeCheck, Eye, Heart, MessageCircle, MoreHorizontal, Pencil, Share2, Trash2 } from 'lucide-react'
import moment from 'moment'
import { toast } from 'react-hot-toast'
import { dummyUserData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { api, ensureDemoSession, normalizePost } from '../services/api'

const postCard = ({ post, onDeletePost }) => {
    const [liked, setLiked] = React.useState(post.likes_count || [])
    const [menuOpen, setMenuOpen] = React.useState(false)
    const likes = Array.isArray(liked) ? liked : []
    const currentuser = dummyUserData
    const handleLike = async () => {
        try {
            await ensureDemoSession()
            const updatedPost = normalizePost(await api.posts.like(post._id))
            setLiked(updatedPost.likes_count || [])
        } catch {
            setLiked((prev) => {
                const currentId = currentuser._id
                return prev.includes(currentId)
                    ? prev.filter((id) => id !== currentId)
                    : [...prev, currentId]
            })
        }
    }
    const navigate = useNavigate()
    const isOwner = post?.user?._id === currentuser?._id

    const handleDeleteClick = (e) => {
        e.stopPropagation()
        const shouldDelete = window.confirm('Are you sure you want to delete this post?')
        if (shouldDelete && onDeletePost) {
            onDeletePost(post._id)
        }
        setMenuOpen(false)
    }

    const handleEditClick = (e) => {
        e.stopPropagation()
        navigate('/create-post', { state: { postId: post._id } })
        setMenuOpen(false)
    }

    const handleVisibilityClick = (e) => {
        e.stopPropagation()
        toast('Visibility settings will be added later.')
        setMenuOpen(false)
    }

    const renderContentWithHashtags = (content) => {
        if (!content) return null

        // Split by hashtag token and style hashtag parts without injecting raw HTML.
        const parts = content.split(/(#[\p{L}\p{N}_]+)/gu)

        return parts.map((part, index) => {
            if (/^#[\p{L}\p{N}_]+$/u.test(part)) {
                return (
                    <span key={index} className='text-indigo-600 cursor-pointer'>
                        {part}
                    </span>
                )
            }

            return <React.Fragment key={index}>{part}</React.Fragment>
        })
    }

  return (
    <div className='bg-white rounded-xl shadow p-4 space-y-4
    w-full max-w-2xl'>
        {/*user info*/}
        <div className='flex items-start justify-between gap-3'>
            <div onClick={()=> navigate('/profile/'+post.user._id)} className='inline-flex items-center gap-3 cursor-pointer'>
                <img src={post.user.profile_picture} alt={post.user.full_name} className='w-10 h-10 rounded-full rounded-full shadow' />
                <div className='flex items-center space-x-1'>
                    <span>
                        {post.user.full_name}
                        <BadgeCheck size={16} className='text-blue-500 w-4 h-4 inline ml-1' />
                    </span>
                </div>
                <div className='text-gray-500 text-sm'>
                    @{post.user.username} . {moment(post.createdAt).fromNow()}
                </div>
            </div>

            {isOwner && (
                <div className='relative'>
                    <button
                        type='button'
                        onClick={(e) => {
                            e.stopPropagation()
                            setMenuOpen((prev) => !prev)
                        }}
                        className='rounded-md p-2 text-gray-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer'
                        aria-label='Post options'
                        title='Post options'
                    >
                        <MoreHorizontal className='w-4 h-4' />
                    </button>

                    {menuOpen && (
                        <div className='absolute right-0 top-11 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg'>
                            <button
                                type='button'
                                onClick={handleEditClick}
                                className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 cursor-pointer'
                            >
                                <Pencil className='h-4 w-4' /> Edit post
                            </button>
                            <button
                                type='button'
                                onClick={handleVisibilityClick}
                                className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 cursor-pointer'
                            >
                                <Eye className='h-4 w-4' /> Check visibility
                            </button>
                            <button
                                type='button'
                                onClick={handleDeleteClick}
                                className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 cursor-pointer'
                            >
                                <Trash2 className='h-4 w-4' /> Delete post
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
        {/*post content*/}
        <div className='text-gray-800'>
                        {post.content && (
                            <div className='text-gray-800 text-sm whitespace-pre-line'>
                                {renderContentWithHashtags(post.content)}
                            </div>
                        )}
        </div>
        {/*post media*/}
        {post.image_urls?.length > 0 && (
            <div className='grid grid-cols-2 gap-2'>
                {post.image_urls.map((img, index) => (
                    <img
                      src={img}
                      alt='Post media'
                      className={`w-full object-cover rounded-lg ${post.image_urls.length === 1 ? 'col-span-2 h-auto' : 'h-48'}`}
                      key={index}
                    />
                ))}
            </div>
        )}
        {post.video_url && (
            <div className='overflow-hidden rounded-lg'>
                <video src={post.video_url} controls className='w-full object-cover' />
            </div>
        )}
        {/*Actions*/}
        <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
            <div className='flex items-center gap-1'>
                <Heart className={`w-4 h-4 cursor-pointer ${likes.includes(currentuser._id) && 'fill-red-500 text-red-500'}`} onClick={handleLike} />
                <span>{liked.length}</span>
            </div>
            <div className='flex items-center gap-1'>
                <MessageCircle className='w-4 h-4 cursor-pointer' />
                <span>{12}</span>
            </div>
            <div className='flex items-center gap-1'>
                <Share2 className='w-4 h-4 cursor-pointer' />
                <span>{7}</span>
            </div>
        </div>
    </div>
  )
}

export default postCard
