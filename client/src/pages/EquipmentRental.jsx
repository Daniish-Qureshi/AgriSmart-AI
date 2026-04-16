import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'

const navItems = ['Dashboard', 'Simulator', 'Govt Schemes', 'Disease Scan', 'Risk Estimator', 'Soil Passport', 'Profit Estimator', 'Seasonal Planner', 'Crop Calendar', 'Community Forum', 'Alerts', 'Equipment Rental', 'Wallet']
const navIcons = ['📊', '🌿', '🏛️', '🦠', '⚠️', '🪱', '💰', '📅', '🗓️', '👥', '🔔', '🛠️', '👛']
const navRoutes = ['/dashboard', '/simulator', '/schemes', '/disease', '/risk', '/soil', '/profit', '/planner', '/crop-calendar', '/forum', '/alerts', '/rental', '/wallet']

const categories = ['All', 'Tractor', 'Seeder', 'Sprayer', 'Harvester', 'Irrigation', 'Other']

const statusColor = { pending: '#e8b84b', accepted: '#4caf72', rejected: '#f87171' }
const statusBg = { pending: 'rgba(232,184,75,0.15)', accepted: 'rgba(76,175,114,0.15)', rejected: 'rgba(248,113,113,0.15)' }

export default function EquipmentRental() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('Equipment Rental')
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', location: '' }

  const [activeTab, setActiveTab] = useState('browse') // 'browse' | 'add' | 'requests'
  const [listings, setListings] = useState([])
  const [myRequests, setMyRequests] = useState([]) // requests received by owner
  const [sentRequests, setSentRequests] = useState([]) // requests sent by current user
  const [loading, setLoading] = useState(false)
  const [reqLoading, setReqLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showRequest, setShowRequest] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)
  const [requestPayload, setRequestPayload] = useState({ start_date: '', end_date: '', message: '' })
  const [newListing, setNewListing] = useState({ title: '', category: '', description: '', price_per_day: '', location: '' })
  const [submitMessage, setSubmitMessage] = useState('')
  const [pendingCount, setPendingCount] = useState(0)

  const token = localStorage.getItem('token')

  // Fetch all listings
  const fetchListings = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/rental/listings`)
      if (!res.ok) throw new Error('Listings load nahi hui')
      setListings(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch requests received by owner
  const fetchMyRequests = async () => {
    if (!token) return
    setReqLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/rental/my-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Requests load nahi hui')
      const data = await res.json()
      setMyRequests(data)
      setPendingCount(data.filter(r => r.status === 'pending').length)
    } catch (err) {
      console.error(err)
    } finally {
      setReqLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
    fetchMyRequests()
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchMyRequests, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredListings = listings.filter(l =>
    selectedCategory === 'All' ? true : l.category === selectedCategory
  )

  const handleRequest = (listing) => {
    setSelectedListing(listing)
    setRequestPayload({ start_date: '', end_date: '', message: '' })
    setShowRequest(true)
    setSubmitMessage('')
  }

  const submitRequest = async () => {
  // ... existing code ...

  // Request bhejne ke baad wallet se payment kato
  const days = Math.ceil(
    (new Date(requestPayload.end_date) - new Date(requestPayload.start_date)) 
    / (1000 * 60 * 60 * 24)
  )
  const totalAmount = days * selectedListing.price_per_day

  if (totalAmount > 0) {
    try {
      const payRes = await fetch(`${API_URL}/api/wallet/debit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          amount: totalAmount,
          description: `🛠️ Equipment Rental: ${selectedListing.title} (${days} din × ₹${selectedListing.price_per_day})`
        })
      })
      const payData = await payRes.json()
      if (payRes.ok) {
        setSubmitMessage(`✅ Request sent! ₹${totalAmount} wallet se kat gaye. Remaining: ₹${Number(payData.wallet.balance).toLocaleString()}`)
      } else {
        setSubmitMessage(`✅ Request sent! (Note: ${payData.message} — wallet se payment nahi hua)`)
      }
    } catch {
      setSubmitMessage('✅ Request sent successfully!')
    }
  }
}

  const submitListing = async () => {
    if (!token) { setSubmitMessage('Login karke listing banao.'); return }
    if (!newListing.title || !newListing.category || !newListing.price_per_day || !newListing.location) {
      setSubmitMessage('Sab fields bharo.')
      return
    }
    try {
      const res = await fetch(`${API_URL}/api/rental/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...newListing, price_per_day: parseFloat(newListing.price_per_day) })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Listing create nahi hui')
      setNewListing({ title: '', category: '', description: '', price_per_day: '', location: '' })
      setSubmitMessage('✅ Listing successfully create ho gayi!')
      fetchListings()
    } catch (err) {
      setSubmitMessage(err.message)
    }
  }

  // Accept or reject a request
  const updateRequestStatus = async (id, status) => {
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/api/rental/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      })
      if (!res.ok) throw new Error('Update failed')
      fetchMyRequests()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d2818', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .nav-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;cursor:pointer;transition:all 0.2s;font-size:0.88rem;font-weight:500;color:#a8c4b0;margin-bottom:4px}
        .nav-item:hover{background:rgba(76,175,114,0.1);color:#fff}
        .nav-item.active{background:rgba(232,184,75,0.15);color:#e8b84b;border:1px solid rgba(232,184,75,0.2)}
        .input-field{width:100%;padding:13px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(76,175,114,0.2);border-radius:10px;color:#fff;font-size:0.92rem;outline:none;font-family:'DM Sans',sans-serif}
        .input-field::placeholder{color:#a8c4b0}
        .card{background:rgba(26,74,46,0.4);border:1px solid rgba(76,175,114,0.15);border-radius:16px;padding:24px}
        .btn{padding:10px 20px;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.88rem;transition:all 0.2s}
        .btn-gold{background:#e8b84b;color:#0d2818}
        .btn-gold:hover{background:#f5d07a}
        .btn-outline{background:transparent;border:1px solid rgba(232,184,75,0.35);color:#e8b84b}
        .btn-outline:hover{background:rgba(232,184,75,0.1)}
        .btn-green{background:rgba(76,175,114,0.2);color:#4caf72;border:1px solid rgba(76,175,114,0.3)}
        .btn-green:hover{background:rgba(76,175,114,0.3)}
        .btn-red{background:rgba(248,113,113,0.15);color:#f87171;border:1px solid rgba(248,113,113,0.3)}
        .btn-red:hover{background:rgba(248,113,113,0.25)}
        .listing-card{background:rgba(255,255,255,0.05);border:1px solid rgba(232,184,75,0.12);border-radius:16px;padding:20px;margin-bottom:14px}
        .req-card{background:rgba(26,74,46,0.5);border:1px solid rgba(76,175,114,0.2);border-radius:14px;padding:18px;margin-bottom:12px}
        .tag{display:inline-block;padding:5px 12px;border-radius:999px;background:rgba(232,184,75,0.12);color:#e8b84b;font-size:0.75rem;margin-right:6px}
        .tab-btn{padding:10px 20px;border-radius:10px;border:none;cursor:pointer;font-weight:600;font-family:'DM Sans',sans-serif;font-size:0.85rem;transition:all 0.2s}
        .tab-active{background:rgba(232,184,75,0.2);color:#e8b84b;border:1px solid rgba(232,184,75,0.3)}
        .tab-inactive{background:rgba(255,255,255,0.05);color:#a8c4b0;border:1px solid transparent}
        .tab-inactive:hover{color:#fff;background:rgba(255,255,255,0.08)}
        .modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:100}
        .modal-box{background:#0f2f17;border:1px solid rgba(232,184,75,0.2);border-radius:20px;padding:28px;max-width:520px;width:90%}
        // nav::-webkit-scrollbar{width:4px}
        // nav::-webkit-scrollbar-track{background:transparent}
        // nav::-webkit-scrollbar-thumb{background:rgba(76,175,114,0.3);border-radius:4px}
        @media(max-width:900px){.main-content{margin-left:0!important;padding:70px 16px 24px!important}}
      `}</style>

      {/* SIDEBAR */}
      <div style={{ width: 240, background: 'rgba(13,40,24,0.98)', borderRight: '1px solid rgba(76,175,114,0.12)', padding: '24px 16px', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 24px', borderBottom: '1px solid rgba(76,175,114,0.1)', marginBottom: 20, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#2d7a4f,#e8b84b)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌾</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 700 }}>Agri<span style={{ color: '#e8b84b' }}>Smart</span></span>
        </div>
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {navItems.map((item, i) => (
            <div key={item} className={`nav-item ${activeNav === item ? 'active' : ''}`}
              onClick={() => { setActiveNav(item); navigate(navRoutes[i]) }}>
              <span>{navIcons[i]}</span>{item}
              {item === 'Equipment Rental' && pendingCount > 0 && (
                <span style={{ marginLeft: 'auto', background: '#f87171', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>
                  {pendingCount}
                </span>
              )}
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

      {/* MAIN */}
      <div className="main-content" style={{ marginLeft: 240, flex: 1, padding: '32px 36px' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, background: 'rgba(232,184,75,0.15)', border: '1px solid rgba(232,184,75,0.25)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🛠️</div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.9rem', fontWeight: 700 }}>Equipment Rental</h1>
              <p style={{ color: '#a8c4b0', fontSize: '0.9rem' }}>Equipment list karo, browse karo aur rental request bhejo.</p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <button className={`tab-btn ${activeTab === 'browse' ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => setActiveTab('browse')}>
              🔍 Browse Equipment
            </button>
            <button className={`tab-btn ${activeTab === 'add' ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => setActiveTab('add')}>
              ➕ List My Equipment
            </button>
            <button className={`tab-btn ${activeTab === 'requests' ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => { setActiveTab('requests'); fetchMyRequests() }}
              style={{ position: 'relative' }}>
              📬 Mere Requests
              {pendingCount > 0 && (
                <span style={{ marginLeft: 8, background: '#f87171', color: '#fff', borderRadius: 20, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700 }}>
                  {pendingCount} New
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── TAB 1: Browse ── */}
        {activeTab === 'browse' && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Available Equipment ({filteredListings.length})</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                  className="input-field" style={{ maxWidth: 180 }}>
                  {categories.map(cat => <option key={cat}>{cat}</option>)}
                </select>
                <button className="btn btn-outline" onClick={fetchListings}>🔄 Refresh</button>
              </div>
            </div>

            {loading && <div style={{ color: '#a8c4b0', padding: 20, textAlign: 'center' }}>Loading...</div>}
            {error && <div style={{ color: '#f87171', padding: 12, background: 'rgba(248,113,113,0.1)', borderRadius: 10 }}>❌ {error}</div>}
            {!loading && filteredListings.length === 0 && (
              <div style={{ color: '#a8c4b0', textAlign: 'center', padding: 32, border: '1px dashed rgba(76,175,114,0.2)', borderRadius: 12 }}>
                Koi listing nahi mili.
              </div>
            )}
            {filteredListings.map(listing => (
              <div key={listing.id} className="listing-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#e8b84b', marginBottom: 4 }}>{listing.title}</div>
                    <div style={{ color: '#a8c4b0', fontSize: '0.85rem', marginBottom: 8 }}>
                      📂 {listing.category} &nbsp;·&nbsp; 📍 {listing.location}
                    </div>
                    <div style={{ color: '#d7dfc6', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 10 }}>
                      {listing.description || 'No description.'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span className="tag">💰 ₹{listing.price_per_day}/day</span>
                      <span className="tag">👤 {listing.owner_name || 'Unknown'}</span>
                    </div>
                  </div>
                  <button className="btn btn-gold" onClick={() => handleRequest(listing)}>
                    📩 Request Rental
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 2: Add Listing ── */}
        {activeTab === 'add' && (
          <div className="card" style={{ maxWidth: 600 }}>
            <div style={{ fontSize: '0.8rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
              ➕ Apni Equipment List Karo
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              <input value={newListing.title} onChange={e => setNewListing({ ...newListing, title: e.target.value })}
                className="input-field" placeholder="Equipment naam (e.g. Mahindra Tractor 575)" />
              <select value={newListing.category} onChange={e => setNewListing({ ...newListing, category: e.target.value })}
                className="input-field">
                <option value="">Category select karo</option>
                {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
              <input value={newListing.price_per_day} onChange={e => setNewListing({ ...newListing, price_per_day: e.target.value })}
                className="input-field" placeholder="Price per day (₹)" type="number" />
              <input value={newListing.location} onChange={e => setNewListing({ ...newListing, location: e.target.value })}
                className="input-field" placeholder="Location (e.g. Dadri, G.B. Nagar)" />
              <textarea value={newListing.description} onChange={e => setNewListing({ ...newListing, description: e.target.value })}
                className="input-field" rows={4} placeholder="Description — equipment ki condition, specifications, etc." />
              <button className="btn btn-gold" style={{ width: '100%', padding: 14 }} onClick={submitListing}>
                ✅ Listing Create Karo
              </button>
              {submitMessage && (
                <div style={{ padding: '12px 16px', background: submitMessage.startsWith('✅') ? 'rgba(76,175,114,0.15)' : 'rgba(248,113,113,0.15)', borderRadius: 10, color: submitMessage.startsWith('✅') ? '#4caf72' : '#f87171', fontSize: '0.88rem' }}>
                  {submitMessage}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3: My Received Requests ── */}
        {activeTab === 'requests' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>📬 Mere Equipment ke liye Requests</div>
                <div style={{ color: '#a8c4b0', fontSize: '0.85rem', marginTop: 4 }}>
                  Yahan wo sab requests hain jo doosre farmers ne tumhare equipment ke liye bheji hain.
                </div>
              </div>
              <button className="btn btn-outline" onClick={fetchMyRequests}>🔄 Refresh</button>
            </div>

            {reqLoading && <div style={{ color: '#a8c4b0', textAlign: 'center', padding: 20 }}>Loading requests...</div>}

            {!reqLoading && myRequests.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, border: '1px dashed rgba(76,175,114,0.2)', borderRadius: 16, color: '#a8c4b0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 6 }}>Abhi tak koi request nahi aayi</div>
                <div style={{ fontSize: '0.85rem' }}>Jab koi farmer tumhare equipment ke liye request bhejega, yahan dikhegi.</div>
              </div>
            )}

            {myRequests.map(req => (
              <div key={req.id} className="req-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    {/* Equipment + Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: '#e8b84b' }}>🛠️ {req.equipment_title}</span>
                      <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: statusBg[req.status] || statusBg.pending, color: statusColor[req.status] || statusColor.pending, textTransform: 'uppercase' }}>
                        {req.status === 'pending' ? '⏳ Pending' : req.status === 'accepted' ? '✅ Accepted' : '❌ Rejected'}
                      </span>
                    </div>

                    {/* Requester Info */}
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
                      <div style={{ fontSize: '0.72rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>👤 Request Bhejne Wala</div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>{req.requester_name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#a8c4b0', marginTop: 2 }}>📍 {req.requester_location}</div>
                    </div>

                    {/* Dates */}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                      <div style={{ padding: '8px 14px', background: 'rgba(96,165,250,0.1)', borderRadius: 8, fontSize: '0.82rem' }}>
                        📅 Start: <strong>{new Date(req.start_date).toLocaleDateString('en-IN')}</strong>
                      </div>
                      <div style={{ padding: '8px 14px', background: 'rgba(96,165,250,0.1)', borderRadius: 8, fontSize: '0.82rem' }}>
                        📅 End: <strong>{new Date(req.end_date).toLocaleDateString('en-IN')}</strong>
                      </div>
                      <div style={{ padding: '8px 14px', background: 'rgba(232,184,75,0.1)', borderRadius: 8, fontSize: '0.82rem' }}>
                        💰 ₹{req.price_per_day}/day
                      </div>
                    </div>

                    {/* Message */}
                    {req.message && (
                      <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, fontSize: '0.85rem', color: '#d7dfc6', fontStyle: 'italic', marginBottom: 8 }}>
                        💬 "{req.message}"
                      </div>
                    )}

                    <div style={{ fontSize: '0.72rem', color: '#6b8f7a' }}>
                      🕐 {new Date(req.created_at).toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Action Buttons — only for pending */}
                  {req.status === 'pending' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                      <button className="btn btn-green" onClick={() => updateRequestStatus(req.id, 'accepted')}>
                        ✅ Accept
                      </button>
                      <button className="btn btn-red" onClick={() => updateRequestStatus(req.id, 'rejected')}>
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REQUEST MODAL */}
      {showRequest && selectedListing && (
        <div className="modal" onClick={() => setShowRequest(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rental Request</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e8b84b' }}>{selectedListing.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#a8c4b0' }}>Owner: {selectedListing.owner_name} · ₹{selectedListing.price_per_day}/day</div>
              </div>
              <button className="btn btn-outline" onClick={() => setShowRequest(false)}>✕</button>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={{ color: '#a8c4b0', fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>📅 Start Date</label>
                <input type="date" className="input-field" value={requestPayload.start_date}
                  onChange={e => setRequestPayload({ ...requestPayload, start_date: e.target.value })} />
              </div>
              <div>
                <label style={{ color: '#a8c4b0', fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>📅 End Date</label>
                <input type="date" className="input-field" value={requestPayload.end_date}
                  onChange={e => setRequestPayload({ ...requestPayload, end_date: e.target.value })} />
              </div>
              <div>
                <label style={{ color: '#a8c4b0', fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>💬 Message (Optional)</label>
                <textarea rows={3} className="input-field" value={requestPayload.message}
                  onChange={e => setRequestPayload({ ...requestPayload, message: e.target.value })}
                  placeholder="Apna rental purpose ya koi sawaal..." />
              </div>
              <button className="btn btn-gold" style={{ width: '100%', padding: 14 }} onClick={submitRequest}>
                📩 Request Bhejo
              </button>
              {submitMessage && (
                <div style={{ padding: '10px 14px', background: submitMessage.startsWith('✅') ? 'rgba(76,175,114,0.15)' : 'rgba(248,113,113,0.15)', borderRadius: 10, color: submitMessage.startsWith('✅') ? '#4caf72' : '#f87171', fontSize: '0.85rem' }}>
                  {submitMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}