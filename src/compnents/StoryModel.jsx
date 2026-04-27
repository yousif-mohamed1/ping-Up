import { ArrowLeft, Sparkles, TextIcon, Upload } from 'lucide-react'
import React from 'react'
import { toast } from 'react-hot-toast'
import { api, ensureDemoSession } from '../services/api'
import { dummyUserData } from '../assets/assets'
import { addStoredStory, fileToDataUrl } from '../services/localData'

const StoryModel = ({setshowModel, fetchStories}) => {
const bgColors  = ['#4f46e5', '#ec4899', '#10b981', '#06b6d4', '#a855f7']   
const [_Mode, _setMode] = React.useState('text')  // create or view
const [_backdropOpen, _setBackdropOpen] = React.useState(bgColors[0])// for story creation backdrop
const [_text, _setText] = React.useState('')// for storing text content of story
const [Media,setMedia] = React.useState(null) // for storing media file
const [_previewUrl, setPreviewUrl] = React.useState(null) // for previewing media
const _handelMediaUpload = async (e) => {
    const file = e.target.files?.[0]
    if(file){
        setMedia(file)
        setPreviewUrl(await fileToDataUrl(file))
    }
}
const _handelCreateStory = async () => {
    // Local guard rails until real API integration is added.
    if (_Mode === 'text' && !_text.trim()) {
        throw new Error('Please write something for your story.')
    }
    if (_Mode === 'media' && !Media) {
        throw new Error('Please upload a photo or video.')
    }

    const payload = {
        content: _Mode === 'text' ? _text.trim() : '',
        mediaUrl: _Mode === 'media' ? _previewUrl : '',
        mediaType: _Mode === 'media' ? (Media?.type.startsWith('video') ? 'video' : 'image') : 'text',
        backgroundColor: _backdropOpen,
    }

    try {
        await ensureDemoSession()
        await api.stories.create(payload)
    } catch {
        addStoredStory({
            _id: `story_${Date.now()}`,
            user: dummyUserData,
            content: payload.content,
            media_url: payload.mediaUrl,
            media_type: payload.mediaType,
            background_color: payload.backgroundColor,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
    }

    await fetchStories?.()
    setshowModel(false)
}
    return (
    <div className='fixed inset-0 z-[110] min-h-screen bg-black/80 backdrop-blur
    text-white flex items-center justify-center p-4'>
        <div className='w-full max-w-md'>
            <div className='text-center mb-4 flex items-center justify-between'>
                <button className='text-white p-2 cursor-pointer' onClick={() => setshowModel(false)}>
                    <ArrowLeft className='w-6 h-6' />
                </button>
                <h2 className='text-xl font-semibold'>Create Story</h2>
                <span className='w-10'></span>
            </div>
            <div className='rounded-lg h-96 flex items-center justify-center
            relative' style={{backgroundColor:_backdropOpen}}>
                {_Mode==='text'&& (
                    <textarea value={_text} onChange={(e) => _setText(e.target.value)} placeholder='what is in your mind...' className='bg-transparent text-white w-full h-full
                    p-6 text-lg resize-none focus:outline-none' />
                )}
                {
                    _Mode==='media' && _previewUrl && (
                        Media?.type.startsWith('image') ? (
                            <img src={_previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <video src={_previewUrl} controls className="max-w-full max-h-full object-contain" />
                        )
                    )
                }

            </div>
            <div className='flex mt-4 gap-2'>
                {
                    bgColors.map((color) => (
                        <button key={color} onClick={() => _setBackdropOpen(color)} className='w-6 h-6 rounded-full ring cursor-pointer' style={{backgroundColor:color}} />
                    ))
                }

            </div>
            <div className='flex gap-2 mt-2'>
                <button onClick={() => {_setMode('text') ; setMedia(null) ; setPreviewUrl(null) }} className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${_Mode === 'text' ? 'bg-white text-black' : 'bg-zinc-800'}`}>
                    <TextIcon  size={18} /> text
                </button>
                <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${_Mode === 'media' ? 'bg-white text-black' : 'bg-zinc-800'}`}>
                    <input onChange={(e)=>{_handelMediaUpload(e); _setMode('media')}} type="file" accept='image/* ,video/*'className='hidden' />
                    <Upload size={18} /> photo/video
                </label>

            </div>
            <button
                onClick={() => toast.promise(_handelCreateStory(), {
                    loading:'creating story...',
                    success:<p>story created</p>,
                    error: e=><p>{e.message}</p>
                })}
                className='flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded-lg bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 font-semibold tracking-wide shadow-lg shadow-indigo-500/30 hover:brightness-110 active:scale-95 transition cursor-pointer'
            >
                <Sparkles size={18} /> Create Story
            </button>
        </div>
    </div>
  )
}

export default StoryModel
