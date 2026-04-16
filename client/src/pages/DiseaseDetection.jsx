import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'

const navItems = ['Dashboard', 'Simulator', 'Govt Schemes', 'Disease Scan', 'Risk Estimator', 'Soil Passport', 'Profit Estimator', 'Seasonal Planner', 'Crop Calendar', 'Community Forum', 'Alerts', 'Equipment Rental', 'Wallet']
const navIcons = ['📊', '🌿', '🏛️', '🦠', '⚠️', '🪱', '💰', '📅', '🗓️', '👥', '🔔', '🛠️', '👛']
const navRoutes = ['/dashboard', '/simulator', '/schemes', '/disease', '/risk', '/soil', '/profit', '/planner', '/crop-calendar', '/forum', '/alerts', '/rental', '/wallet']

export default function DiseaseDetection() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('Disease Scan')
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Farmer', location: 'India' }
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [crop, setCrop] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    setSelectedFile(file)
    setError('')
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const scanDisease = async () => {
    if (!selectedFile) {
      setError('Kripya image upload karein.')
      return
    }
    setLoading(true)
    setResult(null)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers.Authorization = `Bearer ${token}`

      // --- WALLET DEBIT START ---
      try {
        const payRes = await fetch(`${API_URL}/api/wallet/debit`, {
          method: 'POST',
          headers: headers, // Wahi headers use kar rahe hain jo upar banaye
          body: JSON.stringify({ 
            amount: 10, 
            description: '🦠 AI Disease Scan fee' 
          })
        });

        if (!payRes.ok) {
          // Agar balance kam hai ya koi error hai, toh hum sirf console kar rahe hain
          // Agar aap scan rokna chahte hain toh yahan 'throw new Error' kar sakte hain
          console.log('Wallet debit skip/failed');
        } else {
          console.log('Wallet debited: ₹10');
        }
      } catch (payErr) {
        console.error("Payment API failed:", payErr);
      }
      // --- WALLET DEBIT END ---

      const payload = {
        imageName: selectedFile.name,
        imageData: preview,
        crop,
        symptoms
      }

      // Existing AI Scan Call
      const res = await fetch(`${API_URL}/api/ai/disease-scan`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      })

      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(text || 'Server returned invalid JSON')
      }

      if (!res.ok) {
        throw new Error(data.error || text || 'Server error')
      }
      setResult(data)
    } catch (err) {
      setError(err.message || 'Kuch galat ho gaya. Dobara try karein.')
    } finally {
      setLoading(false)
    }
  }
  const reset = () => {
    setSelectedFile(null)
    setPreview('')
    setCrop('')
    setSymptoms('')
    setResult(null)
    setError('')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d2818', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>
      <style>{`
        .nav-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;cursor:pointer;transition:all 0.2s;font-size:0.88rem;font-weight:500;color:#a8c4b0;margin-bottom:4px}
        .nav-item:hover{background:rgba(76,175,114,0.1);color:#fff}
        .nav-item.active{background:rgba(232,184,75,0.15);color:#e8b84b;border:1px solid rgba(232,184,75,0.2)}
        .input-field{width:100%;padding:13px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(76,175,114,0.2);border-radius:10px;color:#fff;font-size:0.92rem;outline:none;transition:border-color 0.3s;font-family:'DM Sans',sans-serif}
        .input-field::placeholder{color:#a8c4b0}
        .input-field:focus{border-color:rgba(232,184,75,0.5)}
        .analyze-btn{width:100%;padding:15px;background:#e8b84b;color:#0d2818;border:none;border-radius:10px;font-weight:700;font-size:1rem;cursor:pointer;transition:all 0.3s;font-family:'DM Sans',sans-serif}
        .analyze-btn:hover{background:#f5d07a;transform:translateY(-2px);box-shadow:0 10px 25px rgba(232,184,75,0.3)}
        .analyze-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none}
        .card{background:rgba(26,74,46,0.4);border:1px solid rgba(76,175,114,0.15);border-radius:16px;padding:24px}
        .spinner{width:32px;height:32px;border:3px solid rgba(232,184,75,0.2);border-top-color:#e8b84b;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto}
        @keyframes spin{to{transform:rotate(360deg)}}
        .preview-box{width:100%;height:260px;border:1px dashed rgba(232,184,75,0.35);border-radius:16px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.03);color:#a8c4b0;text-align:center;}
        .preview-box img{max-width:100%;max-height:100%;border-radius:14px;object-fit:contain;}
        @media (max-width: 768px) {
          .main-content { margin-left: 0 !important; padding: 70px 16px 24px !important; }
          .disease-grid { grid-template-columns: 1fr !important; }
        }
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
        <div onClick={() => navigate('/profile')} style={{ borderTop: '1px solid rgba(76,175,114,0.1)', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2d7a4f,#4caf72)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{user.name.charAt(0).toUpperCase()}</div>
          <div><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div><div style={{ fontSize: '0.72rem', color: '#a8c4b0' }}>{user.location}</div></div>
          <div onClick={(e) => { e.stopPropagation(); localStorage.removeItem('user'); navigate('/'); }} style={{ marginLeft: 'auto', cursor: 'pointer', color: '#a8c4b0' }}>↩</div>
        </div>
      </div>

      <div className="main-content" style={{ marginLeft: 240, flex: 1, padding: '32px 36px' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🦠</div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', fontWeight: 700 }}>Disease Detection</h1>
              <p style={{ color: '#a8c4b0', fontSize: '0.88rem' }}>Upload crop image, scan with AI, aur turant disease advice lein.</p>
            </div>
          </div>
        </div>

        <div className="disease-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 24 }}>
          <div className="card">
            <div style={{ fontSize: '0.75rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24 }}>📷 Image Details</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, fontWeight: 500 }}>🌾 Crop Type (Optional)</label>
                <input className="input-field" value={crop} onChange={e => setCrop(e.target.value)} placeholder="Jaise: Wheat, Rice, Tomato" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, fontWeight: 500 }}>📝 Symptoms (Optional)</label>
                <textarea className="input-field" rows={4} value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="Patta pe daag, peele pan, sukhna etc." style={{ resize: 'vertical', minHeight: 110 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, fontWeight: 500 }}>📁 Image Upload</label>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%', color: '#fff' }} />
              </div>
              <div className="preview-box">
                {preview ? <img src={preview} alt="Preview" /> : 'Image upload karne ke baad preview yahan dikhega.'}
              </div>
              {error && <div style={{ color: '#f87171', fontSize: '0.92rem' }}>{error}</div>}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="analyze-btn" onClick={scanDisease} disabled={loading || !selectedFile}>
                  {loading ? '⏳ Scanning...' : '🔍 Scan Disease'}
                </button>
                <button onClick={reset} style={{ padding: '15px 20px', background: 'transparent', border: '1px solid rgba(76,175,114,0.3)', borderRadius: 10, color: '#a8c4b0', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: '0.88rem' }}>
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.75rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24 }}>🧠 AI Diagnosis</div>

            {!result && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: 0.6, minHeight: 320 }}>
                <div style={{ fontSize: '4rem' }}>🧪</div>
                <p style={{ color: '#a8c4b0', textAlign: 'center', fontSize: '0.9rem', lineHeight: 1.6 }}>Image upload karein aur disease scan karne ke liye button dabayen.</p>
              </div>
            )}

            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, minHeight: 320 }}>
                <div className="spinner" />
                <p style={{ color: '#a8c4b0', fontSize: '0.9rem' }}>AI image analyze kar raha hai...</p>
              </div>
            )}

            {result && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: '1.5rem' }}>✅</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e8b84b' }}>Result ready</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 18, color: '#e4e4e7', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {result.diagnosis || result.reply || 'AI response milne mein dikkat hui.'}
                </div>
                {result.advice && (
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 18, color: '#e4e4e7', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {result.advice}
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
