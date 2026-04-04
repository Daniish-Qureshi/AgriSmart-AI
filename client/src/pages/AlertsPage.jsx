import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


const navItems = ['Dashboard', 'Simulator', 'Risk Estimator', 'Soil Passport', 'Profit Estimator', 'Seasonal Planner', 'Alerts']
const navIcons = ['📊', '🌿', '⚠️', '🪱', '💰', '📅', '🔔']
const navRoutes = ['/dashboard', '/simulator', '/risk', '/soil', '/profit', '/planner', '/alerts']

const allAlerts = [
  { id: 1, type: 'Weather', icon: '🌧', title: 'Heavy Rain Alert', desc: 'Agle 2 din mein heavy rainfall expected hai. Drainage system check karo aur irrigation band karo.', severity: 'high', time: '2 hours ago', read: false },
  { id: 2, type: 'Market', icon: '📈', title: 'Wheat Price Surge', desc: 'Wheat mandi price 8% badh gaya hai — ₹2,180/quintal. Sell karne ka sahi waqt hai.', severity: 'medium', time: '4 hours ago', read: false },
  { id: 3, type: 'Disease', icon: '🦠', title: 'Aphid Attack Risk', desc: 'Tumhare region mein aphid infestation report hua hai. Neem oil ya imidacloprid spray karo.', severity: 'high', time: '6 hours ago', read: false },
  { id: 4, type: 'Weather', icon: '🌡', title: 'Temperature Drop', desc: 'Raat ka temperature 5°C tak girne ka estimate hai. Frost-sensitive crops ko cover karo.', severity: 'medium', time: '1 day ago', read: true },
  { id: 5, type: 'Market', icon: '📉', title: 'Onion Price Drop', desc: 'Onion market price 12% gir gaya. Storage mein rakho — 2 hafte baad recovery expected.', severity: 'low', time: '1 day ago', read: true },
  { id: 6, type: 'Soil', icon: '🪱', title: 'Soil Moisture Low', desc: 'Tumhari farm location mein soil moisture 18% se niche hai. Irrigation recommend ki jaati hai.', severity: 'medium', time: '2 days ago', read: true },
  { id: 7, type: 'Disease', icon: '🍄', title: 'Fungal Disease Warning', desc: 'Blast disease ke cases nearby farms mein detect hue hain. Fungicide spray karo preventively.', severity: 'high', time: '2 days ago', read: true },
  { id: 8, type: 'Weather', icon: '☀️', title: 'Clear Weather Ahead', desc: 'Agle 5 din sunny aur dry rahenge. Harvesting ke liye best window hai.', severity: 'low', time: '3 days ago', read: true },
]

const sevColor = { high: '#f87171', medium: '#e8b84b', low: '#4caf72' }
const sevBg = { high: 'rgba(239,68,68,0.15)', medium: 'rgba(232,184,75,0.12)', low: 'rgba(76,175,114,0.12)' }
const typeBg = { Weather: 'rgba(96,165,250,0.15)', Market: 'rgba(167,139,250,0.15)', Disease: 'rgba(239,68,68,0.15)', Soil: 'rgba(139,94,60,0.2)' }
const typeColor = { Weather: '#60a5fa', Market: '#a78bfa', Disease: '#f87171', Soil: '#c4895a' }

export default function AlertsPage() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('Alerts')
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Danish', location: 'Dadri, G.B. Nagar' };
  const [filter, setFilter] = useState('All')
  const [alerts, setAlerts] = useState(allAlerts)

  const filtered = filter === 'All' ? alerts : alerts.filter(a => a.type === filter)
  const unread = alerts.filter(a => !a.read).length

  const markRead = (id) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d2818', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>
      {/* <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" /> */}
      <style>{`
        .nav-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;cursor:pointer;transition:all 0.2s;font-size:0.88rem;font-weight:500;color:#a8c4b0;margin-bottom:4px}
        .nav-item:hover{background:rgba(76,175,114,0.1);color:#fff}
        .nav-item.active{background:rgba(232,184,75,0.15);color:#e8b84b;border:1px solid rgba(232,184,75,0.2)}
        .alert-card{background:rgba(26,74,46,0.35);border:1px solid rgba(76,175,114,0.12);border-radius:14px;padding:20px;transition:all 0.3s;cursor:pointer}
        .alert-card:hover{border-color:rgba(232,184,75,0.25);transform:translateX(4px)}
        .alert-card.unread{border-left:3px solid #e8b84b}
        .filter-btn{padding:8px 18px;border-radius:20px;border:1px solid rgba(76,175,114,0.2);background:transparent;color:#a8c4b0;cursor:pointer;font-size:0.82rem;font-family:'DM Sans',sans-serif;transition:all 0.2s}
        .filter-btn:hover{color:#fff;border-color:rgba(255,255,255,0.3)}
        .filter-btn.active{background:rgba(232,184,75,0.15);color:#e8b84b;border-color:rgba(232,184,75,0.3)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.5s ease both}
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .mobile-sidebar-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 90; display: none; pointer-events: none; }
          .mobile-sidebar-overlay.active { display: block; pointer-events: auto; }
          .sidebar { transform: translateX(-100%); transition: transform 0.3s ease; z-index: 65; }
          .sidebar.active { transform: translateX(0); }
          .mobile-menu-btn { display: block !important; position: fixed; top: 20px; left: 20px; z-index: 100; background: #e8b84b; border: none; border-radius: 8px; padding: 8px 12px; color: #0d2818; font-weight: 600; cursor: pointer; }
          .main-content { margin-left: 0 !important; padding: 70px 16px 24px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .filter-section { flex-wrap: wrap !important; gap: 8px !important; }
          .header-section { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
        }
        @media (max-width: 480px) {
          .main-content { padding: 60px 12px 20px !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .alert-card { padding: 16px !important; }
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
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #2d7a4f, #e8b84b)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌾</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700 }}>Agri<span style={{ color: '#e8b84b' }}>Smart</span></span>
        </div>
        <nav style={{ flex: 1 }}>
          {navItems.map((item, i) => (
            <div key={item} className={`nav-item ${activeNav === item ? 'active' : ''}`} onClick={() => { setActiveNav(item); navigate(navRoutes[i]) }}>
              <span>{navIcons[i]}</span>
              {item}
              {item === 'Alerts' && unread > 0 && <span style={{ marginLeft: 'auto', background: '#f87171', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>{unread}</span>}
            </div>
          ))}
        </nav>
        <div onClick={() => navigate('/profile')} style={{ borderTop: '1px solid rgba(76,175,114,0.1)', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2d7a4f,#4caf72)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{user.name.charAt(0).toUpperCase()}</div>
          <div><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div><div style={{ fontSize: '0.72rem', color: '#a8c4b0' }}>{user.location}</div></div>
          <div onClick={() => { localStorage.removeItem('user'); navigate('/'); }} style={{ marginLeft: 'auto', cursor: 'pointer', color: '#a8c4b0' }}>↩</div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-content" style={{ marginLeft: 240, flex: 1, padding: '32px 36px' }}>
        <div className="fade-up header-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🔔</div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700 }}>
                Alert System
                {unread > 0 && <span style={{ marginLeft: 12, fontSize: '0.9rem', padding: '3px 12px', background: 'rgba(248,113,113,0.2)', color: '#f87171', borderRadius: 20, fontWeight: 600 }}>{unread} New</span>}
              </h1>
              <p style={{ color: '#a8c4b0', fontSize: '0.88rem' }}>Weather, disease aur market ki real-time updates</p>
            </div>
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(76,175,114,0.3)', borderRadius: 10, color: '#4caf72', cursor: 'pointer', fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif" }}>
              ✓ Sab Read Mark Karo
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="fade-up stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total Alerts', value: alerts.length, color: '#fff' },
            { label: 'Unread', value: unread, color: '#e8b84b' },
            { label: 'High Priority', value: alerts.filter(a => a.severity === 'high').length, color: '#f87171' },
            { label: 'Weather', value: alerts.filter(a => a.type === 'Weather').length, color: '#60a5fa' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '16px 20px', background: 'rgba(26,74,46,0.35)', border: '1px solid rgba(76,175,114,0.15)', borderRadius: 12 }}>
              <div style={{ fontSize: '0.72rem', color: '#a8c4b0', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="fade-up filter-section" style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['All', 'Weather', 'Market', 'Disease', 'Soil'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        {/* Alerts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((a, i) => (
            <div key={a.id} className={`alert-card ${!a.read ? 'unread' : ''}`} onClick={() => markRead(a.id)} style={{ animationDelay: `${i * 0.05}s` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: typeBg[a.type], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{a.title}</span>
                    <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600, background: sevBg[a.severity], color: sevColor[a.severity], textTransform: 'uppercase' }}>{a.severity}</span>
                    <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: '0.68rem', background: typeBg[a.type], color: typeColor[a.type] }}>{a.type}</span>
                    {!a.read && <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '0.65rem', background: 'rgba(232,184,75,0.2)', color: '#e8b84b', fontWeight: 600 }}>NEW</span>}
                  </div>
                  <p style={{ color: '#a8c4b0', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 8 }}>{a.desc}</p>
                  <span style={{ fontSize: '0.75rem', color: '#6b8f7a' }}>🕐 {a.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}