import React, { useEffect, useState } from 'react'
import { dummyPostsData, dummyUserData } from '../assets/assets'
import { toast } from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import CreatePostHeader from '../compnents/CreatePostHeader'
import CreatePostForm from '../compnents/CreatePostForm'

const CreatePost = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [content, setContent] = useState('')
  const [media, setMedia] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [previewType, setPreviewType] = useState('')
  const [editingPostId, setEditingPostId] = useState('')

  useEffect(() => {
    const postId = location.state?.postId
    if (!postId) {
      setEditingPostId('')
      return
    }

    const existingPost = dummyPostsData.find((post) => post._id === postId)
    if (!existingPost) {
      toast.error('Post not found')
      navigate('/feed')
      return
    }

    setEditingPostId(existingPost._id)
    setContent(existingPost.content || '')
    setMedia(null)

    if (existingPost.video_url) {
      setPreviewUrl(existingPost.video_url)
      setPreviewType('video')
      return
    }

    if (existingPost.image_urls?.[0]) {
      setPreviewUrl(existingPost.image_urls[0])
      setPreviewType('image')
      return
    }

    setPreviewUrl('')
    setPreviewType('')
  }, [location.state, navigate])

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }

    setMedia(file)
    setPreviewUrl(URL.createObjectURL(file))
    setPreviewType(file.type.startsWith('video') ? 'video' : 'image')
  }

  const handleCreatePost = async () => {
    // Keep the same guard pattern used in create story.
    if (!content.trim() && !media) {
      throw new Error('Please add a caption or upload a photo/video.')
    }

    const existingPost = editingPostId
      ? dummyPostsData.find((post) => post._id === editingPostId)
      : null
    const isVideo = media ? media.type.startsWith('video') : previewType === 'video'
    const postPayload = {
      _id: editingPostId || `post_${Date.now()}`,
      user: existingPost?.user || dummyUserData,
      content: content.trim(),
      image_urls: previewUrl && !isVideo ? [previewUrl] : [],
      video_url: previewUrl && isVideo ? previewUrl : '',
      post_type: previewUrl ? (isVideo ? 'video' : 'text_with_image') : 'text',
      likes_count: existingPost?.likes_count || [],
      createdAt: editingPostId
        ? existingPost?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await new Promise((resolve) => setTimeout(resolve, 600))

    if (editingPostId) {
      const targetIndex = dummyPostsData.findIndex((post) => post._id === editingPostId)
      if (targetIndex === -1) {
        throw new Error('Unable to update post.')
      }

      dummyPostsData[targetIndex] = {
        ...dummyPostsData[targetIndex],
        ...postPayload,
      }
    } else {
      dummyPostsData.unshift(postPayload)
    }

    setContent('')
    setMedia(null)
    setPreviewUrl('')
    setPreviewType('')
    setEditingPostId('')
    navigate('/feed')
  }

  return (
    <div className='min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8'>
      <div className='max-w-xl'>
        <CreatePostHeader isEditing={Boolean(editingPostId)} />
        <CreatePostForm
          user={dummyUserData}
          content={content}
          onContentChange={setContent}
          previewUrl={previewUrl}
          previewType={previewType}
          onMediaUpload={handleMediaUpload}
          onSubmit={() => toast.promise(handleCreatePost(), {
            loading: editingPostId ? 'updating post...' : 'creating post...',
            success: <p>{editingPostId ? 'post updated' : 'post created'}</p>,
            error: (e) => <p>{e.message}</p>,
          })}
          isEditing={Boolean(editingPostId)}
        />
      </div>
    </div>
  )
}

export default CreatePost