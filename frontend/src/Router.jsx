import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/app-layout'
import Dashboard from './pages/Dashboard'
import Notes from './pages/Notes'

export default function Router() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="" element={<Dashboard />} />
                <Route path="notes" element={<Notes />} />
            </Route>
        </Routes>
    )
}
