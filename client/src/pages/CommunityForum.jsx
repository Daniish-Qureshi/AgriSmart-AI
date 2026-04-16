import { API_URL } from '../config'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const navItems = ['Dashboard', 'Simulator', 'Govt Schemes', 'Disease Scan', 'Risk Estimator', 'Soil Passport', 'Profit Estimator', 'Seasonal Planner', 'Crop Calendar', 'Community Forum', 'Alerts', 'Equipment Rental', 'Wallet']
const navIcons = ['📊', '🌿', '🏛️', '🦠', '⚠️', '🪱', '💰', '📅', '🗓️', '👥', '🔔', '🛠️', '👛']
const navRoutes = ['/dashboard', '/simulator', '/schemes', '/disease', '/risk', '/soil', '/profit', '/planner', '/crop-calendar', '/forum', '/alerts', '/rental', '/wallet']

export default function CommunityForum() {
  const [activeNav, setActiveNav] = useState('Community Forum')
  const [question, setQuestion] = useState('')
  const [details, setDetails] = useState('')
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('')
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Farmer' }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return navigate('/')

    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/data/forum`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Unable to load forum posts')
        setPosts(await res.json())
      } catch (err) {
        setStatus(err.message)
      }
    }

    fetchPosts()
  }, [navigate])

  const submitQuestion = async () => {
    if (!question.trim()) {
      setStatus('Please type your question.')
      return
    }
    const token = localStorage.getItem('token')
    if (!token) return navigate('/')

    try {
      const res = await fetch(`${API_URL}/api/data/forum`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question, details })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to post question')
      }

      const saved = await res.json()
      setPosts(prev => [{ ...saved, user_name: user.name, user_location: user.location || '' }, ...prev])
      setQuestion('')
      setDetails('')
      setStatus('Question posted successfully.')
    } catch (err) {
      setStatus(err.message)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d2818', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>
      <style>{`
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px; cursor: pointer; transition: all 0.2s; font-size: 0.88rem; font-weight: 500; color: #a8c4b0; margin-bottom: 4px; }
        .nav-item:hover { background: rgba(76,175,114,0.1); color: #fff; }
        .nav-item.active { background: rgba(232,184,75,0.15); color: #e8b84b; border: 1px solid rgba(232,184,75,0.2); }
        .dash-card { background: rgba(26,74,46,0.4); border: 1px solid rgba(76,175,114,0.15); border-radius: 16px; padding: 24px; transition: border-color 0.3s; }
        .dash-card:hover { border-color: rgba(232,184,75,0.25); }
        .form-field { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(76,175,114,0.12); border-radius: 12px; color: #fff; padding: 14px 16px; margin-top: 10px; }
        .form-field::placeholder { color: rgba(255,255,255,0.55); }
        .post-card { background: rgba(0,0,0,0.2); border: 1px solid rgba(76,175,114,0.1); border-radius: 16px; padding: 20px; margin-bottom: 16px; }
        .post-meta { color: #a8c4b0; font-size: 0.8rem; margin-bottom: 10px; }
      `}</style>

      <div className="sidebar" style={{ width: 240, background: 'rgba(13,40,24,0.95)', borderRight: '1px solid rgba(76,175,114,0.12)', padding: '24px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 28px', borderBottom: '1px solid rgba(76,175,114,0.1)', marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #2d7a4f, #e8b84b)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌾</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700 }}>Agri<span style={{ color: '#e8b84b' }}>Smart</span></span>
        </div>
        <nav style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {navItems.map((item, i) => (
            <div key={item} className={`nav-item ${activeNav === item ? 'active' : ''}`} onClick={() => { setActiveNav(item); navigate(navRoutes[i]) }}>
              <span style={{ fontSize: '1rem' }}>{navIcons[i]}</span>{item}
            </div>
          ))}
        </nav>
        <div onClick={() => navigate('/profile')} style={{ borderTop: '1px solid rgba(76,175,114,0.1)', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #2d7a4f, #4caf72)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700 }}>{(user.name || 'U').charAt(0).toUpperCase()}</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#a8c4b0' }}>{user.location || 'Farmer'}</div>
          </div>
          <div onClick={() => { localStorage.removeItem('user'); localStorage.removeItem('token'); navigate('/'); }} style={{ marginLeft: 'auto', cursor: 'pointer', color: '#a8c4b0', fontSize: '0.8rem' }} title="Logout">↩</div>
        </div>
      </div>

      <div className="main-content" style={{ marginLeft: 240, flex: 1, padding: '32px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>Community Forum</h1>
            <p style={{ color: '#a8c4b0', maxWidth: 640 }}>Farmers can post questions, read other members’ queries, and keep the community discussion saved in the database.</p>
          </div>
        </div>

        <div className="dash-card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ask the community</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Question karo aur help lo</div>
            </div>
            <button onClick={submitQuestion} style={{ background: '#e8b84b', color: '#0d2818', border: 'none', borderRadius: 12, padding: '14px 22px', fontWeight: 700, cursor: 'pointer' }}>Submit Question</button>
          </div>
          <div>
            <input value={question} onChange={e => setQuestion(e.target.value)} className="form-field" placeholder="Aapka sawaal kya hai?" />
            <textarea value={details} onChange={e => setDetails(e.target.value)} className="form-field" rows={5} placeholder="Zaroori details ya context yahan likhen (optional)." style={{ marginTop: 12 }} />
            {status && <div style={{ marginTop: 12, color: '#e8b84b' }}>{status}</div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {posts.length === 0 ? (
            <div className="dash-card" style={{ textAlign: 'center', padding: 40, color: '#a8c4b0' }}>
              Koi sawaal abhi tak nahi hua. Pehla sawaal puchho!
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-meta">{post.user_name} · {post.user_location || 'Farmers Community'} · {new Date(post.created_at).toLocaleString()}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10 }}>{post.question}</div>
                {post.details && <div style={{ color: '#d7dfc6', lineHeight: 1.7 }}>{post.details}</div>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
