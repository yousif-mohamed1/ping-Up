import React, { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Globe, Loader2, Lock, Upload, X, XCircle } from 'lucide-react'

const gradients = [
  { id: 'pink-blue', style: 'linear-gradient(to right, #c7d2fe, #fbcfe8)' },
  { id: 'purple', style: 'linear-gradient(to right, #c4b5fd, #a78bfa)' },
  { id: 'mint', style: 'linear-gradient(to right, #6ee7b7, #a7f3d0)' },
  { id: 'sunset', style: 'linear-gradient(to right, #fde68a, #fca5a5)' },
  { id: 'lavender', style: 'linear-gradient(to right, #e9d5ff, #ddd6fe)' },
]

const inputClass = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'

const FormField = ({ label, required, children }) => (
  <div>
    <label className='mb-1 block text-sm font-medium text-slate-700'>
      {label} {required && <span className='text-red-400'>*</span>}
    </label>
    {children}
  </div>
)

const EditProfileDrawer = ({ isOpen, onClose, onSave, profile }) => {
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    profile_picture: '',
    cover_gradient: gradients[0],
  })
  const [usernameStatus, setUsernameStatus] = useState('idle')
  const [urlError, setUrlError] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)

  useEffect(() => {
    if (!profile) return

    setForm({
      full_name: profile.full_name || '',
      username: profile.username || '',
      bio: profile.bio || '',
      location: profile.location || '',
      website: profile.website || '',
      profile_picture: profile.profile_picture || '',
      cover_gradient: profile.cover_gradient || gradients[0],
    })
    setUsernameStatus('idle')
    setUrlError('')
    setIsPrivate(Boolean(profile.isPrivate))
  }, [profile, isOpen])

  useEffect(() => {
    if (!isOpen) return
    if (!form.username.trim()) {
      setUsernameStatus('idle')
      return
    }

    setUsernameStatus('checking')
    const timer = setTimeout(() => {
      const isTaken = form.username.toLowerCase().endsWith('taken')
      setUsernameStatus(isTaken ? 'taken' : 'available')
    }, 600)

    return () => clearTimeout(timer)
  }, [form.username, isOpen])

  const bio = form.bio
  const bioCounterClass =
    bio.length >= 155 ? 'text-red-500 font-semibold' :
    bio.length >= 140 ? 'text-orange-400' :
    'text-gray-400'

  const canSave =
    form.full_name.trim() !== '' &&
    form.username.trim() !== '' &&
    usernameStatus !== 'taken' &&
    usernameStatus !== 'checking' &&
    urlError === ''

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setForm((prev) => ({ ...prev, profile_picture: URL.createObjectURL(file) }))
  }

  const validateUrl = (val) => {
    if (!val) {
      setUrlError('')
      return
    }
    try {
      new URL(val)
      setUrlError('')
    } catch {
      setUrlError('Please enter a valid URL (e.g. https://example.com)')
    }
  }

  const handleSave = () => {
    if (!canSave) return
    const payload = {
      full_name: form.full_name.trim(),
      username: form.username.trim(),
      bio: form.bio,
      location: form.location.trim(),
      website: form.website.trim(),
      isPrivate,
      profile_picture: form.profile_picture,
      cover_gradient: form.cover_gradient,
    }
    onSave(payload)
    onClose()
  }

  return (
    <>
      {isOpen && (
        <div className='fixed inset-0 bg-black/50 z-40' onClick={onClose} aria-hidden='true' />
      )}

      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50
   flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='flex items-center justify-between border-b border-slate-200 px-5 py-4'>
          <h2 className='text-lg font-semibold text-slate-900'>Edit Profile</h2>
          <button type='button' onClick={onClose} className='rounded-md p-2 text-slate-500 hover:bg-slate-100 cursor-pointer'>
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='no-scrollbar flex-1 space-y-5 overflow-y-auto px-5 py-4'>
            <div>
              <p className='mb-2 text-sm font-medium text-slate-700'>Profile Picture</p>
              <div className='flex items-center gap-3'>
                <img
                  src={form.profile_picture}
                  alt='Profile preview'
                  onClick={() => fileInputRef.current?.click()}
                  className='h-14 w-14 rounded-full object-cover border border-slate-200 cursor-pointer'
                />
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  className='inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50'
                >
                  <Upload className='h-4 w-4' /> Replace
                </button>
                <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
              </div>
            </div>

            <div>
              <p className='mb-2 text-sm font-medium text-slate-700'>Cover Gradient</p>
              <div className='flex gap-2'>
                {gradients.map((gradient) => (
                  <button
                    key={gradient.id}
                    type='button'
                    onClick={() => setForm((prev) => ({ ...prev, cover_gradient: gradient }))}
                    className={`h-14 flex-1 rounded-lg cursor-pointer transition-all duration-150 ${form.cover_gradient.id === gradient.id ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' : 'ring-1 ring-gray-200 hover:scale-[1.02]'}`}
                    style={{ background: gradient.style }}
                    aria-label={`Select ${gradient.id} cover gradient`}
                  />
                ))}
              </div>
            </div>

            <FormField label='Full Name' required>
              <input value={form.full_name} onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))} className={inputClass} />
            </FormField>

            <FormField label='Username' required>
              <input value={form.username} onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value.replace(/\s+/g, '_') }))} className={inputClass} />
              {usernameStatus === 'checking' && (
                <p className='text-xs text-gray-400 mt-1 flex items-center gap-1'>
                  <Loader2 className='w-3 h-3 animate-spin' /> Checking...
                </p>
              )}
              {usernameStatus === 'available' && (
                <p className='text-xs text-green-500 mt-1 flex items-center gap-1'>
                  <CheckCircle2 className='w-3 h-3' /> Username is available
                </p>
              )}
              {usernameStatus === 'taken' && (
                <p className='text-xs text-red-500 mt-1 flex items-center gap-1'>
                  <XCircle className='w-3 h-3' /> Username is taken
                </p>
              )}
            </FormField>

            <FormField label='Bio'>
              <textarea
                value={form.bio}
                onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value.slice(0, 160) }))}
                rows={4}
                className={`${inputClass} resize-none`}
              />
              <p className={`mt-1 text-right text-xs ${bioCounterClass}`}>{form.bio.length}/160</p>
            </FormField>

            <FormField label='Location'>
              <input value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} className={inputClass} />
            </FormField>

            <FormField label='Website URL'>
              <input
                value={form.website}
                onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                onBlur={(e) => validateUrl(e.target.value)}
                className={inputClass}
                placeholder='https://example.com'
              />
              {urlError && <p className='text-xs text-red-500 mt-1'>{urlError}</p>}
            </FormField>

            <div className='mt-6 pt-5 border-t border-gray-100'>
              <h3 className='text-sm font-semibold text-gray-700 mb-1'>Account Privacy</h3>
              <p className='text-xs text-gray-400 mb-4'>
                Control who can see your posts and follow you
              </p>

              <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50'>
                <div className='flex items-center gap-3'>
                  {isPrivate
                    ? <Lock className='w-5 h-5 text-indigo-500' />
                    : <Globe className='w-5 h-5 text-gray-400' />}
                  <div>
                    <p className='text-sm font-medium text-gray-700'>
                      {isPrivate ? 'Private Account' : 'Public Account'}
                    </p>
                    <p className='text-xs text-gray-400'>
                      {isPrivate
                        ? 'Only approved followers can see your posts'
                        : 'Anyone can see your posts and follow you'}
                    </p>
                  </div>
                </div>

                <button
                  type='button'
                  onClick={() => setIsPrivate((prev) => !prev)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${isPrivate ? 'bg-indigo-600' : 'bg-gray-300'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${isPrivate ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>
            </div>
        </div>

        <div className='flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4'>
          <button type='button' onClick={onClose} className='rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer'>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`px-6 py-2 rounded-lg text-white font-medium transition ${canSave ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-95' : 'bg-indigo-300 cursor-not-allowed opacity-60'}`}
          >
            Save
          </button>
        </div>
      </aside>
    </>
  )
}

export default EditProfileDrawer