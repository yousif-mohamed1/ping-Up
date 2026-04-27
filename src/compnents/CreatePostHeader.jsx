import React from 'react'

const CreatePostHeader = ({ isEditing }) => {
  return (
    <div className='mb-6'>
      <h1 className='text-4xl font-bold text-slate-900'>{isEditing ? 'Edit Post' : 'Create Post'}</h1>
      <p className='mt-1 text-base text-slate-600'>
        {isEditing ? 'Update your post before sharing it again' : 'Share your thoughts with the world'}
      </p>
    </div>
  )
}

export default CreatePostHeader