import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const payload = isLogin
        ? { email, password }
        : { name, email, password, location }

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed')
      }

      // Automatically go to dashboard on success
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d2818', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>

      {/* <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" /> */}

      <style>{`
        .input-field { width: 100%; padding: 13px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(76,175,114,0.2); border-radius: 10px; color: #fff; font-size: 0.92rem; outline: none; transition: border-color 0.3s; font-family: 'DM Sans', sans-serif; }
        .input-field::placeholder { color: #a8c4b0; }
        .input-field:focus { border-color: rgba(232,184,75,0.5); }
        .submit-btn { width: 100%; padding: 14px; background: #e8b84b; color: #0d2818; border: none; border-radius: 10px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.3s; font-family: 'DM Sans', sans-serif; }
        .submit-btn:hover { background: #f5d07a; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(232,184,75,0.3); }
        .tab-btn { flex: 1; padding: 11px; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s; font-family: 'DM Sans', sans-serif; }
        .tab-active { background: #e8b84b; color: #0d2818; }
        .tab-inactive { background: transparent; color: #a8c4b0; }
        .tab-inactive:hover { color: #fff; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .card-anim { animation: fadeUp 0.6s ease both; }
      `}</style>

      {/* BG Circles */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: '#2d7a4f', filter: 'blur(100px)', opacity: 0.15, top: -150, right: -100, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: '#e8b84b', filter: 'blur(100px)', opacity: 0.08, bottom: -100, left: -50, pointerEvents: 'none' }} />

      <div className="card-anim" style={{ width: '100%', maxWidth: 440, padding: '0 20px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #2d7a4f, #e8b84b)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🌾</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
              Agri<span style={{ color: '#e8b84b' }}>Smart</span>
            </span>
          </a>
          <p style={{ color: '#a8c4b0', fontSize: '0.88rem', marginTop: 10 }}>
            {isLogin ? 'Apne account me login karo' : 'Naya account banao — free hai'}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(26,74,46,0.35)', border: '1px solid rgba(76,175,114,0.2)', borderRadius: 24, padding: '36px 32px', backdropFilter: 'blur(20px)' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 6, marginBottom: 30 }}>
            <button className={`tab-btn ${isLogin ? 'tab-active' : 'tab-inactive'}`} onClick={() => setIsLogin(true)}>Login</button>
            <button className={`tab-btn ${!isLogin ? 'tab-active' : 'tab-inactive'}`} onClick={() => setIsLogin(false)}>Sign Up</button>
          </div>

          {/* Form */}
          <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={handleSubmit}>

            {error && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', fontSize: '0.85rem' }}>{error}</div>}

            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 7, fontWeight: 500 }}>Poora Naam</label>
                <input className="input-field" type="text" placeholder="Jaise: Ramesh Kumar" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 7, fontWeight: 500 }}>Email Address</label>
              <input className="input-field" type="email" placeholder="aapka@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 7, fontWeight: 500 }}>Location (Shehar / Gaon)</label>
                <input className="input-field" type="text" placeholder="Jaise: Dadri, G.B. Nagar" value={location} onChange={e => setLocation(e.target.value)} required />
              </div>
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label style={{ fontSize: '0.82rem', color: '#a8c4b0', fontWeight: 500 }}>Password</label>
                {isLogin && <a href="#" style={{ fontSize: '0.78rem', color: '#e8b84b', textDecoration: 'none' }}>Bhool gaye?</a>}
              </div>
              <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 7, fontWeight: 500 }}>Confirm Password</label>
                <input className="input-field" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
            )}

            <button type="submit" className="submit-btn" style={{ marginTop: 8 }} disabled={loading}>
              {loading ? '⏳ Please Wait...' : isLogin ? '🚀 Login Karo' : '🌾 Account Banao'}
            </button>

          </form>



        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: '#a8c4b0' }}>
          {isLogin ? "Account nahi hai? " : "Pehle se account hai? "}
          <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#e8b84b', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif" }}>
            {isLogin ? 'Sign Up Karo' : 'Login Karo'}
          </button>
        </p>

      </div>
    </div>
  )
}