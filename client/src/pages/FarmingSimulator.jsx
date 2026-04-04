import { API_URL } from '../config'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const navItems = ['Dashboard', 'Simulator', 'Risk Estimator', 'Soil Passport', 'Profit Estimator', 'Seasonal Planner', 'Alerts']
const navIcons = ['📊', '🌿', '⚠️', '🪱', '💰', '📅', '🔔']
const navRoutes = ['/dashboard', '/simulator', '/risk', '/soil', '/profit', '/planner', '/alerts']

const cropData = {
  Wheat:    { costPerAcre: 8000,  profitPerAcre: 14000, water: 'Medium', duration: '4 months', risk: 18 },
  Rice:     { costPerAcre: 12000, profitPerAcre: 10000, water: 'High',   duration: '5 months', risk: 52 },
  Mustard:  { costPerAcre: 6000,  profitPerAcre: 11000, water: 'Low',    duration: '4 months', risk: 22 },
  Pea:      { costPerAcre: 5000,  profitPerAcre: 9000,  water: 'Low',    duration: '3 months', risk: 28 },
  Onion:    { costPerAcre: 15000, profitPerAcre: 22000, water: 'Medium', duration: '5 months', risk: 45 },
  Cotton:   { costPerAcre: 18000, profitPerAcre: 20000, water: 'High',   duration: '6 months', risk: 74 },
  Sugarcane:{ costPerAcre: 20000, profitPerAcre: 30000, water: 'High',   duration: '12 months',risk: 35 },
}

export default function FarmingSimulator() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('Simulator')
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Danish', location: 'Dadri, G.B. Nagar' }
  const [crop, setCrop]       = useState('')
  const [acres, setAcres]     = useState('')
  const [season, setSeason]   = useState('')
  const [budget, setBudget]   = useState('')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiAdvice, setAiAdvice]   = useState(null)
  const [aiLoading, setAiLoading] = useState(false)

  const simulate = () => {
    if (!crop || !acres || !season || !budget) return
    setLoading(true)
    setResult(null)
    setAiAdvice(null)
    setTimeout(async () => {
      const data = cropData[crop]
      const totalCost = data.costPerAcre * parseFloat(acres)
      const totalProfit = data.profitPerAcre * parseFloat(acres)
      const netProfit = totalProfit - totalCost
      const roi = ((netProfit / parseFloat(budget)) * 100).toFixed(1)
      const budgetSufficient = parseFloat(budget) >= totalCost
      setResult({ totalCost, totalProfit, netProfit, roi, budgetSufficient, data, isProfit: netProfit > 0 })
      setLoading(false)

      // ── Database me save karo ──
      try {
        const token = localStorage.getItem('token')
        await fetch(`${API_URL}/api/data/simulation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            crop_name: crop,
            budget: parseFloat(budget),
            season,
            acres: parseFloat(acres),
            estimated_profit: netProfit,
            risk_percent: data.risk
          })
        })
      } catch (err) {
        console.error('Simulation save error:', err)
      }

      // ── Groq AI Advice ──
      setAiLoading(true)
      try {
        const res = await fetch(`${API_URL}/api/ai/simulate-advice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ crop, acres, season, budget, profit: netProfit, risk: data.risk })
        })
        const aiData = await res.json()
        setAiAdvice(aiData.advice)
      } catch {
        setAiAdvice('AI advice abhi available nahi hai.')
      }
      setAiLoading(false)
    }, 1800)
  }

  const reset = () => { setCrop(''); setAcres(''); setSeason(''); setBudget(''); setResult(null); setAiAdvice(null) }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d2818', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>
      <style>{`
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px; cursor: pointer; transition: all 0.2s; font-size: 0.88rem; font-weight: 500; color: #a8c4b0; margin-bottom: 4px; }
        .nav-item:hover { background: rgba(76,175,114,0.1); color: #fff; }
        .nav-item.active { background: rgba(232,184,75,0.15); color: #e8b84b; border: 1px solid rgba(232,184,75,0.2); }
        .input-field { width: 100%; padding: 13px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(76,175,114,0.2); border-radius: 10px; color: #fff; font-size: 0.92rem; outline: none; transition: border-color 0.3s; font-family: 'DM Sans', sans-serif; }
        .input-field::placeholder { color: #a8c4b0; }
        .input-field:focus { border-color: rgba(232,184,75,0.5); }
        .select-field { width: 100%; padding: 13px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(76,175,114,0.2); border-radius: 10px; color: #fff; font-size: 0.92rem; outline: none; cursor: pointer; font-family: 'DM Sans', sans-serif; appearance: none; }
        .select-field option { background: #1a4a2e; color: #fff; }
        .sim-btn { width: 100%; padding: 15px; background: #e8b84b; color: #0d2818; border: none; border-radius: 10px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.3s; font-family: 'DM Sans', sans-serif; }
        .sim-btn:hover { background: #f5d07a; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(232,184,75,0.3); }
        .sim-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .result-card { background: rgba(26,74,46,0.4); border: 1px solid rgba(76,175,114,0.2); border-radius: 16px; padding: 24px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.5s ease both; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 32px; height: 32px; border: 3px solid rgba(232,184,75,0.2); border-top-color: #e8b84b; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
        .info-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: rgba(26,74,46,0.5); border: 1px solid rgba(76,175,114,0.2); border-radius: 20px; font-size: 0.78rem; color: #a8c4b0; }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .mobile-sidebar-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 90; display: none; pointer-events: none; }
          .mobile-sidebar-overlay.active { display: block; pointer-events: auto; }
          .sidebar { transform: translateX(-100%); transition: transform 0.3s ease; z-index: 65; }
          .sidebar.active { transform: translateX(0); }
          .mobile-menu-btn { display: block !important; position: fixed; top: 20px; left: 20px; z-index: 100; background: #e8b84b; border: none; border-radius: 8px; padding: 8px 12px; color: #0d2818; font-weight: 600; cursor: pointer; }
          .main-content { margin-left: 0 !important; padding: 70px 16px 24px !important; }
          .sim-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .season-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .result-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .main-content { padding: 60px 12px 20px !important; }
          .season-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
          .info-chip { font-size: 0.7rem; padding: 4px 10px; }
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
        <nav style={{ flex: 1 }}>
          {navItems.map((item, i) => (
            <div key={item} className={`nav-item ${activeNav === item ? 'active' : ''}`} onClick={() => { setActiveNav(item); navigate(navRoutes[i]) }}>
              <span style={{ fontSize: '1rem' }}>{navIcons[i]}</span>{item}
            </div>
          ))}
        </nav>
        <div onClick={() => navigate('/profile')} style={{ borderTop: '1px solid rgba(76,175,114,0.1)', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #2d7a4f, #4caf72)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700 }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#a8c4b0' }}>{user.location}</div>
          </div>
          <div onClick={(e) => { e.stopPropagation(); localStorage.removeItem('user'); navigate('/') }} style={{ marginLeft: 'auto', cursor: 'pointer', color: '#a8c4b0' }} title="Logout">↩</div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-content" style={{ marginLeft: 240, flex: 1, padding: '32px 36px' }}>
        <div className="fade-up" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, background: 'rgba(45,122,79,0.3)', border: '1px solid rgba(45,122,79,0.5)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🌿</div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700 }}>Farming Simulator</h1>
              <p style={{ color: '#a8c4b0', fontSize: '0.88rem' }}>Crop, budget aur season dalo — AI profit ya loss pehle hi bata dega</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24 }} className="sim-grid">

          {/* Input Form */}
          <div className="fade-up result-card">
            <div style={{ fontSize: '0.75rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24 }}>📋 Simulation Details Dalo</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, fontWeight: 500 }}>🌱 Crop Select Karo</label>
                <div style={{ position: 'relative' }}>
                  <select className="select-field" value={crop} onChange={e => setCrop(e.target.value)}>
                    <option value="">-- Crop chuniye --</option>
                    {Object.keys(cropData).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#a8c4b0' }}>▾</div>
                </div>
                {crop && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    <span className="info-chip">💧 Water: {cropData[crop].water}</span>
                    <span className="info-chip">⏱ {cropData[crop].duration}</span>
                    <span className="info-chip" style={{ color: cropData[crop].risk > 50 ? '#f87171' : '#4caf72' }}>⚠ Risk: {cropData[crop].risk}%</span>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, fontWeight: 500 }}>🗺 Land Area (Acres)</label>
                <input className="input-field" type="number" placeholder="Jaise: 2.5" min="0.5" max="100" value={acres} onChange={e => setAcres(e.target.value)} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, fontWeight: 500 }}>🌤 Season</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }} className="season-grid">
                  {['Rabi', 'Kharif', 'Zaid'].map(s => (
                    <div key={s} onClick={() => setSeason(s)} style={{ padding: '10px', borderRadius: 10, border: `1px solid ${season === s ? '#e8b84b' : 'rgba(76,175,114,0.2)'}`, background: season === s ? 'rgba(232,184,75,0.15)' : 'rgba(255,255,255,0.03)', color: season === s ? '#e8b84b' : '#a8c4b0', textAlign: 'center', cursor: 'pointer', fontSize: '0.85rem', fontWeight: season === s ? 600 : 400, transition: 'all 0.2s' }}>
                      {s === 'Rabi' ? '❄️' : s === 'Kharif' ? '☀️' : '🌸'} {s}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, fontWeight: 500 }}>💵 Total Budget (₹)</label>
                <input className="input-field" type="number" placeholder="Jaise: 50000" min="1000" value={budget} onChange={e => setBudget(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="sim-btn" onClick={simulate} disabled={!crop || !acres || !season || !budget || loading}>
                  {loading ? '⏳ Calculating...' : '🚀 Simulate Karo'}
                </button>
                {result && (
                  <button onClick={reset} style={{ padding: '15px 20px', background: 'transparent', border: '1px solid rgba(76,175,114,0.3)', borderRadius: 10, color: '#a8c4b0', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem' }}>Reset</button>
                )}
              </div>
            </div>
          </div>

          {/* Result Panel */}
          <div className="fade-up result-card" style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '90vh' }}>
            <div style={{ fontSize: '0.75rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24 }}>📊 Simulation Result</div>

            {!result && !loading && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: 0.5 }}>
                <div style={{ fontSize: '4rem' }}>🌾</div>
                <p style={{ color: '#a8c4b0', textAlign: 'center', fontSize: '0.9rem', lineHeight: 1.6 }}>Left side me details dalo<br />aur "Simulate Karo" press karo</p>
              </div>
            )}

            {loading && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                <div className="spinner" />
                <p style={{ color: '#a8c4b0', fontSize: '0.9rem' }}>AI calculate kar raha hai...</p>
              </div>
            )}

            {result && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeUp 0.5s ease both' }}>
                <div style={{ padding: '20px', borderRadius: 14, background: result.isProfit ? 'rgba(76,175,114,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${result.isProfit ? 'rgba(76,175,114,0.4)' : 'rgba(239,68,68,0.4)'}`, textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>{result.isProfit ? '📈' : '📉'}</div>
                  <div style={{ fontSize: '0.8rem', color: '#a8c4b0', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {result.isProfit ? 'Expected Profit' : 'Expected Loss'}
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', fontWeight: 700, color: result.isProfit ? '#4caf72' : '#f87171', lineHeight: 1 }}>
                    {result.isProfit ? '+' : '-'}₹{Math.abs(result.netProfit).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#a8c4b0', marginTop: 8 }}>
                    ROI: <span style={{ color: result.isProfit ? '#4caf72' : '#f87171', fontWeight: 600 }}>{result.roi}%</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="result-grid">
                  {[
                    { label: 'Total Cost',    value: `₹${result.totalCost.toLocaleString()}`,   color: '#f87171', icon: '💸' },
                    { label: 'Total Revenue', value: `₹${result.totalProfit.toLocaleString()}`, color: '#4caf72', icon: '💰' },
                    { label: 'Crop Duration', value: result.data.duration,                      color: '#60a5fa', icon: '⏱' },
                    { label: 'Water Needed',  value: result.data.water,                         color: '#a78bfa', icon: '💧' },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '14px', background: 'rgba(13,40,24,0.5)', borderRadius: 12, border: '1px solid rgba(76,175,114,0.12)' }}>
                      <div style={{ fontSize: '0.75rem', color: '#a8c4b0', marginBottom: 6 }}>{item.icon} {item.label}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: item.color }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '14px 16px', borderRadius: 12, background: result.budgetSufficient ? 'rgba(76,175,114,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${result.budgetSufficient ? 'rgba(76,175,114,0.3)' : 'rgba(239,68,68,0.3)'}`, fontSize: '0.85rem' }}>
                  {result.budgetSufficient
                    ? <span style={{ color: '#4caf72' }}>✅ Budget sufficient hai — farming shuru kar sakte ho!</span>
                    : <span style={{ color: '#f87171' }}>⚠️ Budget kam hai — ₹{(result.totalCost - parseFloat(budget)).toLocaleString()} aur chahiye.</span>
                  }
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 8 }}>
                    <span style={{ color: '#a8c4b0' }}>Crop Failure Risk</span>
                    <span style={{ color: result.data.risk > 50 ? '#f87171' : result.data.risk > 30 ? '#e8b84b' : '#4caf72', fontWeight: 600 }}>{result.data.risk}%</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${result.data.risk}%`, height: '100%', background: result.data.risk > 50 ? '#f87171' : result.data.risk > 30 ? '#e8b84b' : '#4caf72', borderRadius: 99, transition: 'width 1s ease' }} />
                  </div>
                </div>

                {(aiLoading || aiAdvice) && (
                  <div style={{ padding: '16px', background: 'rgba(232,184,75,0.08)', border: '1px solid rgba(232,184,75,0.25)', borderRadius: 12 }}>
                    <div style={{ fontSize: '0.75rem', color: '#e8b84b', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      ⚡ Agri-Smart AI Advice
                    </div>
                    {aiLoading ? (
                      <div style={{ color: '#a8c4b0', fontSize: '0.85rem' }}>AI soch raha hai... ⏳</div>
                    ) : (
                      <div style={{ color: '#e0e0e0', fontSize: '0.85rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                        {aiAdvice}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}