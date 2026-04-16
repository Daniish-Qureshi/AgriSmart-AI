import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const navItems = ['Dashboard', 'Simulator', 'Govt Schemes', 'Disease Scan', 'Risk Estimator', 'Soil Passport', 'Profit Estimator', 'Seasonal Planner', 'Crop Calendar', 'Community Forum', 'Alerts', 'Equipment Rental', 'Wallet']
const navIcons = ['📊', '🌿', '🏛️', '🦠', '⚠️', '🪱', '💰', '📅', '🗓️', '👥', '🔔', '🛠️', '👛']
const navRoutes = ['/dashboard', '/simulator', '/schemes', '/disease', '/risk', '/soil', '/profit', '/planner', '/crop-calendar', '/forum', '/alerts', '/rental', '/wallet']

const crops = [
  { name: 'Wheat',     season: 'Rabi',   cost: 8000,  revenue: 22000, duration: '4 months', water: 'Medium', risk: 18 },
  { name: 'Rice',      season: 'Kharif', cost: 12000, revenue: 22000, duration: '5 months', water: 'High',   risk: 52 },
  { name: 'Mustard',   season: 'Rabi',   cost: 6000,  revenue: 17000, duration: '4 months', water: 'Low',    risk: 22 },
  { name: 'Pea',       season: 'Rabi',   cost: 5000,  revenue: 14000, duration: '3 months', water: 'Low',    risk: 28 },
  { name: 'Onion',     season: 'Zaid',   cost: 15000, revenue: 37000, duration: '5 months', water: 'Medium', risk: 45 },
  { name: 'Cotton',    season: 'Kharif', cost: 18000, revenue: 38000, duration: '6 months', water: 'High',   risk: 74 },
  { name: 'Sugarcane', season: 'Zaid',   cost: 20000, revenue: 50000, duration: '12 months',water: 'High',   risk: 35 },
]

export default function ProfitEstimator() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('Profit Estimator')
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Danish', location: 'Dadri, G.B. Nagar' };
  const [acres, setAcres] = useState('2')
  const [season, setSeason] = useState('All')
  const [sort, setSort] = useState('profit')

  const filtered = crops
    .filter(c => season === 'All' || c.season === season)
    .map(c => ({ ...c, profit: (c.revenue - c.cost) * parseFloat(acres || 1), roi: (((c.revenue - c.cost) / c.cost) * 100).toFixed(1) }))
    .sort((a, b) => sort === 'profit' ? b.profit - a.profit : sort === 'roi' ? b.roi - a.roi : a.risk - b.risk)

  const best = filtered[0]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d2818', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>
      {/* <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" /> */}
      <style>{`
        .nav-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;cursor:pointer;transition:all 0.2s;font-size:0.88rem;font-weight:500;color:#a8c4b0;margin-bottom:4px}
        .nav-item:hover{background:rgba(76,175,114,0.1);color:#fff}
        .nav-item.active{background:rgba(232,184,75,0.15);color:#e8b84b;border:1px solid rgba(232,184,75,0.2)}
        .card{background:rgba(26,74,46,0.4);border:1px solid rgba(76,175,114,0.15);border-radius:16px;padding:24px}
        .crop-card{background:rgba(13,40,24,0.6);border:1px solid rgba(76,175,114,0.12);border-radius:14px;padding:20px;transition:all 0.3s;cursor:pointer}
        .crop-card:hover{border-color:rgba(232,184,75,0.3);transform:translateY(-3px)}
        .crop-card.top{border-color:rgba(232,184,75,0.4);background:rgba(232,184,75,0.06)}
        .input-field{padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(76,175,114,0.2);border-radius:10px;color:#fff;font-size:0.88rem;outline:none;font-family:'DM Sans',sans-serif}
        .select-field{padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(76,175,114,0.2);border-radius:10px;color:#fff;font-size:0.88rem;outline:none;cursor:pointer;font-family:'DM Sans',sans-serif}
        .select-field option{background:#1a4a2e}
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
          .crops-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .filter-section { flex-direction: column !important; gap: 10px !important; }
          .banner-section { flex-direction: column !important; gap: 16px !important; text-align: center !important; }
        }
        @media (max-width: 480px) {
          .main-content { padding: 60px 12px 20px !important; }
          .card { padding: 16px !important; }
          .crop-card { padding: 16px !important; }
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
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
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
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, background: 'rgba(232,184,75,0.2)', border: '1px solid rgba(232,184,75,0.4)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>💰</div>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700 }}>Profit Estimator</h1>
                <p style={{ color: '#a8c4b0', fontSize: '0.88rem' }}>Crops compare karo — best profitable option dhundo</p>
              </div>
            </div>
            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }} className="filter-section">
              <input className="input-field" type="number" value={acres} onChange={e => setAcres(e.target.value)} placeholder="Acres" style={{ width: 90 }} />
              <select className="select-field" value={season} onChange={e => setSeason(e.target.value)}>
                <option value="All">All Seasons</option>
                <option value="Rabi">Rabi</option>
                <option value="Kharif">Kharif</option>
                <option value="Zaid">Zaid</option>
              </select>
              <select className="select-field" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="profit">Sort: Profit</option>
                <option value="roi">Sort: ROI</option>
                <option value="risk">Sort: Low Risk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Best Pick Banner */}
        {best && (
          <div className="fade-up banner-section" style={{ marginBottom: 24, padding: '20px 24px', background: 'rgba(232,184,75,0.1)', border: '1px solid rgba(232,184,75,0.3)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: '2rem' }}>🏆</div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#e8b84b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Best Pick for {acres} Acres</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700 }}>{best.name} <span style={{ color: '#a8c4b0', fontSize: '0.85rem', fontWeight: 400 }}>— {best.season} Season</span></div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#4caf72' }}>+₹{best.profit.toLocaleString()}</div>
              <div style={{ fontSize: '0.8rem', color: '#a8c4b0' }}>ROI: <span style={{ color: '#e8b84b', fontWeight: 600 }}>{best.roi}%</span></div>
            </div>
          </div>
        )}

        {/* Crops Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="crops-grid">
          {filtered.map((c, i) => (
            <div key={c.name} className={`crop-card ${i === 0 ? 'top' : ''}`}>
              {i === 0 && <div style={{ fontSize: '0.7rem', color: '#e8b84b', fontWeight: 600, marginBottom: 10, letterSpacing: '0.08em' }}>🏆 BEST CHOICE</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#a8c4b0', marginTop: 2 }}>{c.season} · {c.duration}</div>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, background: c.risk > 50 ? 'rgba(239,68,68,0.15)' : 'rgba(76,175,114,0.15)', color: c.risk > 50 ? '#f87171' : '#4caf72' }}>{c.risk}% risk</span>
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#4caf72', marginBottom: 4 }}>+₹{c.profit.toLocaleString()}</div>
              <div style={{ fontSize: '0.78rem', color: '#a8c4b0', marginBottom: 14 }}>ROI: <span style={{ color: '#e8b84b', fontWeight: 600 }}>{c.roi}%</span> · Water: {c.water}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ padding: '8px 10px', background: 'rgba(239,68,68,0.1)', borderRadius: 8, fontSize: '0.75rem' }}>
                  <div style={{ color: '#a8c4b0' }}>Cost/Acre</div>
                  <div style={{ color: '#f87171', fontWeight: 600 }}>₹{c.cost.toLocaleString()}</div>
                </div>
                <div style={{ padding: '8px 10px', background: 'rgba(76,175,114,0.1)', borderRadius: 8, fontSize: '0.75rem' }}>
                  <div style={{ color: '#a8c4b0' }}>Revenue/Acre</div>
                  <div style={{ color: '#4caf72', fontWeight: 600 }}>₹{c.revenue.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}