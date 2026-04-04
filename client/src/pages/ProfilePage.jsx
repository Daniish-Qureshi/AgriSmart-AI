import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const navItems = ['Dashboard', 'Simulator', 'Risk Estimator', 'Soil Passport', 'Profit Estimator', 'Seasonal Planner', 'Alerts']
const navIcons = ['📊', '🌿', '⚠️', '🪱', '💰', '📅', '🔔']
const navRoutes = ['/dashboard', '/simulator', '/risk', '/soil', '/profit', '/planner', '/alerts']

export default function ProfilePage() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('')
  const user = JSON.parse(localStorage.getItem('user')) || {}
  const fileRef = useRef()

  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    mobile: user.mobile || '',
    location: user.location || '',
    farmSize: user.farmSize || '',
    soilType: user.soilType || '',
    experience: user.experience || '',
  })

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [avatar, setAvatar] = useState(user.avatar || null)
  const [savedMsg, setSavedMsg] = useState('')
  const [passMsg, setPassMsg] = useState('')
  const [activeTab, setActiveTab] = useState('profile')

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setAvatar(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const saveProfile = () => {
    const updated = { ...user, ...form, avatar }
    localStorage.setItem('user', JSON.stringify(updated))
    setSavedMsg('✅ Profile saved successfully!')
    setTimeout(() => setSavedMsg(''), 3000)
  }

  const savePassword = () => {
    if (!passwords.newPass || passwords.newPass !== passwords.confirm) {
      setPassMsg('❌ Passwords match nahi ho rahe!')
      setTimeout(() => setPassMsg(''), 3000)
      return
    }
    if (passwords.newPass.length < 6) {
      setPassMsg('❌ Password kam se kam 6 characters ka hona chahiye!')
      setTimeout(() => setPassMsg(''), 3000)
      return
    }
    setPassMsg('✅ Password updated!')
    setPasswords({ current: '', newPass: '', confirm: '' })
    setTimeout(() => setPassMsg(''), 3000)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d2818', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>
      {/* <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" /> */}
      <style>{`
        .nav-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;cursor:pointer;transition:all 0.2s;font-size:0.88rem;font-weight:500;color:#a8c4b0;margin-bottom:4px}
        .nav-item:hover{background:rgba(76,175,114,0.1);color:#fff}
        .nav-item.active{background:rgba(232,184,75,0.15);color:#e8b84b;border:1px solid rgba(232,184,75,0.2)}
        .input-field{width:100%;padding:12px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(76,175,114,0.2);border-radius:10px;color:#fff;font-size:0.9rem;outline:none;transition:border-color 0.3s;font-family:'DM Sans',sans-serif;box-sizing:border-box}
        .input-field::placeholder{color:#a8c4b0}
        .input-field:focus{border-color:rgba(232,184,75,0.5)}
        .select-field{width:100%;padding:12px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(76,175,114,0.2);border-radius:10px;color:#fff;font-size:0.9rem;outline:none;cursor:pointer;font-family:'DM Sans',sans-serif}
        .select-field option{background:#1a4a2e}
        .save-btn{padding:13px 32px;background:#e8b84b;color:#0d2818;border:none;border-radius:10px;font-weight:700;font-size:0.95rem;cursor:pointer;transition:all 0.3s;font-family:'DM Sans',sans-serif}
        .save-btn:hover{background:#f5d07a;transform:translateY(-2px);box-shadow:0 8px 20px rgba(232,184,75,0.3)}
        .tab-btn{padding:10px 24px;border:none;border-radius:8px;font-size:0.88rem;font-weight:600;cursor:pointer;transition:all 0.3s;font-family:'DM Sans',sans-serif}
        .tab-active{background:rgba(232,184,75,0.15);color:#e8b84b;border:1px solid rgba(232,184,75,0.3)}
        .tab-inactive{background:transparent;color:#a8c4b0;border:1px solid transparent}
        .tab-inactive:hover{color:#fff}
        .card{background:rgba(26,74,46,0.4);border:1px solid rgba(76,175,114,0.15);border-radius:16px;padding:28px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.5s ease both}
        label{display:block;font-size:0.8rem;color:#a8c4b0;margin-bottom:7px;font-weight:500}
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .mobile-sidebar-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 90; display: none; pointer-events: none; }
          .mobile-sidebar-overlay.active { display: block; pointer-events: auto; }
          .sidebar { transform: translateX(-100%); transition: transform 0.3s ease; z-index: 65; }
          .sidebar.active { transform: translateX(0); }
          .mobile-menu-btn { display: block !important; position: fixed; top: 20px; left: 20px; z-index: 100; background: #e8b84b; border: none; border-radius: 8px; padding: 8px 12px; color: #0d2818; font-weight: 600; cursor: pointer; }
          .main-content { margin-left: 0 !important; padding: 70px 16px 24px !important; }
          .form-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .avatar-section { flex-direction: column !important; align-items: center !important; text-align: center !important; }
          .tabs-section { flex-direction: column !important; gap: 8px !important; }
        }
        @media (max-width: 480px) {
          .main-content { padding: 60px 12px 20px !important; }
          .card { padding: 20px !important; }
          .save-btn { width: 100% !important; padding: 15px !important; }
        }
      `}</style>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.mobile-sidebar-overlay');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
      }} style={{ display: 'none' }}>
        ☰ Menu
      </button>
      
      {/* Mobile Overlay */}
      <div className="mobile-sidebar-overlay" onClick={() => {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.mobile-sidebar-overlay');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
      }} />

      {/* SIDEBAR */}
      <div className="sidebar" style={{ width: 240, background: 'rgba(13,40,24,0.95)', borderRight: '1px solid rgba(76,175,114,0.12)', padding: '24px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 28px', borderBottom: '1px solid rgba(76,175,114,0.1)', marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#2d7a4f,#e8b84b)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌾</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 700 }}>Agri<span style={{ color: '#e8b84b' }}>Smart</span></span>
        </div>
        <nav style={{ flex: 1 }}>
          {navItems.map((item, i) => (
            <div key={item} className={`nav-item ${activeNav === item ? 'active' : ''}`} onClick={() => { setActiveNav(item); navigate(navRoutes[i]) }}>
              <span>{navIcons[i]}</span>{item}
            </div>
          ))}
        </nav>
        {/* User — clickable */}
        <div onClick={() => navigate('/profile')} style={{ borderTop: '1px solid rgba(76,175,114,0.1)', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '16px 8px 8px', borderRadius: 10, background: 'rgba(232,184,75,0.08)', border: '1px solid rgba(232,184,75,0.2)', marginTop: 16 }}>
          {avatar
            ? <img src={avatar} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
            : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2d7a4f,#4caf72)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>{(user.name || 'U').charAt(0).toUpperCase()}</div>
          }
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: '0.7rem', color: '#e8b84b' }}>View Profile →</div>
          </div>
          <div onClick={(e) => { e.stopPropagation(); localStorage.removeItem('user'); localStorage.removeItem('token'); navigate('/') }} style={{ marginLeft: 'auto', cursor: 'pointer', color: '#a8c4b0' }}>↩</div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-content" style={{ marginLeft: 240, flex: 1, padding: '32px 36px', maxWidth: 900 }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, background: 'rgba(232,184,75,0.15)', border: '1px solid rgba(232,184,75,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👤</div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', fontWeight: 700 }}>My Profile</h1>
              <p style={{ color: '#a8c4b0', fontSize: '0.88rem' }}>Apni personal aur farming details manage karo</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="fade-up tabs-section" style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {[['profile', '👤 Profile Details'], ['farm', '🌾 Farm Details'], ['password', '🔒 Password']].map(([key, label]) => (
            <button key={key} className={`tab-btn ${activeTab === key ? 'tab-active' : 'tab-inactive'}`} onClick={() => setActiveTab(key)}>{label}</button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Avatar */}
            <div className="card avatar-section" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileRef.current.click()}>
                {avatar
                  ? <img src={avatar} alt="avatar" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e8b84b' }} />
                  : <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#2d7a4f,#4caf72)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, border: '3px solid #e8b84b' }}>
                      {(form.name || 'U').charAt(0).toUpperCase()}
                    </div>
                }
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, background: '#e8b84b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✏️</div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 700 }}>{form.name || 'Your Name'}</div>
                <div style={{ fontSize: '0.82rem', color: '#a8c4b0', marginTop: 4 }}>{form.email}</div>
                <div style={{ fontSize: '0.75rem', color: '#e8b84b', marginTop: 6, cursor: 'pointer' }} onClick={() => fileRef.current.click()}>📷 Photo change karo</div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="card">
              <div style={{ fontSize: '0.75rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>Personal Information</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-grid">
                <div>
                  <label>Full Name</label>
                  <input className="input-field" type="text" placeholder="Apna naam likhो" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label>Email Address</label>
                  <input className="input-field" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label>Mobile Number</label>
                  <input className="input-field" type="tel" placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
                </div>
                <div>
                  <label>Location (Shehar / Gaon)</label>
                  <input className="input-field" type="text" placeholder="Jaise: Dadri, G.B. Nagar" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
              </div>
            </div>

            {savedMsg && <div style={{ padding: '12px 16px', background: 'rgba(76,175,114,0.15)', border: '1px solid rgba(76,175,114,0.3)', borderRadius: 10, color: '#4caf72', fontSize: '0.88rem' }}>{savedMsg}</div>}
            <button className="save-btn" onClick={saveProfile}>💾 Profile Save Karo</button>
          </div>
        )}

        {/* Farm Tab */}
        {activeTab === 'farm' && (
          <div className="fade-up card">
            <div style={{ fontSize: '0.75rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>Farm Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label>Farm Size (Acres)</label>
                <input className="input-field" type="number" placeholder="Jaise: 4.5" value={form.farmSize} onChange={e => setForm({ ...form, farmSize: e.target.value })} />
              </div>
              <div>
                <label>Soil Type</label>
                <select className="select-field" value={form.soilType} onChange={e => setForm({ ...form, soilType: e.target.value })}>
                  <option value="">-- Select karo --</option>
                  <option>Loamy</option>
                  <option>Sandy</option>
                  <option>Clay</option>
                  <option>Silty</option>
                  <option>Rocky</option>
                </select>
              </div>
              <div>
                <label>Farming Experience</label>
                <select className="select-field" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}>
                  <option value="">-- Select karo --</option>
                  <option>0-2 years (Beginner)</option>
                  <option>3-5 years (Intermediate)</option>
                  <option>5-10 years (Experienced)</option>
                  <option>10+ years (Expert)</option>
                </select>
              </div>
              <div>
                <label>Primary Crop</label>
                <select className="select-field" value={form.primaryCrop} onChange={e => setForm({ ...form, primaryCrop: e.target.value })}>
                  <option value="">-- Select karo --</option>
                  {['Wheat', 'Rice', 'Mustard', 'Pea', 'Onion', 'Cotton', 'Sugarcane'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {savedMsg && <div style={{ padding: '12px 16px', background: 'rgba(76,175,114,0.15)', border: '1px solid rgba(76,175,114,0.3)', borderRadius: 10, color: '#4caf72', fontSize: '0.88rem', marginTop: 16 }}>{savedMsg}</div>}
            <button className="save-btn" onClick={saveProfile} style={{ marginTop: 20 }}>💾 Farm Details Save Karo</button>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="fade-up card">
            <div style={{ fontSize: '0.75rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>Password Change Karo</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
              <div>
                <label>Current Password</label>
                <input className="input-field" type="password" placeholder="••••••••" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} />
              </div>
              <div>
                <label>New Password</label>
                <input className="input-field" type="password" placeholder="••••••••" value={passwords.newPass} onChange={e => setPasswords({ ...passwords, newPass: e.target.value })} />
              </div>
              <div>
                <label>Confirm New Password</label>
                <input className="input-field" type="password" placeholder="••••••••" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} />
              </div>
              <div style={{ padding: '12px 16px', background: 'rgba(232,184,75,0.08)', border: '1px solid rgba(232,184,75,0.2)', borderRadius: 10, fontSize: '0.8rem', color: '#f5d07a' }}>
                💡 Password kam se kam 6 characters ka hona chahiye
              </div>
              {passMsg && <div style={{ padding: '12px 16px', background: passMsg.includes('✅') ? 'rgba(76,175,114,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${passMsg.includes('✅') ? 'rgba(76,175,114,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 10, color: passMsg.includes('✅') ? '#4caf72' : '#f87171', fontSize: '0.88rem' }}>{passMsg}</div>}
              <button className="save-btn" onClick={savePassword}>🔒 Password Update Karo</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}