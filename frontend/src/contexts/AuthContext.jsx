import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '@/lib/api'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      // Verify token validity
      checkAuthStatus()
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await authApi.me()
      setUser(response.data)
    } catch (error) {
      localStorage.removeItem('authToken')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    const response = await authApi.login(credentials)
    const { token, user } = response.data
    localStorage.setItem('authToken', token)
    setUser(user)
    return response
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      localStorage.removeItem('authToken')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)