import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const navItems = ['Dashboard', 'Simulator', 'Risk Estimator', 'Soil Passport', 'Profit Estimator', 'Seasonal Planner', 'Alerts']
const navIcons = ['📊', '🌿', '⚠️', '🪱', '💰', '📅', '🔔']
const navRoutes = ['/dashboard', '/simulator', '/risk', '/soil', '/profit', '/planner', '/alerts']

const riskMatrix = {
  Wheat:     { Rabi: 18, Kharif: 72, Zaid: 55 },
  Rice:      { Rabi: 78, Kharif: 35, Zaid: 60 },
  Mustard:   { Rabi: 22, Kharif: 68, Zaid: 50 },
  Pea:       { Rabi: 28, Kharif: 75, Zaid: 45 },
  Onion:     { Rabi: 40, Kharif: 55, Zaid: 30 },
  Cotton:    { Rabi: 80, Kharif: 42, Zaid: 65 },
  Sugarcane: { Rabi: 50, Kharif: 30, Zaid: 25 },
}

const weatherRisk = { Sunny: 0, Cloudy: 10, Rainy: 20, Drought: 35, Flood: 45 }
const soilRisk    = { Loamy: 0, Sandy: 15, Clay: 10, Silty: 5, Rocky: 30 }

const getRiskLabel = (r) => r <= 25 ? 'Low Risk' : r <= 50 ? 'Medium Risk' : r <= 70 ? 'High Risk' : 'Very High Risk'
const getRiskColor = (r) => r <= 25 ? '#4caf72' : r <= 50 ? '#e8b84b' : r <= 70 ? '#f97316' : '#f87171'
const getRiskBg    = (r) => r <= 25 ? 'rgba(76,175,114,0.15)' : r <= 50 ? 'rgba(232,184,75,0.15)' : r <= 70 ? 'rgba(249,115,22,0.15)' : 'rgba(239,68,68,0.15)'
const getRiskEmoji = (r) => r <= 25 ? '✅' : r <= 50 ? '⚠️' : r <= 70 ? '🔶' : '🔴'

export default function RiskEstimator() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('Risk Estimator')
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Danish', location: 'Dadri, G.B. Nagar' };
  const [crop, setCrop]       = useState('')
  const [season, setSeason]   = useState('')
  const [weather, setWeather] = useState('')
  const [soil, setSoil]       = useState('')
  const [acres, setAcres]     = useState('')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)

  const analyze = () => {
    if (!crop || !season || !weather || !soil) return
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      const base    = riskMatrix[crop]?.[season] ?? 50
      const wRisk   = weatherRisk[weather] ?? 0
      const sRisk   = soilRisk[soil] ?? 0
      const total   = Math.min(98, base + wRisk + sRisk)

      const reasons = []
      if (base > 50)     reasons.push({ icon: '🌱', text: `${crop} is season (${season}) me naturally zyada risky hai`, color: '#f97316' })
      if (wRisk >= 20)   reasons.push({ icon: '🌧', text: `${weather} weather conditions crop ke liye harmful ho sakti hain`, color: '#f87171' })
      if (wRisk === 10)  reasons.push({ icon: '☁️', text: 'Cloudy weather se sunlight kam milti hai — growth slow ho sakti hai', color: '#e8b84b' })
      if (sRisk >= 15)   reasons.push({ icon: '🪨', text: `${soil} soil type is crop ke liye ideal nahi hai`, color: '#f87171' })
      if (sRisk === 10)  reasons.push({ icon: '🧱', text: 'Clay soil me waterlogging ka risk hota hai', color: '#e8b84b' })
      if (total <= 25)   reasons.push({ icon: '✅', text: 'Sab conditions favorable hain — safe to proceed', color: '#4caf72' })

      const precautions = []
      if (weather === 'Rainy' || weather === 'Flood') precautions.push('Proper drainage system banao')
      if (weather === 'Drought')                       precautions.push('Drip irrigation system use karo')
      if (soil === 'Sandy')                            precautions.push('Organic matter (compost) milao soil me')
      if (soil === 'Clay')                             precautions.push('Raised beds banao waterlogging rokne ke liye')
      if (total > 50)                                  precautions.push('Crop insurance lena consider karo')
      if (total > 70)                                  precautions.push('Alternative low-risk crop consider karo')
      precautions.push('Regular field inspection karo — har hafte')

      const safeAlternatives = Object.entries(riskMatrix)
        .map(([c, seasons]) => ({ name: c, risk: seasons[season] ?? 50 }))
        .filter(c => c.name !== crop && c.risk < total)
        .sort((a, b) => a.risk - b.risk)
        .slice(0, 3)

      setResult({ total, reasons, precautions, safeAlternatives })
      setLoading(false)
    }, 1600)
  }

  const reset = () => { setCrop(''); setSeason(''); setWeather(''); setSoil(''); setAcres(''); setResult(null) }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d2818', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>
      {/* <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" /> */}
      <style>{`
        .nav-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;cursor:pointer;transition:all 0.2s;font-size:0.88rem;font-weight:500;color:#a8c4b0;margin-bottom:4px}
        .nav-item:hover{background:rgba(76,175,114,0.1);color:#fff}
        .nav-item.active{background:rgba(232,184,75,0.15);color:#e8b84b;border:1px solid rgba(232,184,75,0.2)}
        .input-field{width:100%;padding:13px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(76,175,114,0.2);border-radius:10px;color:#fff;font-size:0.92rem;outline:none;transition:border-color 0.3s;font-family:'DM Sans',sans-serif}
        .input-field::placeholder{color:#a8c4b0}
        .input-field:focus{border-color:rgba(232,184,75,0.5)}
        .select-field{width:100%;padding:13px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(76,175,114,0.2);border-radius:10px;color:#fff;font-size:0.92rem;outline:none;cursor:pointer;font-family:'DM Sans',sans-serif;appearance:none}
        .select-field option{background:#1a4a2e}
        .analyze-btn{width:100%;padding:15px;background:#e8b84b;color:#0d2818;border:none;border-radius:10px;font-weight:700;font-size:1rem;cursor:pointer;transition:all 0.3s;font-family:'DM Sans',sans-serif}
        .analyze-btn:hover{background:#f5d07a;transform:translateY(-2px);box-shadow:0 10px 25px rgba(232,184,75,0.3)}
        .analyze-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none}
        .card{background:rgba(26,74,46,0.4);border:1px solid rgba(76,175,114,0.15);border-radius:16px;padding:24px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.5s ease both}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spinner{width:32px;height:32px;border:3px solid rgba(232,184,75,0.2);border-top-color:#e8b84b;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto}
        .option-chip{flex:1;padding:10px;border-radius:10px;border:1px solid rgba(76,175,114,0.2);background:rgba(255,255,255,0.03);color:#a8c4b0;text-align:center;cursor:pointer;font-size:0.82rem;transition:all 0.2s}
        .option-chip.selected{border-color:#e8b84b;background:rgba(232,184,75,0.12);color:#e8b84b;font-weight:600}
        .option-chip:hover{border-color:rgba(255,255,255,0.2);color:#fff}
      `}</style>

      {/* SIDEBAR */}
      <div style={{ width: 240, background: 'rgba(13,40,24,0.95)', borderRight: '1px solid rgba(76,175,114,0.12)', padding: '24px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
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
        <div onClick={() => navigate('/profile')} style={{ borderTop: '1px solid rgba(76,175,114,0.1)', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2d7a4f,#4caf72)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{user.name.charAt(0).toUpperCase()}</div>
          <div><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div><div style={{ fontSize: '0.72rem', color: '#a8c4b0' }}>{user.location}</div></div>
          <div onClick={() => { localStorage.removeItem('user'); navigate('/'); }} style={{ marginLeft: 'auto', cursor: 'pointer', color: '#a8c4b0' }}>↩</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ marginLeft: 240, flex: 1, padding: '32px 36px' }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>⚠️</div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', fontWeight: 700 }}>Risk Estimator</h1>
              <p style={{ color: '#a8c4b0', fontSize: '0.88rem' }}>Crop, season, weather aur soil ke basis par failure ka risk analyze karo</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24 }}>

          {/* Input Form */}
          <div className="card fade-up">
            <div style={{ fontSize: '0.75rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24 }}>📋 Risk Analysis Details</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Crop */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, fontWeight: 500 }}>🌱 Crop</label>
                <div style={{ position: 'relative' }}>
                  <select className="select-field" value={crop} onChange={e => setCrop(e.target.value)}>
                    <option value="">-- Crop chuniye --</option>
                    {Object.keys(riskMatrix).map(c => <option key={c}>{c}</option>)}
                  </select>
                  <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#a8c4b0' }}>▾</div>
                </div>
              </div>

              {/* Season */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, fontWeight: 500 }}>🌤 Season</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Rabi', 'Kharif', 'Zaid'].map(s => (
                    <div key={s} className={`option-chip ${season === s ? 'selected' : ''}`} onClick={() => setSeason(s)}>
                      {s === 'Rabi' ? '❄️' : s === 'Kharif' ? '☀️' : '🌸'} {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, fontWeight: 500 }}>🌦 Current Weather</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[['Sunny','☀️'], ['Cloudy','☁️'], ['Rainy','🌧'], ['Drought','🏜'], ['Flood','🌊']].map(([w, emoji]) => (
                    <div key={w} className={`option-chip ${weather === w ? 'selected' : ''}`} onClick={() => setWeather(w)} style={{ flex: 'none', padding: '8px 14px' }}>
                      {emoji} {w}
                    </div>
                  ))}
                </div>
              </div>

              {/* Soil */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, fontWeight: 500 }}>🪨 Soil Type</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Loamy', 'Sandy', 'Clay', 'Silty', 'Rocky'].map(s => (
                    <div key={s} className={`option-chip ${soil === s ? 'selected' : ''}`} onClick={() => setSoil(s)} style={{ flex: 'none', padding: '8px 14px' }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Acres */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, fontWeight: 500 }}>🗺 Land Area (Optional)</label>
                <input className="input-field" type="number" placeholder="Acres me dalo" value={acres} onChange={e => setAcres(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="analyze-btn" onClick={analyze} disabled={!crop || !season || !weather || !soil || loading}>
                  {loading ? '⏳ Analyzing...' : '🔍 Risk Analyze Karo'}
                </button>
                {result && <button onClick={reset} style={{ padding: '15px 20px', background: 'transparent', border: '1px solid rgba(76,175,114,0.3)', borderRadius: 10, color: '#a8c4b0', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: '0.88rem' }}>Reset</button>}
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="card fade-up">
            <div style={{ fontSize: '0.75rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24 }}>📊 Risk Analysis Report</div>

            {!result && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: 0.5, minHeight: 300 }}>
                <div style={{ fontSize: '4rem' }}>⚠️</div>
                <p style={{ color: '#a8c4b0', textAlign: 'center', fontSize: '0.9rem', lineHeight: 1.6 }}>Details dalo aur risk analyze karo</p>
              </div>
            )}

            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, minHeight: 300 }}>
                <div className="spinner" />
                <p style={{ color: '#a8c4b0', fontSize: '0.9rem' }}>Risk calculate ho raha hai...</p>
              </div>
            )}

            {result && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeUp 0.5s ease both' }}>

                {/* Main Risk Score */}
                <div style={{ padding: '24px', borderRadius: 14, background: getRiskBg(result.total), border: `1px solid ${getRiskColor(result.total)}44`, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{getRiskEmoji(result.total)}</div>
                  <div style={{ fontSize: '0.78rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Crop Failure Risk</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '3.5rem', fontWeight: 700, color: getRiskColor(result.total), lineHeight: 1 }}>{result.total}%</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: getRiskColor(result.total), marginTop: 8 }}>{getRiskLabel(result.total)}</div>
                  {/* Risk Bar */}
                  <div style={{ height: 10, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden', marginTop: 16 }}>
                    <div style={{ width: `${result.total}%`, height: '100%', background: getRiskColor(result.total), borderRadius: 99, transition: 'width 1.2s ease' }} />
                  </div>
                </div>

                {/* Risk Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[
                    { label: 'Crop + Season', val: `${riskMatrix[crop]?.[season] ?? 0}%`, color: '#a78bfa' },
                    { label: 'Weather', val: `+${weatherRisk[weather] ?? 0}%`, color: '#60a5fa' },
                    { label: 'Soil Type', val: `+${soilRisk[soil] ?? 0}%`, color: '#c4895a' },
                  ].map((b, i) => (
                    <div key={i} style={{ padding: '12px', background: 'rgba(13,40,24,0.5)', borderRadius: 12, border: '1px solid rgba(76,175,114,0.12)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#a8c4b0', marginBottom: 6 }}>{b.label}</div>
                      <div style={{ fontWeight: 700, color: b.color, fontSize: '1.1rem' }}>{b.val}</div>
                    </div>
                  ))}
                </div>

                {/* Reasons */}
                {result.reasons.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>🔍 Risk Reasons</div>
                    {result.reasons.map((r, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 12px', marginBottom: 6, background: 'rgba(13,40,24,0.5)', borderRadius: 10, border: `1px solid ${r.color}33`, fontSize: '0.83rem' }}>
                        <span>{r.icon}</span><span style={{ color: '#d0d0d0' }}>{r.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Precautions */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>🛡 Precautions</div>
                  {result.precautions.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', marginBottom: 6, background: 'rgba(76,175,114,0.08)', borderRadius: 10, border: '1px solid rgba(76,175,114,0.15)', fontSize: '0.83rem', color: '#d0d0d0' }}>
                      <span style={{ color: '#4caf72' }}>→</span>{p}
                    </div>
                  ))}
                </div>

                {/* Safe Alternatives */}
                {result.safeAlternatives.length > 0 && result.total > 40 && (
                  <div style={{ padding: '14px 16px', background: 'rgba(232,184,75,0.08)', border: '1px solid rgba(232,184,75,0.2)', borderRadius: 12 }}>
                    <div style={{ fontSize: '0.75rem', color: '#e8b84b', fontWeight: 600, marginBottom: 10 }}>💡 Safer Alternatives Is Season Me</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {result.safeAlternatives.map((a, i) => (
                        <span key={i} style={{ padding: '5px 14px', background: 'rgba(76,175,114,0.15)', borderRadius: 20, fontSize: '0.8rem', color: '#4caf72' }}>
                          {a.name} — {a.risk}% risk
                        </span>
                      ))}
                    </div>
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