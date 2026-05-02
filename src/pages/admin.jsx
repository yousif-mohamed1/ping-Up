import React, { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  Activity,
  AlertTriangle,
  Ban,
  CheckCircle,
  FileText,
  Flame,
  Hash,
  Pin,
  Shield,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import toast from 'react-hot-toast'
import Loading from '../compnents/loading'

const ranges = [
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '90d', value: '90d' },
]

const trendRanges = [
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
]

const getUserId = (user) => String(user?._id ?? user?.id ?? '')
const getPostId = (post) => String(post?._id ?? post?.id ?? '')

const avatarUrl = (user) =>
  user?.profile_picture ||
  user?.profilePicture ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || user?.fullName || user?.username || 'User')}`

const displayName = (user) => user?.full_name || user?.fullName || user?.username || 'Unknown user'

const RangeControl = ({ value, onChange, options = ranges }) => (
  <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
          value === option.value ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
)

const StatCard = ({ icon, label, value, tone }) => (
  <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-lg ${tone}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value ?? 0}</p>
    </div>
  </div>
)

const ChartPanel = ({ title, children, action }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between gap-4 mb-6">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {action}
    </div>
    <div className="h-64">{children}</div>
  </div>
)

const EmptyPanel = ({ children }) => (
  <div className="p-8 text-center text-gray-500">
    <CheckCircle className="w-12 h-12 mx-auto text-emerald-400 mb-3" />
    <p>{children}</p>
  </div>
)

const AdminPage = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [usersGrowth, setUsersGrowth] = useState([])
  const [postActivity, setPostActivity] = useState([])
  const [engagement, setEngagement] = useState([])
  const [trendingHashtags, setTrendingHashtags] = useState([])
  const [viralProfiles, setViralProfiles] = useState([])
  const [viralPosts, setViralPosts] = useState([])
  const [reports, setReports] = useState([])
  const [users, setUsers] = useState([])
  const [bannedWords, setBannedWords] = useState([])
  const [newBannedWord, setNewBannedWord] = useState('')
  const [hashtagToPin, setHashtagToPin] = useState('')
  const [analyticsRange, setAnalyticsRange] = useState('7d')
  const [trendingRange, setTrendingRange] = useState('24h')

  const isSuperAdmin = user?.role === 'SUPER_ADMIN'
  const isModerator = user?.role === 'MODERATOR'
  const hasAdminAccess = isSuperAdmin || isModerator

  const fetchData = useCallback(async () => {
    if (!hasAdminAccess) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const [reportsRes, usersRes] = await Promise.all([
        api.admin.reports('PENDING'),
        api.admin.users(),
      ])

      setReports(reportsRes || [])
      setUsers(usersRes || [])

      if (isSuperAdmin) {
        const [
          statsRes,
          growthRes,
          activityRes,
          engagementRes,
          hashtagRes,
          profileRes,
          postRes,
          wordsRes,
        ] = await Promise.all([
          api.admin.stats(),
          api.admin.userGrowth(analyticsRange),
          api.admin.postActivity(analyticsRange),
          api.admin.engagement(analyticsRange),
          api.admin.trendingHashtags(trendingRange),
          api.admin.viralProfiles(trendingRange),
          api.admin.viralPosts(trendingRange),
          api.admin.getBannedWords(),
        ])

        setStats(statsRes)
        setUsersGrowth(growthRes || [])
        setPostActivity(activityRes || [])
        setEngagement(engagementRes || [])
        setTrendingHashtags(hashtagRes || [])
        setViralProfiles(profileRes || [])
        setViralPosts(postRes || [])
        setBannedWords(wordsRes || [])
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load admin data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [analyticsRange, hasAdminAccess, isSuperAdmin, trendingRange])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleReviewReport = async (id, action) => {
    try {
      await api.admin.reviewReport(id, action)
      setReports((currentReports) => currentReports.filter((report) => report.id !== id))
      toast.success(action === 'DELETE' ? 'Post deleted' : 'Report reviewed')
    } catch (err) {
      toast.error(err.message || 'Failed to review report')
    }
  }

  const handleDeletePost = async (id) => {
    try {
      await api.admin.deletePost(id)
      setViralPosts((currentPosts) => currentPosts.filter(({ post }) => getPostId(post) !== String(id)))
      toast.success('Post deleted')
    } catch (err) {
      toast.error(err.message || 'Failed to delete post')
    }
  }

  const handleMuteUser = async (userId, muted) => {
    try {
      await api.admin.muteUser(userId, muted)
      setUsers((currentUsers) =>
        currentUsers.map((entry) => (getUserId(entry.user) === String(userId) ? { ...entry, muted } : entry)),
      )
      toast.success(`User ${muted ? 'muted' : 'unmuted'}`)
    } catch (err) {
      toast.error(err.message || 'Failed to update mute status')
    }
  }

  const handleBanUser = async (userId, banned) => {
    try {
      await api.admin.banUser(userId, banned)
      setUsers((currentUsers) =>
        currentUsers.map((entry) => (getUserId(entry.user) === String(userId) ? { ...entry, banned } : entry)),
      )
      toast.success(`User ${banned ? 'banned' : 'unbanned'}`)
    } catch (err) {
      toast.error(err.message || 'Failed to update ban status')
    }
  }

  const handleUpdateRole = async (userId, role) => {
    try {
      await api.admin.updateRole(userId, role)
      setUsers((currentUsers) =>
        currentUsers.map((entry) =>
          getUserId(entry.user) === String(userId) ? { ...entry, user: { ...entry.user, role } } : entry,
        ),
      )
      toast.success('Role updated successfully')
    } catch (err) {
      toast.error(err.message || 'Failed to update role')
    }
  }

  const handlePinHashtag = async (event) => {
    event.preventDefault()
    const normalized = hashtagToPin.replace(/^#/, '').trim().toLowerCase()
    if (!normalized) return

    try {
      await api.admin.pinHashtag(normalized)
      setTrendingHashtags((currentTags) => {
        const exists = currentTags.some((tag) => tag.name === normalized)
        if (exists) {
          return currentTags.map((tag) => (tag.name === normalized ? { ...tag, pinned: true } : tag))
        }
        return [{ name: normalized, count: 0, pinned: true }, ...currentTags]
      })
      setHashtagToPin('')
      toast.success(`#${normalized} pinned`)
    } catch (err) {
      toast.error(err.message || 'Failed to pin hashtag')
    }
  }

  const handleAddBannedWord = async (event) => {
    event.preventDefault()
    if (!newBannedWord.trim()) return

    try {
      const response = await api.admin.addBannedWord(newBannedWord)
      setBannedWords((currentWords) => [...currentWords, response])
      setNewBannedWord('')
      toast.success('Word banned')
    } catch (err) {
      toast.error(err.message || 'Failed to ban word')
    }
  }

  const handleRemoveBannedWord = async (id) => {
    try {
      await api.admin.removeBannedWord(id)
      setBannedWords((currentWords) => currentWords.filter((word) => word.id !== id))
      toast.success('Word removed')
    } catch (err) {
      toast.error(err.message || 'Failed to remove word')
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loading />
      </div>
    )
  }

  if (!hasAdminAccess) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-lg shadow-sm p-8 text-center">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">Admin access required</h1>
          <p className="text-gray-500 mt-2">Your account does not have moderator or super admin permissions.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Platform health, moderation, and privileged account controls.</p>
          </div>
          <span className="self-start md:self-auto px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold">
            {user?.role}
          </span>
        </div>

        {isSuperAdmin && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatCard
              icon={<Users className="w-6 h-6" />}
              label="Total Users"
              value={stats.totalUsers}
              tone="bg-blue-50 text-blue-600"
            />
            <StatCard
              icon={<FileText className="w-6 h-6" />}
              label="Posts Today"
              value={stats.postsToday}
              tone="bg-purple-50 text-purple-600"
            />
            <StatCard
              icon={<AlertTriangle className="w-6 h-6" />}
              label="Active Reports"
              value={stats.activeReports}
              tone="bg-rose-50 text-rose-600"
            />
            <StatCard
              icon={<UserPlus className="w-6 h-6" />}
              label="New Signups (7d)"
              value={stats.newSignups7d}
              tone="bg-emerald-50 text-emerald-600"
            />
          </div>
        )}

        {isSuperAdmin && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <ChartPanel
              title="User Growth"
              action={<RangeControl value={analyticsRange} onChange={setAnalyticsRange} />}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usersGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel title="Post Activity">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={postActivity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#9333ea" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel title="Engagement">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagement}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartPanel>
          </div>
        )}

        {isSuperAdmin && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Hash className="w-5 h-5 text-indigo-600" />
                  Trending Hashtags
                </h3>
                <RangeControl value={trendingRange} onChange={setTrendingRange} options={trendRanges} />
              </div>
              <div className="divide-y divide-gray-100">
                {trendingHashtags.length === 0 ? (
                  <div className="p-6 text-sm text-gray-500">No hashtag activity yet.</div>
                ) : (
                  trendingHashtags.map((tag, index) => (
                    <div key={tag.name} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          #{tag.name}
                          {tag.pinned && <Pin className="w-3.5 h-3.5 text-indigo-500 inline ml-2" />}
                        </p>
                        <p className="text-xs text-gray-500">Rank #{index + 1}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold">
                        {tag.count} uses
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Viral Profiles
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {viralProfiles.length === 0 ? (
                  <div className="p-6 text-sm text-gray-500">No profile growth in this range.</div>
                ) : (
                  viralProfiles.map(({ user: profile, followerGrowth }) => (
                    <div key={getUserId(profile)} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={avatarUrl(profile)} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{displayName(profile)}</p>
                          <p className="text-xs text-gray-500 truncate">@{profile?.username}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold">
                        +{followerGrowth}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  Viral Posts
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {viralPosts.length === 0 ? (
                  <div className="p-6 text-sm text-gray-500">No viral posts in this range.</div>
                ) : (
                  viralPosts.map(({ post, totalLikes }) => (
                    <div key={getPostId(post)} className="p-6 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            @{post?.user?.username || 'unknown'}
                          </p>
                          <p className="text-xs text-gray-500">{totalLikes} likes</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeletePost(getPostId(post))}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete post"
                          aria-label="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">{post?.content || 'Media post'}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Pending Reports Queue
              </h3>
            </div>
            {reports.length === 0 ? (
              <EmptyPanel>No pending reports to review.</EmptyPanel>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-6 py-4 font-medium">Reporter</th>
                      <th className="px-6 py-4 font-medium">Content Preview</th>
                      <th className="px-6 py-4 font-medium">Reason</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={avatarUrl(report.reporter)} alt="" className="w-8 h-8 rounded-full object-cover" />
                            <span className="font-medium text-gray-900">@{report.reporter?.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="truncate max-w-[220px] text-gray-600">{report.postContentPreview}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium">
                            {report.reason}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleReviewReport(report.id, 'KEEP')}
                              className="p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                              title="Keep post"
                              aria-label="Keep post"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReviewReport(report.id, 'DISMISS')}
                              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                              title="Dismiss report"
                              aria-label="Dismiss report"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReviewReport(report.id, 'DELETE')}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                              title="Delete post"
                              aria-label="Delete post"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="xl:col-span-2 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <VolumeX className="w-5 h-5 text-orange-600" />
                User Moderation
              </h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-[520px] overflow-y-auto">
              {users.length === 0 ? (
                <div className="p-6 text-sm text-gray-500">No users found.</div>
              ) : (
                users.map(({ user: listedUser, muted, banned }) => {
                  const listedUserId = getUserId(listedUser)
                  const isSelf = getUserId(user) === listedUserId
                  return (
                    <div key={listedUserId} className="p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={avatarUrl(listedUser)} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{displayName(listedUser)}</p>
                          <p className="text-xs text-gray-500 truncate">
                            @{listedUser?.username} · {listedUser?.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMuteUser(listedUserId, !muted)}
                          disabled={isSelf}
                          className={`p-2 rounded-lg transition disabled:opacity-40 ${
                            muted
                              ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                              : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                          }`}
                          title={muted ? 'Unmute' : 'Mute'}
                          aria-label={muted ? 'Unmute' : 'Mute'}
                        >
                          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => handleBanUser(listedUserId, !banned)}
                            disabled={isSelf || listedUser?.role === 'SUPER_ADMIN'}
                            className={`p-2 rounded-lg transition disabled:opacity-40 ${
                              banned
                                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title={banned ? 'Unban' : 'Ban'}
                            aria-label={banned ? 'Unban' : 'Ban'}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {isSuperAdmin && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Role Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-6 py-4 font-medium">User</th>
                      <th className="px-6 py-4 font-medium">Role</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map(({ user: listedUser, muted, banned }) => {
                      const listedUserId = getUserId(listedUser)
                      const isSelf = getUserId(user) === listedUserId
                      return (
                        <tr key={listedUserId} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={avatarUrl(listedUser)} alt="" className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <p className="font-medium text-gray-900">{displayName(listedUser)}</p>
                                <p className="text-xs text-gray-500">@{listedUser?.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={listedUser?.role || 'USER'}
                              onChange={(event) => handleUpdateRole(listedUserId, event.target.value)}
                              disabled={isSelf}
                              className="text-xs font-medium border-gray-200 rounded-md bg-gray-50 disabled:opacity-50"
                            >
                              <option value="USER">User</option>
                              <option value="MODERATOR">Moderator</option>
                              <option value="SUPER_ADMIN">Super Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1">
                              {banned && <span className="w-2 h-2 rounded-full bg-red-500" title="Banned" />}
                              {muted && <span className="w-2 h-2 rounded-full bg-orange-500" title="Muted" />}
                              {!banned && !muted && <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active" />}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Pin className="w-5 h-5 text-indigo-600" />
                    Pin Hashtag
                  </h3>
                </div>
                <form onSubmit={handlePinHashtag} className="p-6 flex gap-2">
                  <input
                    type="text"
                    value={hashtagToPin}
                    onChange={(event) => setHashtagToPin(event.target.value)}
                    placeholder="#launch"
                    className="flex-1 min-w-0 text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                  >
                    Pin
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-600" />
                    Banned Words
                  </h3>
                </div>
                <form onSubmit={handleAddBannedWord} className="p-6 border-b border-gray-100 flex gap-2">
                  <input
                    type="text"
                    value={newBannedWord}
                    onChange={(event) => setNewBannedWord(event.target.value)}
                    placeholder="Add a word"
                    className="flex-1 min-w-0 text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                  >
                    Add
                  </button>
                </form>
                <div className="p-6 max-h-[260px] overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {bannedWords.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No banned words configured.</p>
                    ) : (
                      bannedWords.map((word) => (
                        <span
                          key={word.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-full"
                        >
                          {word.word}
                          <button
                            type="button"
                            onClick={() => handleRemoveBannedWord(word.id)}
                            className="p-0.5 hover:bg-red-100 rounded-full transition"
                            title="Remove word"
                            aria-label="Remove word"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
