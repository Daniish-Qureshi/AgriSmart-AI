import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const navItems = ['Dashboard', 'Simulator', 'Govt Schemes', 'Disease Scan', 'Risk Estimator', 'Soil Passport', 'Profit Estimator', 'Seasonal Planner', 'Crop Calendar', 'Community Forum', 'Alerts', 'Equipment Rental', 'Wallet']
const navIcons = ['📊', '🌿', '🏛️', '🦠', '⚠️', '🪱', '💰', '📅', '🗓️', '👥', '🔔', '🛠️', '👛']
const navRoutes = ['/dashboard', '/simulator', '/schemes', '/disease', '/risk', '/soil', '/profit', '/planner', '/crop-calendar', '/forum', '/alerts', '/rental', '/wallet']
const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', location: '' }

const cropCalendarData = {
  Wheat: [
    { stage: 'Soil Preparation', months: 'Oct - Nov' },
    { stage: 'Sowing', months: 'Nov - Dec' },
    { stage: 'Field Management', months: 'Dec - Feb' },
    { stage: 'Harvest', months: 'Mar - Apr' },
  ],
  Rice: [
    { stage: 'Land Preparation', months: 'May - Jun' },
    { stage: 'Sowing/Transplanting', months: 'Jun - Jul' },
    { stage: 'Growth & Care', months: 'Jul - Sep' },
    { stage: 'Harvest', months: 'Oct - Nov' },
  ],
  Maize: [
    { stage: 'Field Preparation', months: 'Jun - Jul' },
    { stage: 'Sowing', months: 'Jul - Aug' },
    { stage: 'Growth Phase', months: 'Aug - Oct' },
    { stage: 'Harvest', months: 'Nov - Dec' },
  ],
  Soybean: [
    { stage: 'Land Prep', months: 'Jun - Jul' },
    { stage: 'Sowing', months: 'Jul - Aug' },
    { stage: 'Crop Care', months: 'Aug - Sep' },
    { stage: 'Harvest', months: 'Oct - Nov' },
  ],
  Cotton: [
    { stage: 'Seed Bed Prep', months: 'May - Jun' },
    { stage: 'Sowing', months: 'Jun - Jul' },
    { stage: 'Crop Protection', months: 'Jul - Oct' },
    { stage: 'Harvest', months: 'Nov - Dec' },
  ],
  Onion: [
    { stage: 'Land Prep', months: 'Oct - Nov' },
    { stage: 'Sowing', months: 'Nov - Dec' },
    { stage: 'Maturity', months: 'Jan - Feb' },
    { stage: 'Harvest', months: 'Feb - Mar' },
  ],
}

export default function CropCalendar() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('Crop Calendar')
  const [selectedCrop, setSelectedCrop] = useState('Wheat')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d2818', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .nav-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;cursor:pointer;transition:all 0.2s;font-size:0.88rem;font-weight:500;color:#a8c4b0;margin-bottom:4px}
        .nav-item:hover{background:rgba(76,175,114,0.1);color:#fff}
        .nav-item.active{background:rgba(232,184,75,0.15);color:#e8b84b;border:1px solid rgba(232,184,75,0.2)}
        .card{background:rgba(26,74,46,0.4);border:1px solid rgba(76,175,114,0.15);border-radius:16px;padding:24px;margin-bottom:24px}
        .select-field{width:100%;padding:13px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(76,175,114,0.2);border-radius:10px;color:#fff;font-size:0.92rem;outline:none}
        .timeline-item{background:rgba(255,255,255,0.05);border:1px solid rgba(232,184,75,0.13);border-radius:14px;padding:18px;margin-bottom:14px}
      `}</style>

      <div style={{ width: 240, background: 'rgba(13,40,24,0.98)', borderRight: '1px solid rgba(76,175,114,0.12)', padding: '24px 16px', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 24px', borderBottom: '1px solid rgba(76,175,114,0.1)', marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#2d7a4f,#e8b84b)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌾</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 700 }}>Agri<span style={{ color: '#e8b84b' }}>Smart</span></span>
        </div>
        <nav style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {navItems.map((item, i) => (
            <div key={item} className={`nav-item ${activeNav === item ? 'active' : ''}`} onClick={() => { setActiveNav(item); navigate(navRoutes[i]) }}>
              <span style={{ fontSize: '1rem' }}>{navIcons[i]}</span>{item}
            </div>
          ))}
        </nav>

        <div onClick={() => navigate('/profile')} 
  style={{ borderTop: '1px solid rgba(76,175,114,0.1)', paddingTop: 16, marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}>
  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2d7a4f,#4caf72)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
    {(user.name || 'U').charAt(0).toUpperCase()}
  </div>
  <div style={{ overflow: 'hidden' }}>
    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
    <div style={{ fontSize: '0.72rem', color: '#a8c4b0' }}>{user.location}</div>
  </div>
  <div onClick={(e) => { e.stopPropagation(); localStorage.clear(); navigate('/') }} 
    style={{ marginLeft: 'auto', cursor: 'pointer', color: '#a8c4b0', flexShrink: 0 }}>↩</div>
</div>
      </div>

      <div style={{ marginLeft: 260, flex: 1, padding: '32px 36px' }}>
        <div style={{ marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 700 }}>Crop Calendar</h1>
            <p style={{ color: '#a8c4b0', maxWidth: 680, lineHeight: 1.7 }}>Har crop ke liye sowing se harvesting tak ka complete calendar yahan dekh sakte ho. Crop ke stage, months, aur kaam ka breakdown milta hai.</p>
          </div>
          <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="select-field" style={{ maxWidth: 260 }}>
            {Object.keys(cropCalendarData).map((crop) => <option key={crop} value={crop}>{crop}</option>)}
          </select>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>{selectedCrop} Crop Timeline</h2>
              <p style={{ color: '#d7dfc6', lineHeight: 1.75 }}>Yahan aap {selectedCrop} ke stages dekh sakte ho: kis mahine mein beej bona hai, field kaise manage karna hai aur kab harvest karein.</p>
            </div>
            <div style={{ minWidth: 220, padding: '16px', borderRadius: 16, background: 'rgba(232,184,75,0.08)', color: '#fff' }}>
              <div style={{ fontSize: '0.85rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Crop Calendar Feature</div>
              <div style={{ lineHeight: 1.8 }}>
                <p>• Sow se harvest tak full stage view</p>
                <p>• Major activities list</p>
                <p>• Crop-wise month guide</p>
              </div>
            </div>
          </div>
        </div>

        {cropCalendarData[selectedCrop].map((item) => (
          <div key={item.stage} className="timeline-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#e8b84b' }}>{item.stage}</h3>
                <p style={{ margin: '6px 0 0', color: '#d7dfc6' }}>{item.months}</p>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#a8c4b0', fontSize: '0.88rem' }}>
                <span>⏳</span><span>{item.months}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ marginTop: 0, fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 700 }}>Crop Calendar Summary</h3>
          <p style={{ color: '#d7dfc6', lineHeight: 1.8 }}>Crop Calendar se aapko planting schedule, care time, aur harvest window ek jagah mil jata hai. Ye feature aapke farming plan ko organized rakhta hai aur crop scheduling ko asaan banata hai.</p>
        </div>
      </div>
    </div>
  )
}
