import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, Link, useSearchParams } from "react-router-dom"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        if (searchParams.get("registered")) {
            setSuccessMessage("Registration successful! Please log in.")
        }
    }, [searchParams])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccessMessage("")
        try {
            const response = await axios.post("/api/login", {
                username,
                password,
            })

            const token = response.data.access_token
            if (token) {
                localStorage.setItem("token", token)
                localStorage.setItem("username", username)
                navigate("/")
                window.location.reload()
            } else {
                setError("Login failed: No token received.")
            }
        } catch (err) {
            // --- Improved Error Handling ---
            if (err.response) {
                setError(err.response.data.detail || "Invalid username or password.")
            } else if (err.request) {
                setError("Cannot connect to the server. Please try again later.")
            } else {
                setError("An unexpected error occurred.")
            }
            console.error("Login error:", err)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form
                onSubmit={handleSubmit}
                className="bg-muted p-8 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                {successMessage && <div className="mb-4 text-green-500 text-center">{successMessage}</div>}
                <div className="mb-4">
                    <label className="block mb-1">Username</label>
                    <input
                        className="w-full px-3 py-2 rounded border bg-transparent"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        onChange={(e) => setPassword(e.target.value)}
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
                    <span> Don't have an account? </span>
                    <Link to="/register" className="text-primary underline">
                        Create one
                    </Link>
                </div>
            </form>
        </div>
    )
}