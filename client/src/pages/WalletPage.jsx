import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'

const navItems = ['Dashboard', 'Simulator', 'Govt Schemes', 'Disease Scan', 'Risk Estimator', 'Soil Passport', 'Profit Estimator', 'Seasonal Planner', 'Crop Calendar', 'Community Forum', 'Alerts', 'Equipment Rental', 'Wallet']
const navIcons = ['📊', '🌿', '🏛️', '🦠', '⚠️', '🪱', '💰', '📅', '🗓️', '👥', '🔔', '🛠️', '👛']
const navRoutes = ['/dashboard', '/simulator', '/schemes', '/disease', '/risk', '/soil', '/profit', '/planner', '/crop-calendar', '/forum', '/alerts', '/rental', '/wallet']

const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000]

export default function WalletPage() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('Wallet')
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', location: '' }
  const token = localStorage.getItem('token')

  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview') // overview | deposit | withdraw | history
  const [amount, setAmount] = useState('')
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [processing, setProcessing] = useState(false)

  const fetchWallet = async () => {
    try {
      const res = await fetch(`${API_URL}/api/wallet`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setWallet(data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_URL}/api/wallet/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTransactions(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWallet()
    fetchTransactions()
  }, [])

  const handleDeposit = async () => {
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    setMsg({ text: 'Valid amount dalo', type: 'error' }); return
  }
  setProcessing(true)
  try {
    // Step 1: Create order
    const res = await fetch(`${API_URL}/api/wallet/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ amount: Number(amount) })
    })
    const orderData = await res.json()
    if (!res.ok) throw new Error(orderData.message)

    // Step 2: Open Razorpay
    const options = {
      key: orderData.key,
      amount: orderData.amount * 100,
      currency: 'INR',
      name: 'AgriSmart',
      description: 'Wallet mein paisa add karo',
      order_id: orderData.orderId,
      handler: async (response) => {
        // Step 3: Verify payment
        const verifyRes = await fetch(`${API_URL}/api/wallet/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: Number(amount)
          })
        })
        const verifyData = await verifyRes.json()
        if (!verifyRes.ok) throw new Error(verifyData.message)
        setMsg({ text: `✅ ₹${Number(amount).toLocaleString()} wallet mein add ho gaye!`, type: 'success' })
        setAmount('')
        setWallet(verifyData.wallet)
        fetchTransactions()
      },
      prefill: {
        name: user.name,
        email: user.email || ''
      },
      theme: { color: '#e8b84b' }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  } catch (err) {
    setMsg({ text: err.message, type: 'error' })
  } finally {
    setProcessing(false)
  }
}

  const handleWithdraw = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setMsg({ text: 'Valid amount dalo', type: 'error' }); return
    }
    if (wallet && Number(amount) > Number(wallet.balance)) {
      setMsg({ text: 'Balance kam hai!', type: 'error' }); return
    }
    setProcessing(true)
    try {
      const res = await fetch(`${API_URL}/api/wallet/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: Number(amount) })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setMsg({ text: `✅ ₹${Number(amount).toLocaleString()} withdraw ho gaye!`, type: 'success' })
      setAmount('')
      setWallet(data.wallet)
      fetchTransactions()
    } catch (err) {
      setMsg({ text: err.message, type: 'error' })
    } finally {
      setProcessing(false)
    }
  }

  const totalCredit = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + Number(t.amount), 0)
  const totalDebit = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + Number(t.amount), 0)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d2818', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .nav-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;cursor:pointer;transition:all 0.2s;font-size:0.88rem;font-weight:500;color:#a8c4b0;margin-bottom:4px}
        .nav-item:hover{background:rgba(76,175,114,0.1);color:#fff}
        .nav-item.active{background:rgba(232,184,75,0.15);color:#e8b84b;border:1px solid rgba(232,184,75,0.2)}
        .card{background:rgba(26,74,46,0.4);border:1px solid rgba(76,175,114,0.15);border-radius:16px;padding:24px}
        .input-field{width:100%;padding:13px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(76,175,114,0.2);border-radius:10px;color:#fff;font-size:0.92rem;outline:none;font-family:'DM Sans',sans-serif}
        .input-field::placeholder{color:#a8c4b0}
        .input-field:focus{border-color:rgba(232,184,75,0.5)}
        .btn{padding:12px 20px;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.88rem;transition:all 0.2s}
        .btn-gold{background:#e8b84b;color:#0d2818}
        .btn-gold:hover{background:#f5d07a;transform:translateY(-1px)}
        .btn-gold:disabled{opacity:0.5;cursor:not-allowed;transform:none}
        .btn-outline{background:transparent;border:1px solid rgba(232,184,75,0.35);color:#e8b84b}
        .btn-outline:hover{background:rgba(232,184,75,0.1)}
        .tab-btn{padding:10px 20px;border-radius:10px;border:none;cursor:pointer;font-weight:600;font-family:'DM Sans',sans-serif;font-size:0.85rem;transition:all 0.2s}
        .tab-active{background:rgba(232,184,75,0.2);color:#e8b84b;border:1px solid rgba(232,184,75,0.3)}
        .tab-inactive{background:rgba(255,255,255,0.05);color:#a8c4b0;border:1px solid transparent}
        .tab-inactive:hover{color:#fff;background:rgba(255,255,255,0.08)}
        .quick-btn{padding:8px 16px;background:rgba(255,255,255,0.06);border:1px solid rgba(76,175,114,0.2);border-radius:8px;color:#a8c4b0;cursor:pointer;font-size:0.82rem;font-family:'DM Sans',sans-serif;transition:all 0.2s}
        .quick-btn:hover{background:rgba(232,184,75,0.15);color:#e8b84b;border-color:rgba(232,184,75,0.3)}
        // nav::-webkit-scrollbar{width:4px}
        // nav::-webkit-scrollbar-track{background:transparent}
        // nav::-webkit-scrollbar-thumb{background:rgba(76,175,114,0.3);border-radius:4px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.4s ease both}
        @media(max-width:768px){.main-content{margin-left:0!important;padding:70px 16px 24px!important}.stats-row{grid-template-columns:1fr 1fr!important}}
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
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 42, height: 42, background: 'rgba(232,184,75,0.15)', border: '1px solid rgba(232,184,75,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👛</div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.9rem', fontWeight: 700 }}>Farmer Wallet</h1>
              <p style={{ color: '#a8c4b0', fontSize: '0.9rem' }}>Apna digital wallet manage karo — paisa add karo, nikalo aur transactions dekho.</p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { key: 'overview', label: '📊 Overview' },
              { key: 'deposit', label: '➕ Add Money' },
              { key: 'withdraw', label: '➖ Withdraw' },
              { key: 'history', label: '📋 History' },
            ].map(tab => (
              <button key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? 'tab-active' : 'tab-inactive'}`}
                onClick={() => { setActiveTab(tab.key); setMsg({ text: '', type: '' }); setAmount('') }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB: Overview ── */}
        {activeTab === 'overview' && (
          <div className="fade-up">
            {/* Balance Card */}
            <div style={{ background: 'linear-gradient(135deg, rgba(45,122,79,0.6), rgba(26,74,46,0.8))', border: '1px solid rgba(232,184,75,0.3)', borderRadius: 20, padding: '32px 36px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, background: 'rgba(232,184,75,0.06)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', bottom: -20, right: 60, width: 100, height: 100, background: 'rgba(76,175,114,0.06)', borderRadius: '50%' }} />
              <div style={{ fontSize: '0.78rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                👛 {user.name} ka Wallet Balance
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '3.5rem', fontWeight: 700, color: '#e8b84b', marginBottom: 8 }}>
                ₹{wallet ? Number(wallet.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#a8c4b0' }}>
                Last updated: {wallet ? new Date(wallet.updated_at).toLocaleString('en-IN') : '—'}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button className="btn btn-gold" onClick={() => setActiveTab('deposit')}>➕ Add Money</button>
                <button className="btn btn-outline" onClick={() => setActiveTab('withdraw')}>➖ Withdraw</button>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Total Added', value: `₹${totalCredit.toLocaleString('en-IN')}`, color: '#4caf72', icon: '📈', bg: 'rgba(76,175,114,0.1)' },
                { label: 'Total Spent', value: `₹${totalDebit.toLocaleString('en-IN')}`, color: '#f87171', icon: '📉', bg: 'rgba(248,113,113,0.1)' },
                { label: 'Transactions', value: transactions.length, color: '#e8b84b', icon: '📋', bg: 'rgba(232,184,75,0.1)' },
              ].map((s, i) => (
                <div key={i} style={{ background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 14, padding: '20px 24px' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: '0.72rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Recent Transactions */}
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 16 }}>🕐 Recent Transactions</div>
              {loading && <div style={{ color: '#a8c4b0', textAlign: 'center', padding: 20 }}>Loading...</div>}
              {!loading && transactions.length === 0 && (
                <div style={{ color: '#a8c4b0', textAlign: 'center', padding: 24, border: '1px dashed rgba(76,175,114,0.2)', borderRadius: 12 }}>
                  Abhi koi transaction nahi hai. Pehle wallet mein paisa add karo!
                </div>
              )}
              {transactions.slice(0, 5).map((t, i) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent', borderRadius: 10, marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: t.type === 'credit' ? 'rgba(76,175,114,0.15)' : 'rgba(248,113,113,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                      {t.type === 'credit' ? '⬆️' : '⬇️'}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{t.description}</div>
                      <div style={{ fontSize: '0.72rem', color: '#a8c4b0' }}>{new Date(t.created_at).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: t.type === 'credit' ? '#4caf72' : '#f87171' }}>
                    {t.type === 'credit' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
              {transactions.length > 5 && (
                <button className="btn btn-outline" style={{ width: '100%', marginTop: 12 }} onClick={() => setActiveTab('history')}>
                  Saari transactions dekho →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: Deposit ── */}
        {activeTab === 'deposit' && (
          <div className="fade-up" style={{ maxWidth: 520 }}>
            <div className="card">
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>💰</div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Wallet mein Paisa Add Karo</div>
                <div style={{ color: '#a8c4b0', fontSize: '0.85rem', marginTop: 4 }}>
                  Current Balance: <span style={{ color: '#e8b84b', fontWeight: 700 }}>₹{wallet ? Number(wallet.balance).toLocaleString('en-IN') : '0'}</span>
                </div>
              </div>

              {/* Quick Amounts */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.78rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Quick Select</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {quickAmounts.map(qa => (
                    <button key={qa} className="quick-btn" onClick={() => setAmount(String(qa))}>
                      ₹{qa.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, display: 'block' }}>Amount (₹)</label>
                <input className="input-field" type="number" placeholder="Jaise: 5000"
                  value={amount} onChange={e => setAmount(e.target.value)} min="1" max="100000" />
                <div style={{ fontSize: '0.72rem', color: '#a8c4b0', marginTop: 6 }}>Max ₹1,00,000 ek baar mein</div>
              </div>

              <button className="btn btn-gold" style={{ width: '100%', padding: 14 }}
                onClick={handleDeposit} disabled={processing}>
                {processing ? '⏳ Processing...' : '✅ Add Money'}
              </button>

              {msg.text && (
                <div style={{ marginTop: 14, padding: '12px 16px', background: msg.type === 'success' ? 'rgba(76,175,114,0.15)' : 'rgba(248,113,113,0.15)', borderRadius: 10, color: msg.type === 'success' ? '#4caf72' : '#f87171', fontSize: '0.88rem' }}>
                  {msg.text}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: Withdraw ── */}
        {activeTab === 'withdraw' && (
          <div className="fade-up" style={{ maxWidth: 520 }}>
            <div className="card">
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏧</div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Wallet se Paisa Nikalo</div>
                <div style={{ color: '#a8c4b0', fontSize: '0.85rem', marginTop: 4 }}>
                  Available Balance: <span style={{ color: '#4caf72', fontWeight: 700 }}>₹{wallet ? Number(wallet.balance).toLocaleString('en-IN') : '0'}</span>
                </div>
              </div>

              {/* Quick Amounts */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.78rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Quick Select</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {quickAmounts.map(qa => (
                    <button key={qa} className="quick-btn"
                      onClick={() => setAmount(String(qa))}
                      style={{ opacity: wallet && Number(wallet.balance) < qa ? 0.4 : 1 }}>
                      ₹{qa.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.82rem', color: '#a8c4b0', marginBottom: 8, display: 'block' }}>Amount (₹)</label>
                <input className="input-field" type="number" placeholder="Jaise: 1000"
                  value={amount} onChange={e => setAmount(e.target.value)} min="1" />
              </div>

              <button className="btn btn-gold" style={{ width: '100%', padding: 14 }}
                onClick={handleWithdraw} disabled={processing}>
                {processing ? '⏳ Processing...' : '💸 Withdraw Karo'}
              </button>

              {msg.text && (
                <div style={{ marginTop: 14, padding: '12px 16px', background: msg.type === 'success' ? 'rgba(76,175,114,0.15)' : 'rgba(248,113,113,0.15)', borderRadius: 10, color: msg.type === 'success' ? '#4caf72' : '#f87171', fontSize: '0.88rem' }}>
                  {msg.text}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: History ── */}
        {activeTab === 'history' && (
          <div className="fade-up">
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>📋 Transaction History</div>
                <div style={{ fontSize: '0.82rem', color: '#a8c4b0' }}>Total: {transactions.length} transactions</div>
              </div>

              {transactions.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, border: '1px dashed rgba(76,175,114,0.2)', borderRadius: 12, color: '#a8c4b0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
                  <div>Abhi koi transaction nahi hai</div>
                </div>
              )}

              {transactions.map((t, i) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent', borderRadius: 12, marginBottom: 4, border: '1px solid rgba(76,175,114,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: t.type === 'credit' ? 'rgba(76,175,114,0.15)' : 'rgba(248,113,113,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                      {t.type === 'credit' ? '⬆️' : '⬇️'}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 3 }}>{t.description}</div>
                      <div style={{ fontSize: '0.72rem', color: '#a8c4b0' }}>
                        {new Date(t.created_at).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: t.type === 'credit' ? '#4caf72' : '#f87171' }}>
                      {t.type === 'credit' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.68rem', padding: '2px 8px', background: t.type === 'credit' ? 'rgba(76,175,114,0.15)' : 'rgba(248,113,113,0.15)', borderRadius: 20, color: t.type === 'credit' ? '#4caf72' : '#f87171', marginTop: 4, display: 'inline-block' }}>
                      {t.type === 'credit' ? 'Credit' : 'Debit'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}