import { API_URL } from '../config'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const navItems = ['Dashboard', 'Simulator', 'Govt Schemes', 'Disease Scan', 'Risk Estimator', 'Soil Passport', 'Profit Estimator', 'Seasonal Planner', 'Crop Calendar', 'Community Forum', 'Alerts', 'Equipment Rental', 'Wallet']
const navIcons = ['📊', '🌿', '🏛️', '🦠', '⚠️', '🪱', '💰', '📅', '🗓️', '👥', '🔔', '🛠️', '👛']
const navRoutes = ['/dashboard', '/simulator', '/schemes', '/disease', '/risk', '/soil', '/profit', '/planner', '/crop-calendar', '/forum', '/alerts', '/rental', '/wallet']

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('Dashboard')
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', location: '' };
  const navigate = useNavigate()

  const [simulations, setSimulations] = useState([])
  const [soilTasks, setSoilTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) return navigate('/')

      try {
        const [simRes, soilRes] = await Promise.all([
          fetch(`${API_URL}/api/data/simulation`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/api/data/soil`, { headers: { 'Authorization': `Bearer ${token}` } })
        ])

        if (simRes.ok) setSimulations(await simRes.json())
        if (soilRes.ok) setSoilTasks(await soilRes.json())
        
        // ── Read soil data from localStorage (from Soil Passport) ──
        const localSoilData = JSON.parse(localStorage.getItem('soilData') || '[]');
        if (localSoilData.length > 0) {
          // Convert localStorage data to match API format
          const formattedSoilData = localSoilData.map(item => ({
            id: Date.now() + Math.random(), // Generate unique ID
            ph_level: item.ph_level,
            nitrogen: item.nitrogen,
            phosphorus: item.phosphorus,
            potassium: item.potassium,
            suggestion: item.suggestion,
            created_at: item.timestamp,
            overall_score: item.overallScore,
            ph_status: item.phStatus
          }));
          
          // Combine API data with localStorage data
          const allSoilData = [...formattedSoilData, ...(soilRes.ok ? await soilRes.json() : [])];
          setSoilTasks(allSoilData);
        }
      } catch (err) {
        console.error('Failed to fetch data', err)
        // Fallback to localStorage only if API fails
        const localSoilData = JSON.parse(localStorage.getItem('soilData') || '[]');
        if (localSoilData.length > 0) {
          const formattedSoilData = localSoilData.map(item => ({
            id: Date.now() + Math.random(),
            ph_level: item.ph_level,
            nitrogen: item.nitrogen,
            phosphorus: item.phosphorus,
            potassium: item.potassium,
            suggestion: item.suggestion,
            created_at: item.timestamp,
            overall_score: item.overallScore,
            ph_status: item.phStatus
          }));
          setSoilTasks(formattedSoilData);
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [navigate])

  const estProfit = simulations.reduce((sum, sim) => sum + parseFloat(sim.estimated_profit), 0)
  const totalAcres = simulations.reduce((sum, sim) => sum + parseFloat(sim.acres), 0)
  const cropsArray = Array.from(new Set(simulations.map(sim => sim.crop_name)))
  const latestSoil = soilTasks.length > 0 ? soilTasks[0] : null

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d2818', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>

      {/* <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" /> */}

      <style>{`
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px; cursor: pointer; transition: all 0.2s; font-size: 0.88rem; font-weight: 500; color: #a8c4b0; margin-bottom: 4px; }
        .nav-item:hover { background: rgba(76,175,114,0.1); color: #fff; }
        .nav-item.active { background: rgba(232,184,75,0.15); color: #e8b84b; border: 1px solid rgba(232,184,75,0.2); }
        .dash-card { background: rgba(26,74,46,0.4); border: 1px solid rgba(76,175,114,0.15); border-radius: 16px; padding: 24px; transition: border-color 0.3s; }
        .dash-card:hover { border-color: rgba(232,184,75,0.25); }
        .stat-mini { background: rgba(26,74,46,0.4); border: 1px solid rgba(76,175,114,0.15); border-radius: 14px; padding: 20px; flex: 1; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .emp-state { text-align: center; padding: 40px 20px; color: #a8c4b0; fontSize: 0.9rem; border: 1px dashed rgba(76,175,114,0.3); borderRadius: 12px; margin-top: 20px; }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .mobile-sidebar-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 90; display: none; pointer-events: none; }
          .mobile-sidebar-overlay.active { display: block; pointer-events: auto; }
          .sidebar { transform: translateX(-100%); transition: transform 0.3s ease; z-index: 65; }
          .sidebar.active { transform: translateX(0); }
          .mobile-menu-btn { display: block !important; position: fixed; top: 20px; left: 20px; z-index: 100; background: #e8b84b; border: none; border-radius: 8px; padding: 8px 12px; color: #0d2818; font-weight: 600; cursor: pointer; }
          .main-content { margin-left: 0 !important; padding: 70px 16px 24px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .sim-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .main-content { padding: 60px 12px 20px !important; }
        }
      `}</style>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.mobile-sidebar-overlay');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
      }} style={{ display: 'none' }}>
        Menu
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
              <span style={{ fontSize: '1rem' }}>{navIcons[i]}</span>{item}
            </div>
          ))}
        </nav>
        <div onClick={() => navigate('/profile')} style={{ borderTop: '1px solid rgba(76,175,114,0.1)', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #2d7a4f, #4caf72)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700 }}>{(user.name || 'U').charAt(0).toUpperCase()}</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#a8c4b0' }}>{user.location}</div>
          </div>
          <div onClick={() => { localStorage.removeItem('user'); localStorage.removeItem('token'); navigate('/'); }} style={{ marginLeft: 'auto', cursor: 'pointer', color: '#a8c4b0', fontSize: '0.8rem' }} title="Logout">↩</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content" style={{ marginLeft: 240, flex: 1, padding: '32px 36px' }}>

        {/* Header */}
        <div className="fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 }}>Namaste, {user.name} 👋</h1>
            <p style={{ color: '#a8c4b0', fontSize: '0.88rem' }}>Rabi Season 2026 · {user.location}</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div onClick={() => navigate('/simulator')} style={{ background: '#e8b84b', color: '#0d2818', borderRadius: 10, padding: '10px 18px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
              + New Simulation
            </div>
          </div>
        </div>

        {loading ? (
          <p style={{ color: '#a8c4b0' }}>Loading your data...</p>
        ) : (
          <>
            {/* Top Stats */}
            <div className="fade-up stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Calculated Profit', value: `₹${estProfit.toLocaleString()}`, sub: 'All recorded simulations', icon: '💰' },
                { label: 'Active Crops', value: cropsArray.length.toString(), sub: cropsArray.join(', ') || 'No crops yet', icon: '🌿' },
                { label: 'Land Simulated', value: `${totalAcres} Acres`, sub: 'Total farmed area', icon: '🗺️' },
                { label: 'Soil Health', value: latestSoil ? `${latestSoil.overall_score || latestSoil.ph_level}` : 'Unk.', sub: latestSoil ? `pH: ${latestSoil.ph_level} (${latestSoil.ph_status || 'Unknown'})` : 'No test logged', icon: '🪱' },
              ].map((s, i) => (
                <div key={i} className="stat-mini">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ fontSize: '0.75rem', color: '#a8c4b0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
                    <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.7rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: '0.78rem', color: '#a8c4b0', marginBottom: 10 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="fade-up dash-card" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.75rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>🌱 Active Simulations</div>

              {simulations.length === 0 ? (
                <div className="emp-state">
                  <div style={{ fontSize: '2rem', marginBottom: 10 }}>🌿</div>
                  You haven't run any simulations yet.<br />
                  <button onClick={() => navigate('/simulator')} style={{ marginTop: 15, padding: '10px 20px', background: '#e8b84b', color: '#0d2818', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Start Simulator</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }} className="sim-grid">
                  {simulations.map((sim, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, border: '1px solid rgba(76,175,114,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{sim.crop_name}</span>
                        <span style={{ background: 'rgba(232,184,75,0.15)', color: '#e8b84b', padding: '4px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>{sim.season}</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 6 }}>Area: {sim.acres} Acres</div>
                      <div style={{ fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 6 }}>Budget: ₹{sim.budget}</div>
                      <div style={{ fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 6 }}>Est. Profit: <span style={{ color: '#4caf72' }}>₹{sim.estimated_profit}</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="fade-up dash-card">
              <div style={{ fontSize: '0.75rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>🪱 Recent Soil Health Reports</div>
              {soilTasks.length === 0 ? (
                <div className="emp-state" style={{ padding: '20px' }}>
                  No soil tests recorded. <button onClick={() => navigate('/soil')} style={{ background: 'none', border: 'none', color: '#e8b84b', textDecoration: 'underline', cursor: 'pointer' }}>Log a soil report</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {soilTasks.map((soil, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 10, border: '1px solid rgba(76,175,114,0.1)' }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                          pH: {soil.ph_level} 
                          {soil.overall_score && <span style={{ marginLeft: 8, padding: '2px 8px', background: soil.overall_score >= 70 ? 'rgba(76,175,114,0.2)' : soil.overall_score >= 40 ? 'rgba(232,184,75,0.2)' : 'rgba(239,68,68,0.2)', borderRadius: 12, fontSize: '0.7rem', color: soil.overall_score >= 70 ? '#4caf72' : soil.overall_score >= 40 ? '#e8b84b' : '#f87171' }}>
                            {soil.overall_score}% Score
                          </span>}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#a8c4b0' }}>
                          N: {soil.nitrogen} | P: {soil.phosphorus} | K: {soil.potassium}
                          {soil.ph_status && <span style={{ marginLeft: 8, color: soil.ph_status === 'Neutral' ? '#4caf72' : soil.ph_status === 'Acidic' ? '#f87171' : '#e8b84b' }}>
                            ({soil.ph_status})
                          </span>}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#a8c4b0', maxWidth: 200, textAlign: 'right' }}>
                        {soil.suggestion || "Normal Levels"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </>
        )}
      </div>
    </div>
  )
}