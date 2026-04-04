import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'

const navItems = ['Dashboard', 'Simulator', 'Risk Estimator', 'Soil Passport', 'Profit Estimator', 'Seasonal Planner', 'Alerts']
const navIcons = ['📊', '🌿', '⚠️', '🪱', '💰', '📅', '🔔']
const navRoutes = ['/dashboard', '/simulator', '/risk', '/soil', '/profit', '/planner', '/alerts']

export default function SoilPassport() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('Soil Passport')
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Danish', location: 'Dadri, G.B. Nagar' };
  const [form, setForm] = useState({ ph: '', nitrogen: '', phosphorus: '', potassium: '', moisture: '', location: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyze = () => {
    if (!form.ph || !form.nitrogen || !form.phosphorus || !form.potassium) return
    setLoading(true)
    setResult(null)
    setTimeout(async () => {
      const ph = parseFloat(form.ph)
      const phStatus = ph < 6 ? 'Acidic' : ph > 7.5 ? 'Alkaline' : 'Neutral'
      const phColor = ph < 6 ? '#f87171' : ph > 7.5 ? '#e8b84b' : '#4caf72'
      const overallScore = Math.min(100, Math.round(
        (ph >= 6 && ph <= 7.5 ? 30 : 10) +
        (form.nitrogen === 'High' ? 25 : form.nitrogen === 'Medium' ? 15 : 5) +
        (form.phosphorus === 'High' ? 25 : form.phosphorus === 'Medium' ? 15 : 5) +
        (form.potassium === 'High' ? 20 : form.potassium === 'Medium' ? 12 : 4)
      ))
      const suggestions = []
      if (ph < 6) suggestions.push({ icon: '🪨', text: 'Lime (Chuna) milao — pH badhane ke liye', color: '#f87171' })
      if (ph > 7.5) suggestions.push({ icon: '🌿', text: 'Sulfur ya organic matter dalo — pH kam karne ke liye', color: '#e8b84b' })
      if (form.nitrogen === 'Low') suggestions.push({ icon: '💚', text: 'Urea ya DAP fertilizer use karo — Nitrogen badhao', color: '#4caf72' })
      if (form.phosphorus === 'Low') suggestions.push({ icon: '🔵', text: 'Single Super Phosphate (SSP) dalo', color: '#60a5fa' })
      if (form.potassium === 'Low') suggestions.push({ icon: '🟡', text: 'Muriate of Potash (MOP) use karo', color: '#e8b84b' })
      if (suggestions.length === 0) suggestions.push({ icon: '✅', text: 'Soil ekdum perfect hai! Koi kami nahi.', color: '#4caf72' })
      const bestCrops = ph >= 6 && ph <= 7 ? ['Wheat 🌾', 'Mustard 🌻', 'Pea 🟢'] : ph < 6 ? ['Rice 🍚', 'Tea 🍵', 'Potato 🥔'] : ['Cotton 🌸', 'Sugarcane 🎋', 'Barley 🌾']
      setResult({ phStatus, phColor, overallScore, suggestions, bestCrops });

      // ── Save to localStorage for Dashboard ──
      const soilResult = {
        ph_level: parseFloat(form.ph),
        nitrogen: form.nitrogen,
        phosphorus: form.phosphorus,
        potassium: form.potassium,
        suggestion: suggestions.length > 0 ? suggestions[0].text : 'Normal Levels',
        overallScore,
        phStatus,
        timestamp: new Date().toISOString()
      };
      
      // Save to localStorage for Dashboard to read
      const existingSoilData = JSON.parse(localStorage.getItem('soilData') || '[]');
      existingSoilData.unshift(soilResult);
      localStorage.setItem('soilData', JSON.stringify(existingSoilData.slice(0, 10))); // Keep latest 10 records
      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await fetch(`${API_URL}/api/ai/soil-suggest`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              ph_level: parseFloat(form.ph),
              nitrogen: form.nitrogen,
              phosphorus: form.phosphorus,
              potassium: form.potassium,
              suggestion: suggestions.length > 0 ? suggestions[0].text : 'Normal Levels'
            })
          });
        } catch (err) { console.error(err); }
      }
      setLoading(false);
    }, 1500)
  }

  const getScoreColor = (s) => s >= 70 ? '#4caf72' : s >= 40 ? '#e8b84b' : '#f87171'
  const getScoreLabel = (s) => s >= 70 ? 'Excellent' : s >= 40 ? 'Average' : 'Poor'

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
        .select-field{width:100%;padding:13px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(76,175,114,0.2);border-radius:10px;color:#fff;font-size:0.92rem;outline:none;cursor:pointer;font-family:'DM Sans',sans-serif}
        .select-field option{background:#1a4a2e}
        .analyze-btn{width:100%;padding:15px;background:#e8b84b;color:#0d2818;border:none;border-radius:10px;font-weight:700;font-size:1rem;cursor:pointer;transition:all 0.3s;font-family:'DM Sans',sans-serif}
        .analyze-btn:hover{background:#f5d07a;transform:translateY(-2px);box-shadow:0 10px 25px rgba(232,184,75,0.3)}
        .analyze-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none}
        .card{background:rgba(26,74,46,0.4);border:1px solid rgba(76,175,114,0.15);border-radius:16px;padding:24px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.5s ease both}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spinner{width:32px;height:32px;border:3px solid rgba(232,184,75,0.2);border-top-color:#e8b84b;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto}
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .mobile-sidebar-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 90; display: none; pointer-events: none; }
          .mobile-sidebar-overlay.active { display: block; pointer-events: auto; }
          .sidebar { transform: translateX(-100%); transition: transform 0.3s ease; z-index: 65; }
          .sidebar.active { transform: translateX(0); }
          .mobile-menu-btn { display: block !important; position: fixed; top: 20px; left: 20px; z-index: 100; background: #e8b84b; border: none; border-radius: 8px; padding: 8px 12px; color: #0d2818; font-weight: 600; cursor: pointer; }
          .main-content { margin-left: 0 !important; padding: 70px 16px 24px !important; }
          .soil-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
        @media (max-width: 480px) {
          .main-content { padding: 60px 12px 20px !important; }
          .card { padding: 16px !important; }
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
        <div className="fade-up" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, background: 'rgba(139,94,60,0.3)', border: '1px solid rgba(139,94,60,0.5)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🪱</div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700 }}>Soil Health Passport</h1>
              <p style={{ color: '#a8c4b0', fontSize: '0.88rem' }}>Apni zameen ki health check karo aur AI se suggestions pao</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24 }} className="soil-grid">
          {/* Form */}
          <div className="card fade-up">
            <div style={{ fontSize: '0.75rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24 }}>🧪 Soil Test Data Dalo</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, fontWeight: 500 }}>pH Level (4.0 – 9.0)</label>
                <input className="input-field" type="number" step="0.1" min="4" max="9" placeholder="Jaise: 6.8" value={form.ph} onChange={e => setForm({ ...form, ph: e.target.value })} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#a8c4b0', marginTop: 6 }}>
                  <span style={{ color: '#f87171' }}>Acidic (&lt;6)</span>
                  <span style={{ color: '#4caf72' }}>Neutral (6–7.5)</span>
                  <span style={{ color: '#e8b84b' }}>Alkaline (&gt;7.5)</span>
                </div>
              </div>
              {[
                { key: 'nitrogen', label: '💚 Nitrogen (N) Level' },
                { key: 'phosphorus', label: '🔵 Phosphorus (P) Level' },
                { key: 'potassium', label: '🟡 Potassium (K) Level' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, fontWeight: 500 }}>{f.label}</label>
                  <select className="select-field" value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}>
                    <option value="">-- Select karo --</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, fontWeight: 500 }}>📍 Farm Location (Optional)</label>
                <input className="input-field" type="text" placeholder="Jaise: Dadri, G.B. Nagar" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
              <button className="analyze-btn" onClick={analyze} disabled={!form.ph || !form.nitrogen || !form.phosphorus || !form.potassium || loading} style={{ marginTop: 4 }}>
                {loading ? '⏳ Analyzing...' : '🔬 Soil Analyze Karo'}
              </button>
            </div>
          </div>

          {/* Result */}
          <div className="card fade-up">
            <div style={{ fontSize: '0.75rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24 }}>📋 Soil Health Report</div>
            {!result && !loading && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: 0.5, minHeight: 300 }}>
                <div style={{ fontSize: '4rem' }}>🪱</div>
                <p style={{ color: '#a8c4b0', textAlign: 'center', fontSize: '0.9rem', lineHeight: 1.6 }}>Soil data dalo aur analyze karo</p>
              </div>
            )}
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, minHeight: 300 }}>
                <div className="spinner" />
                <p style={{ color: '#a8c4b0', fontSize: '0.9rem' }}>Soil analyze ho rahi hai...</p>
              </div>
            )}
            {result && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeUp 0.5s ease both' }}>
                {/* Score */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '20px', background: 'rgba(13,40,24,0.5)', borderRadius: 14, border: '1px solid rgba(76,175,114,0.15)' }}>
                  <div style={{ textAlign: 'center', minWidth: 90 }}>
                    <div style={{ fontSize: '3rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: getScoreColor(result.overallScore), lineHeight: 1 }}>{result.overallScore}</div>
                    <div style={{ fontSize: '0.72rem', color: '#a8c4b0', marginTop: 4 }}>/ 100</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: getScoreColor(result.overallScore), marginTop: 4 }}>{getScoreLabel(result.overallScore)}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>Overall Soil Health</div>
                    <div style={{ height: 10, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden', marginBottom: 12 }}>
                      <div style={{ width: `${result.overallScore}%`, height: '100%', background: getScoreColor(result.overallScore), borderRadius: 99, transition: 'width 1s ease' }} />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#a8c4b0' }}>pH: <span style={{ color: result.phColor, fontWeight: 600 }}>{form.ph} — {result.phStatus}</span></div>
                  </div>
                </div>

                {/* NPK */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {[
                    { label: 'Nitrogen', val: form.nitrogen, color: '#4caf72' },
                    { label: 'Phosphorus', val: form.phosphorus, color: '#60a5fa' },
                    { label: 'Potassium', val: form.potassium, color: '#e8b84b' },
                  ].map((n, i) => (
                    <div key={i} style={{ padding: '12px', background: 'rgba(13,40,24,0.5)', borderRadius: 12, border: '1px solid rgba(76,175,114,0.12)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: '#a8c4b0', marginBottom: 6 }}>{n.label}</div>
                      <div style={{ fontWeight: 700, color: n.val === 'High' ? '#4caf72' : n.val === 'Medium' ? '#e8b84b' : '#f87171', fontSize: '0.95rem' }}>{n.val}</div>
                    </div>
                  ))}
                </div>

                {/* Suggestions */}
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#a8c4b0', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>💡 AI Suggestions</div>
                  {result.suggestions.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', marginBottom: 8, background: 'rgba(13,40,24,0.5)', borderRadius: 10, border: `1px solid ${s.color}33`, fontSize: '0.84rem', color: '#e0e0e0' }}>
                      <span>{s.icon}</span><span>{s.text}</span>
                    </div>
                  ))}
                </div>

                {/* Best Crops */}
                <div style={{ padding: '14px 16px', background: 'rgba(232,184,75,0.08)', border: '1px solid rgba(232,184,75,0.2)', borderRadius: 12 }}>
                  <div style={{ fontSize: '0.78rem', color: '#e8b84b', marginBottom: 8, fontWeight: 600 }}>🌾 Is Soil ke liye Best Crops</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {result.bestCrops.map((c, i) => (
                      <span key={i} style={{ padding: '5px 12px', background: 'rgba(232,184,75,0.15)', borderRadius: 20, fontSize: '0.8rem', color: '#f5d07a' }}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}