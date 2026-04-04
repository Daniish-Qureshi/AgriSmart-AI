import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const navItems = ['Dashboard', 'Simulator', 'Risk Estimator', 'Soil Passport', 'Profit Estimator', 'Seasonal Planner', 'Alerts']
const navIcons = ['📊', '🌿', '⚠️', '🪱', '💰', '📅', '🔔']
const navRoutes = ['/dashboard', '/simulator', '/risk', '/soil', '/profit', '/planner', '/alerts']

const plannerData = {
  Rabi: [
    { month: 'October', tasks: ['Khet ki jotai karo', 'Soil test karwao', 'Seeds aur fertilizer ready karo'], status: 'done', tip: 'Mitti mein moisture check karo pehle' },
    { month: 'November', tasks: ['Wheat/Mustard seeds boao', 'Pehli irrigation do', 'DAP fertilizer dalo'], status: 'done', tip: 'Sowing depth 4-5cm rakhna' },
    { month: 'December', tasks: ['Weeding karo', 'Urea fertilizer dalo', 'Frost se bachao'], status: 'active', tip: 'Raat ko temperature girta hai, dhyan rakho' },
    { month: 'January', tasks: ['2nd irrigation do', 'Aphid spray karo', 'Crop growth check karo'], status: 'upcoming', tip: 'Aphid attack Rabi me common hai' },
    { month: 'February', tasks: ['3rd irrigation do', 'Pest control karo', 'Mandi price track karo'], status: 'upcoming', tip: 'Market prices February me peak karte hain' },
    { month: 'March', tasks: ['Harvesting prepare karo', 'Combine harvester book karo', 'Storage arrange karo'], status: 'upcoming', tip: 'Cutting golden yellow color par karo' },
  ],
  Kharif: [
    { month: 'June', tasks: ['Khet ready karo', 'Seeds purchase karo', 'Irrigation system check karo'], status: 'done', tip: 'Pre-monsoon preparation zaruri hai' },
    { month: 'July', tasks: ['Rice/Cotton boao', 'Transplanting karo', 'Khad dalo'], status: 'active', tip: 'Monsoon ka faida uthao' },
    { month: 'August', tasks: ['Weeding karo', 'Pest spray karo', 'Growth monitor karo'], status: 'upcoming', tip: 'BPH aur stem borer se bachao' },
    { month: 'September', tasks: ['Fertilizer do', 'Irrigation karo', 'Disease check karo'], status: 'upcoming', tip: 'Blast disease Rice me common hai' },
    { month: 'October', tasks: ['Harvesting karo', 'Threshing karo', 'Storage mein rakho'], status: 'upcoming', tip: 'Moisture 14% se kam hone par store karo' },
  ],
  Zaid: [
    { month: 'March', tasks: ['Seeds prepare karo', 'Irrigation channel banao', 'Soil prepare karo'], status: 'done', tip: 'Zaid me irrigation zyada chahiye' },
    { month: 'April', tasks: ['Vegetables/Watermelon boao', 'Daily irrigation karo', 'Shade net lagao'], status: 'active', tip: 'Garmi se seedlings ko bachao' },
    { month: 'May', tasks: ['Pest control karo', 'Fertilizer dalo', 'Harvest start karo'], status: 'upcoming', tip: 'Heat stress se fasal ko protect karo' },
    { month: 'June', tasks: ['Final harvest karo', 'Market bhejo', 'Khet agle season ke liye taiyar karo'], status: 'upcoming', tip: 'Early morning harvest karo — quality better hoti hai' },
  ],
}

export default function SeasonalPlanner() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('Seasonal Planner')
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Danish', location: 'Dadri, G.B. Nagar' };
  const [season, setSeason] = useState('Rabi')

  const plan = plannerData[season]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d2818', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>
      {/* <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" /> */}
      <style>{`
        .nav-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;cursor:pointer;transition:all 0.2s;font-size:0.88rem;font-weight:500;color:#a8c4b0;margin-bottom:4px}
        .nav-item:hover{background:rgba(76,175,114,0.1);color:#fff}
        .nav-item.active{background:rgba(232,184,75,0.15);color:#e8b84b;border:1px solid rgba(232,184,75,0.2)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.5s ease both}
        .month-card{background:rgba(26,74,46,0.35);border:1px solid rgba(76,175,114,0.15);border-radius:16px;padding:22px;transition:all 0.3s;position:relative}
        .month-card:hover{border-color:rgba(232,184,75,0.25);transform:translateY(-3px)}
        .month-card.active-card{border-color:rgba(232,184,75,0.4);background:rgba(232,184,75,0.07)}
        .task-item{display:flex;align-items:flex-start;gap:8px;padding:7px 0;font-size:0.83rem;color:#d0d0d0;border-bottom:1px solid rgba(255,255,255,0.04)}
        .task-item:last-child{border-bottom:none}
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .mobile-sidebar-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 90; display: none; pointer-events: none; }
          .mobile-sidebar-overlay.active { display: block; pointer-events: auto; }
          .sidebar { transform: translateX(-100%); transition: transform 0.3s ease; z-index: 65; }
          .sidebar.active { transform: translateX(0); }
          .mobile-menu-btn { display: block !important; position: fixed; top: 20px; left: 20px; z-index: 100; background: #e8b84b; border: none; border-radius: 8px; padding: 8px 12px; color: #0d2818; font-weight: 600; cursor: pointer; }
          .main-content { margin-left: 0 !important; padding: 70px 16px 24px !important; }
          .month-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .header-section { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
          .legend-section { flex-wrap: wrap !important; gap: 12px !important; }
        }
        @media (max-width: 480px) {
          .main-content { padding: 60px 12px 20px !important; }
          .month-card { padding: 16px !important; }
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
              <span>{navIcons[i]}</span>{item}
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
        <div className="fade-up header-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, background: 'rgba(20,184,166,0.2)', border: '1px solid rgba(20,184,166,0.4)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📅</div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700 }}>Seasonal Planner</h1>
              <p style={{ color: '#a8c4b0', fontSize: '0.88rem' }}>Month-by-month farming plan — kya karna hai, kab karna hai</p>
            </div>
          </div>
          {/* Season Selector */}
          <div style={{ display: 'flex', gap: 8 }}>
            {['Rabi', 'Kharif', 'Zaid'].map(s => (
              <button key={s} onClick={() => setSeason(s)} style={{ padding: '10px 20px', borderRadius: 10, border: `1px solid ${season === s ? '#e8b84b' : 'rgba(76,175,114,0.2)'}`, background: season === s ? 'rgba(232,184,75,0.15)' : 'transparent', color: season === s ? '#e8b84b' : '#a8c4b0', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: season === s ? 600 : 400, transition: 'all 0.2s', fontSize: '0.88rem' }}>
                {s === 'Rabi' ? '❄️' : s === 'Kharif' ? '☀️' : '🌸'} {s}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="fade-up legend-section" style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
          {[{ color: '#4caf72', label: 'Completed' }, { color: '#e8b84b', label: 'Current Month' }, { color: '#a8c4b0', label: 'Upcoming' }].map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#a8c4b0' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />{l.label}
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="month-grid">
          {plan.map((p, i) => (
            <div key={i} className={`month-card ${p.status === 'active' ? 'active-card' : ''}`}>
              {/* Status dot */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.status === 'done' ? '#4caf72' : p.status === 'active' ? '#e8b84b' : '#a8c4b0', boxShadow: p.status === 'active' ? '0 0 8px #e8b84b' : 'none' }} />
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700 }}>{p.month}</span>
                </div>
                {p.status === 'active' && <span style={{ fontSize: '0.68rem', padding: '3px 8px', background: 'rgba(232,184,75,0.2)', color: '#e8b84b', borderRadius: 20, fontWeight: 600 }}>NOW</span>}
                {p.status === 'done' && <span style={{ fontSize: '0.68rem', padding: '3px 8px', background: 'rgba(76,175,114,0.2)', color: '#4caf72', borderRadius: 20, fontWeight: 600 }}>✓ DONE</span>}
              </div>

              {/* Tasks */}
              <div style={{ marginBottom: 14 }}>
                {p.tasks.map((t, j) => (
                  <div key={j} className="task-item">
                    <span style={{ color: p.status === 'done' ? '#4caf72' : p.status === 'active' ? '#e8b84b' : '#a8c4b0', marginTop: 1 }}>
                      {p.status === 'done' ? '✓' : p.status === 'active' ? '→' : '○'}
                    </span>
                    <span style={{ textDecoration: p.status === 'done' ? 'line-through' : 'none', opacity: p.status === 'done' ? 0.6 : 1 }}>{t}</span>
                  </div>
                ))}
              </div>

              {/* Tip */}
              <div style={{ padding: '8px 12px', background: 'rgba(232,184,75,0.07)', border: '1px solid rgba(232,184,75,0.15)', borderRadius: 8, fontSize: '0.75rem', color: '#f5d07a' }}>
                💡 {p.tip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}