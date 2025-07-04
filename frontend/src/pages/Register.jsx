import { useState } from "react"
import { authApi } from "../lib/api"
import { useNavigate, Link } from "react-router-dom"

export default function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await authApi.register({ username, password })
            navigate("/login")
        } catch (err) {
            setError("Registration failed. Try a different username.")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="bg-muted p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
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
                    Register
                </button>
                <div className="mt-4 text-center">
                    <span>Already have an account? </span>
                    <Link to="/login" className="text-primary underline">
                        Login
                    </Link>
                </div>
            </form>
        </div>
    )
}