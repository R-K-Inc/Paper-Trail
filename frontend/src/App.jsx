import { BrowserRouter, HashRouter } from 'react-router-dom' 
import { ThemeProvider } from './contexts/ThemeContext'
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from './contexts/AuthContext'
import Router from './Router'

const AppRouter = import.meta.env.VITE_USE_HASH_ROUTE === 'true' ? HashRouter : BrowserRouter

export default function App() {
    return (
        <ThemeProvider>
            <AppRouter>
                <AuthProvider>
                    <Router />
                    <Toaster />
                </AuthProvider>
            </AppRouter>
        </ThemeProvider>
    )
}
