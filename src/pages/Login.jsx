import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = "https://api.tafadzwa.co/api/token/"

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axios.post(API_URL, { username, password })

      console.log("Login success:", res.data)

      // Save JWT tokens
      localStorage.setItem("access", res.data.access)
      localStorage.setItem("refresh", res.data.refresh)

      // Redirect to dashboard after login
      navigate('/dashboard')



    } catch (err) {
      console.error("Login error:", err)
      setError(err.response?.data?.detail || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="floating-blob" style={{ top: "-12%", right: "-8%" }} />
      <div className="floating-blob" style={{ bottom: "-10%", left: "-12%" }} />

      <div className="glass-card" style={{ maxWidth: 420, width: "100%", padding: "2.1rem" }}>
        <div className="pill" style={{ marginBottom: "1rem", width: "fit-content" }}>
          <span>🔐</span>
          <span>Sign in</span>
        </div>

        {error && (
          <div style={{ marginBottom: "0.75rem", color: "#fecdd3", background: "rgba(248,113,113,0.14)", border: "1px solid rgba(248,113,113,0.35)", padding: "0.65rem 0.8rem", borderRadius: 12 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <input
            id="login-username"
            name="username"
            type="text"
            className="field"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />

          <input
            id="login-password"
            name="password"
            type="password"
            className="field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <Link to="/register" style={{ textDecoration: "none" }}>
            <button type="button" className="btn-ghost">Need an account? Register</button>
          </Link>
        </form>
      </div>
    </div>
  )
}
