import React from 'react'
import { BadgeCheck, Heart, MessageCircle, Share, Share2 } from 'lucide-react'
import moment from 'moment'
import { dummyUserData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const postCard = ({ post }) => {
    const [liked, setLiked] = React.useState(post.likes_count || [])
    const likes = Array.isArray(liked) ? liked : []
    const currentuser = dummyUserData
    const handleLike = async () => {}
    const navigate = useNavigate()

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
        {/*Actions*/}
        <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
            <div className='flex items-center gap-1'>
                <Heart className={`w-4 h-4 cursor-pointer ${likes.includes(currentuser.id) && 'fill-red-500 text-red-500'}`} onClick={handleLike} />
                <span>{liked.length}</span>
            </div>
            <div className='flex items-center gap-1'>
                <MessageCircle className={`w-4 h-4 cursor-pointer ${likes.includes(currentuser.id) && 'fill-red-500 text-red-500'}`} onClick={handleLike} />
                <span>{12}</span>
            </div>
            <div className='flex items-center gap-1'>
                <Share2 className={`w-4 h-4 cursor-pointer ${likes.includes(currentuser.id) && 'fill-red-500 text-red-500'}`} onClick={handleLike} />
                <span>{7}</span>
            </div>
        </div>
    </div>
  )
}

export default postCard