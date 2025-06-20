import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../lib/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check if user is logged in on app start - only run once
    useEffect(() => {
        let isMounted = true
        
        const checkAuth = async () => {
            try {
                const response = await authApi.me()
                if (isMounted) {
                    setUser(response.data)
                }
            } catch (error) {
                if (isMounted) {
                    setUser(null)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }
        
        checkAuth()
        
        return () => {
            isMounted = false
        }
    }, []) // Empty dependency array - only run once

    const login = async (credentials) => {
        const response = await authApi.login(credentials)
        setUser(response.data.user)
        return response
    }

    const logout = async () => {
        try {
            await authApi.logout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            setUser(null)
        }
    }

    const value = {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}