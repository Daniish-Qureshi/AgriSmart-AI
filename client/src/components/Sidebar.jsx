import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const navItems = ['Dashboard', 'Simulator', 'Risk Estimator', 'Soil Passport', 'Profit Estimator', 'Seasonal Planner', 'Alerts']
const navIcons = ['📊', '🌿', '⚠️', '🪱', '💰', '📅', '🔔']
const navRoutes = ['/dashboard', '/simulator', '/risk', '/soil', '/profit', '/planner', '/alerts']

export default function Sidebar({ activeItem }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', location: '' }
  const [open, setOpen] = useState(false)

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 8px 24px', borderBottom: '1px solid rgba(76,175,114,0.1)', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#2d7a4f,#e8b84b)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌾</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
            Agri<span style={{ color: '#e8b84b' }}>Smart</span>
          </span>
        </div>
        {/* Close button on mobile */}
        <button onClick={() => setOpen(false)} style={{ display: 'none', background: 'none', border: 'none', color: '#a8c4b0', fontSize: '1.4rem', cursor: 'pointer' }} className="sidebar-close">✕</button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {navItems.map((item, i) => (
          <div key={item}
            className={`nav-item ${activeItem === item ? 'active' : ''}`}
            onClick={() => { navigate(navRoutes[i]); setOpen(false) }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500, color: '#a8c4b0', marginBottom: 4, transition: 'all 0.2s' }}
          >
            <span>{navIcons[i]}</span>{item}
          </div>
        ))}
      </nav>

      {/* User */}
      <div onClick={() => { navigate('/profile'); setOpen(false) }}
        style={{ borderTop: '1px solid rgba(76,175,114,0.1)', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 8 }}>
        {user.avatar
          ? <img src={user.avatar} alt="av" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e8b84b' }} />
          : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2d7a4f,#4caf72)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {(user.name||'U').charAt(0).toUpperCase()}
            </div>
        }
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
          <div style={{ fontSize: '0.7rem', color: '#e8b84b' }}>View Profile →</div>
        </div>
        <div onClick={(e) => { e.stopPropagation(); localStorage.clear(); navigate('/') }}
          style={{ marginLeft: 'auto', cursor: 'pointer', color: '#a8c4b0', fontSize: '1rem', flexShrink: 0 }} title="Logout">↩</div>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        .nav-item:hover { background: rgba(76,175,114,0.1); color: #fff !important; }
        .nav-item.active { background: rgba(232,184,75,0.15); color: #e8b84b !important; border: 1px solid rgba(232,184,75,0.2); }
        .sidebar-overlay { display: none; }

        @media (max-width: 768px) {
          .sidebar-close { display: block !important; }
          .sidebar-overlay { display: ${open ? 'block' : 'none'}; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 49; }
        }
      `}</style>

      {/* Desktop Sidebar */}
      <div style={{
        width: 240, background: 'rgba(13,40,24,0.98)',
        borderRight: '1px solid rgba(76,175,114,0.12)',
        padding: '24px 16px',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        transform: open ? 'translateX(0)' : undefined,
        transition: 'transform 0.3s ease'
      }} className="sidebar-desktop">
        <SidebarContent />
      </div>

      {/* Mobile Hamburger */}
      <div style={{
        display: 'none', position: 'fixed', top: 16, left: 16, zIndex: 60,
        background: 'rgba(13,40,24,0.95)', border: '1px solid rgba(76,175,114,0.3)',
        borderRadius: 10, padding: '10px 14px', cursor: 'pointer', color: '#e8b84b', fontSize: '1.2rem'
      }} className="hamburger" onClick={() => setOpen(true)}>
        ☰
      </div>

      {/* Mobile Drawer */}
      <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      <div style={{
        display: 'none',
        position: 'fixed', top: 0, left: open ? 0 : '-260px',
        width: 240, height: '100vh',
        background: 'rgba(13,40,24,0.98)',
        borderRight: '1px solid rgba(76,175,114,0.12)',
        padding: '24px 16px', zIndex: 55,
        transition: 'left 0.3s ease'
      }} className="sidebar-mobile">
        <SidebarContent />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile { display: block !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}