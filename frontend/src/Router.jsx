import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/app-layout'
import { useAuth } from './contexts/AuthContext'
import Dashboard from './pages/Dashboard'
import Notes from './pages/Notes'
import Login from './pages/Login'
import Register from './pages/Register'

export default function Router() {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        )
    }

    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="" element={<Dashboard />} />
                <Route path="notes" element={<Notes />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>
        </Routes>
    )
}
