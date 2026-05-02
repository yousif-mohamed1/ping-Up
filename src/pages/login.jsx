import React, { useState } from 'react'
import { Star, Eye, EyeOff, Loader2 } from 'lucide-react'
import { assets } from '../assets/assets'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Login = () => {
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [isRegister, setIsRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isRegister) {
        await register({
          email: form.email,
          username: form.username,
          fullName: form.fullName,
          password: form.password,
        })
        toast.success('Account created successfully!')
      } else {
        await login(form.email, form.password)
        toast.success('Welcome back!')
      }
      navigate('/feed')
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* back ground image */}
      <img 
        src={assets.bgImage} 
        alt="background" 
        className='absolute inset-0 w-full h-full object-cover -z-10' 
      />

      <div className='relative z-10 min-h-screen px-8 py-6 md:px-12'>
        <div className='min-h-screen grid items-center gap-10 md:grid-cols-2'>

          <div className='flex flex-col items-start -mt-32 md:-mt-40'>
            <div className='flex items-center gap-2 -mt-6 md:-mt-8'>
              <img src={assets.logo} alt="brand logo" className='h-8 w-8 object-contain' />
              <span className='text-lg font-semibold text-indigo-900'>pingup</span>
            </div>

            <div className='mt-16 md:mt-20 flex items-center gap-3'>
              <img src={assets.group_users} alt="group of users" className='h-8 md:h-10 object-contain' />
              <div>
                <div className='flex items-center gap-1 text-amber-400'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className='h-4 w-4 fill-amber-400' />
                  ))}
                </div>
                <p className='text-xs md:text-sm text-slate-600'>Used by 12k+ developers</p>
              </div>
            </div>

            <h1 className='mt-4 text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent'>
              More than just friends truly connect
            </h1>

            <p className='text-sm md:text-lg text-indigo-900 max-w-xs'>
              connect with global community on pingup.
            </p>
          </div>

          {/* Right Side : Login / Register Form */}
          <div className='flex-1 flex items-center justify-center p-6 sm:p-10'>
            <div className='w-full max-w-md'>
              <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-8'>
                <h2 className='text-2xl font-bold text-gray-900 mb-1'>
                  {isRegister ? 'Create account' : 'Welcome back'}
                </h2>
                <p className='text-sm text-gray-500 mb-6'>
                  {isRegister
                    ? 'Join the community today'
                    : 'Sign in to your account'}
                </p>

                <form onSubmit={handleSubmit} className='space-y-4' id="auth-form">
                  {isRegister && (
                    <>
                      <div>
                        <label htmlFor="fullName" className='block text-sm font-medium text-gray-700 mb-1'>
                          Full Name
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          required
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className='w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white/60 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition'
                        />
                      </div>
                      <div>
                        <label htmlFor="username" className='block text-sm font-medium text-gray-700 mb-1'>
                          Username
                        </label>
                        <input
                          id="username"
                          name="username"
                          type="text"
                          required
                          value={form.username}
                          onChange={handleChange}
                          placeholder="johndoe"
                          className='w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white/60 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition'
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1'>
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className='w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white/60 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition'
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-1'>
                      Password
                    </label>
                    <div className='relative'>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className='w-full px-4 py-2.5 pr-11 rounded-lg border border-gray-300 bg-white/60 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition'
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition'
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                      </button>
                    </div>
                  </div>

                  <button
                    id="auth-submit-btn"
                    type="submit"
                    disabled={loading}
                    className='w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] text-white font-semibold shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed'
                  >
                    {loading && <Loader2 className='w-4 h-4 animate-spin' />}
                    {isRegister ? 'Create Account' : 'Sign In'}
                  </button>
                </form>

                <div className='mt-6 text-center text-sm text-gray-600'>
                  {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    id="auth-toggle-btn"
                    type="button"
                    onClick={() => {
                      setIsRegister(!isRegister)
                      setForm({ email: '', password: '', username: '', fullName: '' })
                    }}
                    className='text-indigo-600 font-semibold hover:text-indigo-800 transition'
                  >
                    {isRegister ? 'Sign In' : 'Sign Up'}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login