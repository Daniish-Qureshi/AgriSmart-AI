import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const navItems = ['Dashboard', 'Simulator', 'Govt Schemes', 'Disease Scan', 'Risk Estimator', 'Soil Passport', 'Profit Estimator', 'Seasonal Planner', 'Crop Calendar', 'Community Forum', 'Alerts', 'Equipment Rental', 'Wallet']
const navIcons = ['📊', '🌿', '🏛️', '🦠', '⚠️', '🪱', '💰', '📅', '🗓️', '👥', '🔔', '🛠️', '👛']
const navRoutes = ['/dashboard', '/simulator', '/schemes', '/disease', '/risk', '/soil', '/profit', '/planner', '/crop-calendar', '/forum', '/alerts', '/rental', '/wallet']
const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', location: '' }

const schemeList = [
  {
    title: 'PM Kisan Samman Nidhi (PM-KISAN)',
    summary: 'Small and marginal farmers receive direct income support of ₹6,000 per year.',
    eligibility: [
      'Landowner farmer family with cultivable land',
      'Not included in exclusion categories like high-income tax payers or government employees',
      'Must have valid land records and Aadhaar linkage'
    ],
    benefit: '₹2,000 every 4 months directly in bank account.'
  },
  {
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    summary: 'Crop insurance protecting farmers from yield loss due to natural calamities.',
    eligibility: [
      'Farmer must have a Kisan Credit Card (KCC) or equivalent account',
      'Crop must be covered under the current season schedule',
      'Premium payment must be made before the sowing season deadline'
    ],
    benefit: 'Compensation for crop loss or damage, reducing income risk.'
  },
  {
    title: 'Kisan Credit Card (KCC)',
    summary: 'Affordable short-term credit for crop production and allied agricultural needs.',
    eligibility: [
      'Farmer with land ownership or lease documents',
      'Small and marginal farmers, tenant farmers, and sharecroppers',
      'Must have a good repayment record for any existing farm loan'
    ],
    benefit: 'Low-interest loan with flexible repayment and working capital support.'
  },
  {
    title: 'Soil Health Card Scheme',
    summary: 'Free soil testing and recommendations to improve soil productivity.',
    eligibility: [
      'Any farmer with cultivable land can apply',
      'Participating state agriculture department registration',
      'Soil sample must be collected and submitted correctly'
    ],
    benefit: 'Customized fertilizer and crop rotation advice based on soil nutrients.'
  },
  {
    title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    summary: 'Financial support for organic farming and cluster-based cultivation.',
    eligibility: [
      'Groups of farmers organized as farmer producer organizations or cooperatives',
      'Willingness to adopt organic farming practices for at least three years',
      'Land should be under certified organic production process'
    ],
    benefit: 'Assistance for certification, training, and organic input subsidies.'
  }
]

export default function GovtSchemes() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('Govt Schemes')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Farmers')

  const filteredSchemes = schemeList.filter((scheme) => {
    const query = search.toLowerCase().trim()
    const matchesText = !query || scheme.title.toLowerCase().includes(query) || scheme.summary.toLowerCase().includes(query)
    
    const matchesCategory = category === 'All Farmers' || (category === 'Small & Marginal Farmers' && scheme.title !== 'Paramparagat Krishi Vikas Yojana (PKVY)') || (category === 'Groups / Organic Farmers' && scheme.title === 'Paramparagat Krishi Vikas Yojana (PKVY)')
    return matchesText && matchesCategory
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d2818', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>
      <style>{`
        .nav-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;cursor:pointer;transition:all 0.2s;font-size:0.88rem;font-weight:500;color:#a8c4b0;margin-bottom:4px}
        .nav-item:hover{background:rgba(76,175,114,0.1);color:#fff}
        .nav-item.active{background:rgba(232,184,75,0.15);color:#e8b84b;border:1px solid rgba(232,184,75,0.2)}
        .input-field{width:100%;padding:13px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(76,175,114,0.2);border-radius:10px;color:#fff;font-size:0.92rem;outline:none;transition:border-color 0.3s;font-family:'DM Sans',sans-serif}
        .input-field::placeholder{color:#a8c4b0}
        .card{background:rgba(26,74,46,0.4);border:1px solid rgba(76,175,114,0.15);border-radius:16px;padding:24px}
        .scheme-card{background:rgba(255,255,255,0.04);border:1px solid rgba(232,184,75,0.12);border-radius:16px;padding:20px;margin-bottom:18px}
        .scheme-title{font-size:1.05rem;font-weight:700;color:#e8b84b;margin-bottom:8px}
        .scheme-meta{color:#cdd6c1;font-size:0.92rem;line-height:1.7}
        .tag{display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(232,184,75,0.12);color:#e8b84b;font-size:0.78rem;margin-right:8px;margin-top:8px}
        @media (max-width: 768px) {.main-content { margin-left: 0 !important; padding: 70px 16px 24px !important; }.schemes-grid { grid-template-columns: 1fr !important; }}
      `}</style>

      <div style={{ width: 240, background: 'rgba(13,40,24,0.98)', borderRight: '1px solid rgba(76,175,114,0.12)', padding: '24px 16px', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 24px', borderBottom: '1px solid rgba(76,175,114,0.1)', marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#2d7a4f,#e8b84b)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌾</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 700 }}>Agri<span style={{ color: '#e8b84b' }}>Smart</span></span>
        </div>
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {navItems.map((item, i) => (
            <div key={item} className={`nav-item ${activeNav === item ? 'active' : ''}`} onClick={() => { setActiveNav(item); navigate(navRoutes[i]) }}>
              <span>{navIcons[i]}</span>{item}
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

      <div className="main-content" style={{ marginLeft: 240, flex: 1, padding: '32px 36px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, background: 'rgba(232,184,75,0.14)', border: '1px solid rgba(232,184,75,0.25)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏛️</div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', fontWeight: 700 }}>Govt Schemes</h1>
              <p style={{ color: '#a8c4b0', fontSize: '0.9rem' }}>Scheme listing with eligibility and benefits for Indian farmers.</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <input className="input-field" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search schemes by name or benefit" />
            <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} style={{ maxWidth: 240 }}>
              <option>All Farmers</option>
              <option>Small & Marginal Farmers</option>
              <option>Groups / Organic Farmers</option>
            </select>
          </div>

          <div className="schemes-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {filteredSchemes.length > 0 ? filteredSchemes.map((scheme) => (
              <div key={scheme.title} className="scheme-card">
                <div className="scheme-title">{scheme.title}</div>
                <div className="scheme-meta">{scheme.summary}</div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ color: '#e8b84b', fontWeight: 600, marginBottom: 8 }}>Eligibility</div>
                  <ul style={{ paddingLeft: 20, color: '#d7dfc6', lineHeight: 1.8, margin: 0 }}>
                    {scheme.eligibility.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="tag">Benefit: {scheme.benefit}</div>
              </div>
            )) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#a8c4b0', padding: 24, border: '1px dashed rgba(232,184,75,0.2)', borderRadius: 16 }}>
                Koi scheme mil nahi raha. Search criteria badal kar dekhein.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
