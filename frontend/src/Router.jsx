import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/app-layout'
import Dashboard from './pages/Dashboard'
import Notes from './pages/Notes'
import Login from './pages/Login'
import Register from './pages/Register'

export default function Router() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="" element={<Dashboard />} />
                <Route path="notes" element={<Notes />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>
        </Routes>
    )
}
