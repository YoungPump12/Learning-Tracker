import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'


export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await axios.post("https://api.tafadzwa.co/api/register/", {
        username,
        email,
        password
      })
      navigate('/login')
    } catch (err) {
  console.log(err.response.data)
  alert(JSON.stringify(err.response.data))
}

  }

  return (
    <div className="page-shell">
      <div className="floating-blob" style={{ top: "-14%", left: "-8%" }} />
      <div className="floating-blob" style={{ bottom: "-12%", right: "-10%" }} />

      <div className="glass-card" style={{ maxWidth: 480, width: "100%", padding: "2.2rem" }}>
        <div className="pill" style={{ marginBottom: "1rem", width: "fit-content" }}>
          <span>✨</span>
          <span>Create your account</span>
        </div>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <input className="field" placeholder="Username" id="register-username" name="username"
            onChange={(e) => setUsername(e.target.value)} />
          <input className="field" placeholder="Email" id="register-email" name="email"
            onChange={(e) => setEmail(e.target.value)} />
          <input className="field" type="password" placeholder="Password" id="register-password" name="password"
            onChange={(e) => setPassword(e.target.value)} />

          <button className="btn-primary" type="submit">Register</button>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button type="button" className="btn-ghost">Already have an account? Login</button>
          </Link>
        </form>
      </div>
    </div>
  )
}
