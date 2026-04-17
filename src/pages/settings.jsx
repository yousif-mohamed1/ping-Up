import React, { useState } from 'react'
import {
  Check,
  Eye,
  EyeOff,
  Github,
  Globe,
  Lock,
  Monitor,
  Moon,
  Smartphone,
} from 'lucide-react'
import { dummyUserData } from '../assets/assets'
import { useTheme } from '../context/ThemeContext'

const SectionTitle = ({ title, description }) => (
  <div className='mb-5'>
    <h2 className='text-lg font-semibold text-slate-800 dark:text-gray-100'>{title}</h2>
    {description && <p className='text-sm text-slate-500 dark:text-gray-400 mt-0.5'>{description}</p>}
  </div>
)

const ToggleSwitch = ({ value, onChange, disabled }) => (
  <button
    type='button'
    onClick={() => !disabled && onChange(!value)}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${value ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'} ${disabled ? 'cursor-not-allowed' : ''}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
)

const ToggleRow = ({ label, description, value, onChange, disabled }) => (
  <div className={`flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
    <div>
      <p className='text-sm font-medium text-gray-700 dark:text-gray-200'>{label}</p>
      {description && <p className='text-xs text-gray-400 dark:text-gray-400'>{description}</p>}
    </div>
    <ToggleSwitch value={value} onChange={onChange} disabled={disabled} />
  </div>
)

const RadioGroup = ({ options, value, onChange }) => (
  <div className='flex flex-col gap-2'>
    {options.map((opt) => (
      <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${value === opt ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
        <input type='radio' className='accent-indigo-600' checked={value === opt} onChange={() => onChange(opt)} />
        <span className='text-sm text-gray-700 dark:text-gray-200'>{opt}</span>
      </label>
    ))}
  </div>
)

const TABS = ['Account', 'Privacy & Safety', 'Notifications', 'Appearance', 'Danger Zone']
const inputClass = 'w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-slate-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Account')
  const [newEmail, setNewEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false })
  const [connected, setConnected] = useState({ google: true, github: false })
  const [twoFactor, setTwoFactor] = useState(false)
  const [sessions, setSessions] = useState([
    { id: 1, device: 'MacBook Pro - Chrome', location: 'New York, US', lastActive: 'Now', type: 'desktop' },
    { id: 2, device: 'iPhone 15 - Safari', location: 'New York, US', lastActive: '2 hours ago', type: 'mobile' },
    { id: 3, device: 'Windows PC - Edge', location: 'Boston, US', lastActive: '1 day ago', type: 'desktop' },
  ])

  const [isPrivate, setIsPrivate] = useState(false)
  const [messagePrivacy, setMessagePrivacy] = useState('Everyone')
  const [followersPrivacy, setFollowersPrivacy] = useState('Everyone')
  const [blockedUsers, setBlockedUsers] = useState([
    { id: 'b1', name: 'Alexa James', username: 'alexa_james', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop' },
    { id: 'b2', name: 'Richard Hendricks', username: 'richard_h', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200' },
  ])
  const [mutedUsers, setMutedUsers] = useState([
    { id: 'm1', name: 'Sam Wilson', username: 'samwil', avatar: dummyUserData.profile_picture },
    { id: 'm2', name: 'Taylor Kim', username: 'tkim', avatar: dummyUserData.profile_picture },
  ])

  const [pushEnabled, setPushEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [pushItems, setPushItems] = useState({ follow: true, like: true, comment: true, mention: false, request: true })
  const [emailItems, setEmailItems] = useState({ follow: false, like: true, comment: true, mention: false, request: true })

  const [language, setLanguage] = useState('English')
  const { isDark, toggleTheme } = useTheme()

  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')

  const renderUserList = (items, actionLabel, onAction) => {
    if (items.length === 0) {
      return <div className='rounded-lg border border-dashed border-gray-200 dark:border-gray-700 py-7 text-center text-sm text-gray-400 dark:text-gray-400'>No {actionLabel.toLowerCase()} users</div>
    }

    return (
      <div className='space-y-2'>
        {items.map((user) => (
          <div key={user.id} className='flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-3'>
              <img src={user.avatar} alt={user.name} className='w-10 h-10 rounded-full object-cover' />
              <div>
                <p className='text-sm font-medium text-gray-700 dark:text-gray-200'>{user.name}</p>
                <p className='text-xs text-gray-400 dark:text-gray-400'>@{user.username}</p>
              </div>
            </div>
            <button type='button' onClick={() => onAction(user.id)} className='px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'>
              {actionLabel}
            </button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-3xl font-bold text-slate-900 dark:text-gray-100 mb-6'>Settings</h1>
        <div className='flex flex-col md:flex-row gap-6'>
          <aside className='w-full md:w-56 shrink-0 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900 p-2 h-fit'>
            <div className='flex md:flex-col overflow-x-auto no-scrollbar gap-1 pb-1 md:pb-0'>
              {TABS.map((tab) => {
                const isActive = activeTab === tab
                const isDanger = tab === 'Danger Zone'
                return (
                  <button
                    key={tab}
                    type='button'
                    onClick={() => setActiveTab(tab)}
                    className={isActive
                      ? 'shrink-0 md:shrink md:w-full text-left px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm whitespace-nowrap'
                      : `shrink-0 md:shrink md:w-full text-left px-4 py-2.5 rounded-lg text-sm whitespace-nowrap ${isDanger ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>
          </aside>

          <div className='flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900 p-4 sm:p-6'>
            {activeTab === 'Account' && (
              <div className='space-y-8'>
                <section>
                  <SectionTitle title='Change Email' description='Update your login email address.' />
                  <div className='grid gap-3'>
                    <input value={dummyUserData.email} readOnly className='w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm text-gray-400 dark:text-gray-400' />
                    <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder='New email' className={inputClass} />
                    <input value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} placeholder='Confirm new email' className={inputClass} />
                    <button type='button' className='w-fit rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm text-white'>Update Email</button>
                  </div>
                </section>

                <section>
                  <SectionTitle title='Change Password' description='Choose a strong password you have not used before.' />
                  <div className='grid gap-3'>
                    {[
                      { key: 'current', label: 'Current password' },
                      { key: 'next', label: 'New password' },
                      { key: 'confirm', label: 'Confirm new password' },
                    ].map((field) => (
                      <div key={field.key} className='relative'>
                        <input
                          type={showPwd[field.key] ? 'text' : 'password'}
                          value={passwords[field.key]}
                          onChange={(e) => setPasswords((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.label}
                          className={`${inputClass} pr-10`}
                        />
                        <button
                          type='button'
                          onClick={() => setShowPwd((prev) => ({ ...prev, [field.key]: !prev[field.key] }))}
                          className='absolute right-3 top-2.5 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                        >
                          {showPwd[field.key] ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                        </button>
                      </div>
                    ))}
                    <button type='button' className='w-fit rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm text-white'>Update Password</button>
                  </div>
                </section>

                <section>
                  <SectionTitle title='Connected Accounts' />
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700'>
                      <div className='flex items-center gap-3'>
                        <div className='w-5 h-5 rounded-full bg-red-400' />
                        <span className='text-sm text-gray-700 dark:text-gray-200'>Google</span>
                      </div>
                      {connected.google ? <span className='px-2.5 py-1 text-xs rounded-full bg-green-100 text-green-700'>Connected</span> : <button type='button' className='px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300'>Connect</button>}
                    </div>
                    <div className='flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700'>
                      <div className='flex items-center gap-3'>
                        <Github className='w-5 h-5 text-gray-700 dark:text-gray-200' />
                        <span className='text-sm text-gray-700 dark:text-gray-200'>GitHub</span>
                      </div>
                      {connected.github ? <span className='px-2.5 py-1 text-xs rounded-full bg-green-100 text-green-700'>Connected</span> : <button type='button' onClick={() => setConnected((p) => ({ ...p, github: true }))} className='px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300'>Connect</button>}
                    </div>
                  </div>
                </section>

                <section>
                  <SectionTitle title='Two-Factor Authentication' />
                  <ToggleRow
                    label='Authenticator App'
                    description='Add an extra layer of security to your account'
                    value={twoFactor}
                    onChange={setTwoFactor}
                  />
                </section>

                <section>
                  <SectionTitle title='Active Sessions' />
                  <div className='space-y-2'>
                    {sessions.map((s) => (
                      <div key={s.id} className='flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3'>
                        <div className='flex items-center gap-3'>
                          {s.type === 'mobile' ? <Smartphone className='w-5 h-5 text-gray-500 dark:text-gray-400' /> : <Monitor className='w-5 h-5 text-gray-500 dark:text-gray-400' />}
                          <div>
                            <p className='text-sm font-medium text-gray-700 dark:text-gray-200'>{s.device}</p>
                            <p className='text-xs text-gray-400 dark:text-gray-400'>{s.location} • {s.lastActive}</p>
                          </div>
                        </div>
                        <button type='button' onClick={() => setSessions((prev) => prev.filter((item) => item.id !== s.id))} className='text-sm text-red-500 hover:text-red-600'>Log out</button>
                      </div>
                    ))}
                    <button type='button' onClick={() => setSessions((prev) => prev.slice(0, 1))} className='text-sm text-red-500 hover:text-red-600'>Log out all other sessions</button>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'Privacy & Safety' && (
              <div className='space-y-8'>
                <section>
                  <SectionTitle title='Account Privacy' />
                  <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'>
                    <div className='flex items-center gap-3'>
                      {isPrivate ? <Lock className='w-5 h-5 text-indigo-500' /> : <Globe className='w-5 h-5 text-gray-400 dark:text-gray-400' />}
                      <div>
                        <p className='text-sm font-medium text-gray-700 dark:text-gray-200'>{isPrivate ? 'Private Account' : 'Public Account'}</p>
                        <p className='text-xs text-gray-400 dark:text-gray-400'>{isPrivate ? 'Only approved followers can see your posts' : 'Anyone can see your posts and follow you'}</p>
                      </div>
                    </div>
                    <ToggleSwitch value={isPrivate} onChange={setIsPrivate} />
                  </div>
                </section>

                <section>
                  <SectionTitle title='Who can message you' />
                  <RadioGroup options={['Everyone', 'Connections only', 'Nobody']} value={messagePrivacy} onChange={setMessagePrivacy} />
                </section>

                <section>
                  <SectionTitle title='Who can see your followers list' />
                  <RadioGroup options={['Everyone', 'Connections only', 'Only me']} value={followersPrivacy} onChange={setFollowersPrivacy} />
                </section>

                <section>
                  <SectionTitle title='Blocked Users' />
                  {renderUserList(blockedUsers, 'Unblock', (id) => setBlockedUsers((prev) => prev.filter((u) => u.id !== id)))}
                </section>

                <section>
                  <SectionTitle title='Muted Users' />
                  {renderUserList(mutedUsers, 'Unmute', (id) => setMutedUsers((prev) => prev.filter((u) => u.id !== id)))}
                </section>
              </div>
            )}

            {activeTab === 'Notifications' && (
              <div className='space-y-8'>
                <section>
                  <SectionTitle title='Push Notifications' />
                  <ToggleRow label='Enable push notifications' value={pushEnabled} onChange={setPushEnabled} />
                  <ToggleRow label='Someone follows me' value={pushItems.follow} onChange={(v) => setPushItems((p) => ({ ...p, follow: v }))} disabled={!pushEnabled} />
                  <ToggleRow label='Someone likes my post' value={pushItems.like} onChange={(v) => setPushItems((p) => ({ ...p, like: v }))} disabled={!pushEnabled} />
                  <ToggleRow label='Someone comments on my post' value={pushItems.comment} onChange={(v) => setPushItems((p) => ({ ...p, comment: v }))} disabled={!pushEnabled} />
                  <ToggleRow label='Someone mentions me' value={pushItems.mention} onChange={(v) => setPushItems((p) => ({ ...p, mention: v }))} disabled={!pushEnabled} />
                  <ToggleRow label='Connection requests' value={pushItems.request} onChange={(v) => setPushItems((p) => ({ ...p, request: v }))} disabled={!pushEnabled} />
                </section>

                <section>
                  <SectionTitle title='Email Notifications' />
                  <ToggleRow label='Enable email notifications' value={emailEnabled} onChange={setEmailEnabled} />
                  <ToggleRow label='Someone follows me' value={emailItems.follow} onChange={(v) => setEmailItems((p) => ({ ...p, follow: v }))} disabled={!emailEnabled} />
                  <ToggleRow label='Someone likes my post' value={emailItems.like} onChange={(v) => setEmailItems((p) => ({ ...p, like: v }))} disabled={!emailEnabled} />
                  <ToggleRow label='Someone comments on my post' value={emailItems.comment} onChange={(v) => setEmailItems((p) => ({ ...p, comment: v }))} disabled={!emailEnabled} />
                  <ToggleRow label='Someone mentions me' value={emailItems.mention} onChange={(v) => setEmailItems((p) => ({ ...p, mention: v }))} disabled={!emailEnabled} />
                  <ToggleRow label='Connection requests' value={emailItems.request} onChange={(v) => setEmailItems((p) => ({ ...p, request: v }))} disabled={!emailEnabled} />
                </section>
              </div>
            )}

            {activeTab === 'Appearance' && (
              <div className='space-y-8'>
                <section>
                  <SectionTitle title='Language' />
                  <div className='grid sm:grid-cols-2 gap-3'>
                    <button type='button' onClick={() => setLanguage('English')} className={`p-4 rounded-xl border text-left transition ${language === 'English' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-500' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                      <p className='text-base font-medium text-gray-700 dark:text-gray-200'>English 🇺🇸</p>
                      <p className='text-xs text-gray-400 dark:text-gray-400 mt-1'>Default interface language</p>
                    </button>
                    <button type='button' onClick={() => setLanguage('Arabic')} className={`p-4 rounded-xl border text-left transition ${language === 'Arabic' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-500' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                      <p className='text-base font-medium text-gray-700 dark:text-gray-200'>Arabic 🇸🇦</p>
                      <p className='text-xs text-gray-400 dark:text-gray-400 mt-1' dir='rtl'>اتجاه من اليمين إلى اليسار</p>
                    </button>
                  </div>
                </section>

                <section>
                  <SectionTitle title='Theme' />
                  <div className='flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'>
                    <div className='flex items-center gap-3'>
                      <Moon className='w-5 h-5 text-indigo-500' />
                      <div>
                        <p className='text-sm font-medium text-gray-700 dark:text-gray-200'>Dark Mode</p>
                        <p className='text-xs text-gray-400 dark:text-gray-400'>Switch to a darker color scheme</p>
                      </div>
                    </div>
                    <ToggleSwitch value={isDark} onChange={toggleTheme} />
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'Danger Zone' && (
              <div className='border border-red-200 dark:border-red-900 rounded-xl p-6 bg-red-50 dark:bg-red-900/20 space-y-7'>
                <section>
                  <SectionTitle title='Deactivate Account' description='Temporarily disable your account. You can reactivate anytime.' />
                  <button type='button' onClick={() => setShowDeactivateConfirm(true)} className='border border-red-400 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm'>Deactivate</button>
                  {showDeactivateConfirm && (
                    <div className='mt-3 p-4 rounded-lg border border-red-200 dark:border-red-900 bg-white dark:bg-gray-800'>
                      <p className='text-sm text-gray-700 dark:text-gray-200 mb-3'>Are you sure you want to deactivate your account?</p>
                      <div className='flex gap-2'>
                        <button className='px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600'>Confirm</button>
                        <button onClick={() => setShowDeactivateConfirm(false)} className='px-4 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700'>Cancel</button>
                      </div>
                    </div>
                  )}
                </section>

                <section>
                  <SectionTitle title='Delete Account' description='Permanently delete your account and all your data. This cannot be undone.' />
                  <button type='button' onClick={() => setShowDeleteConfirm(true)} className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm'>Delete Account</button>
                  {showDeleteConfirm && (
                    <div className='mt-3 p-4 rounded-lg border border-red-200 dark:border-red-900 bg-white dark:bg-gray-800'>
                      <p className='text-sm text-gray-700 dark:text-gray-200 mb-3'>Type DELETE to confirm permanent account deletion.</p>
                      <input value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} className={`${inputClass} mb-3`} placeholder='DELETE' />
                      <div className='flex gap-2'>
                        <button disabled={deleteInput !== 'DELETE'} className={`px-4 py-1.5 rounded-lg text-sm ${deleteInput === 'DELETE' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-red-200 text-white cursor-not-allowed'}`}>Confirm</button>
                        <button onClick={() => { setShowDeleteConfirm(false); setDeleteInput('') }} className='px-4 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700'>Cancel</button>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
