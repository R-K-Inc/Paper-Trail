import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const response = await axios.post("/api/login", { username, password })
            // If your backend returns a token, save it (e.g., localStorage)
            // localStorage.setItem("token", response.data.token)
            if (onLogin) onLogin(response.data)
        } catch (err) {
            setError("Invalid username or password")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="bg-muted p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                <div className="mb-4">
                    <label className="block mb-1">Username</label>
                    <input
                        className="w-full px-3 py-2 rounded border bg-transparent"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        autoFocus
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-1">Password</label>
                    <input
                        className="w-full px-3 py-2 rounded border bg-transparent"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary text-black py-2 rounded hover:bg-primary-dark transition"
                >
                    Login
                </button>
                <div className="mt-4 text-center">
                    <span>Don't have an account? </span>
                    <Link to="/register" className="text-primary underline">
                        Create one
                    </Link>
                </div>
            </form>
        </div>
    )
}