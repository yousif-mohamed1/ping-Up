import React, { createContext, useContext, useState, useEffect } from 'react'
import { api, apiToken, normalizeUser } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, check if we have a saved token and fetch current user
  useEffect(() => {
    const token = apiToken.get()
    if (token) {
      api.users.me()
        .then((data) => setUser(normalizeUser(data)))
        .catch(() => {
          apiToken.clear()
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const response = await api.auth.login({ email, password })
    if (response?.token) {
      apiToken.set(response.token)
      const me = await api.users.me()
      setUser(normalizeUser(me))
    }
    return response
  }

  const register = async ({ email, username, fullName, password }) => {
    const response = await api.auth.register({ email, username, fullName, password })
    if (response?.token) {
      apiToken.set(response.token)
      const me = await api.users.me()
      setUser(normalizeUser(me))
    }
    return response
  }

  const signOut = () => {
    apiToken.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
