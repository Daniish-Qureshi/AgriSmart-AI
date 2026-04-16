import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const apiKey = "3cb84763dd1296bc8f9d4d620db7c191"
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q="

const navItems = ['Dashboard', 'Simulator', 'Govt Schemes', 'Disease Scan', 'Risk Estimator', 'Soil Passport', 'Profit Estimator', 'Seasonal Planner', 'Crop Calendar', 'Community Forum', 'Alerts', 'Equipment Rental', 'Wallet']
const navIcons = ['📊', '🌿', '🏛️', '🦠', '⚠️', '🪱', '💰', '📅', '🗓️', '👥', '🔔', '🛠️', '👛']
const navRoutes = ['/dashboard', '/simulator', '/schemes', '/disease', '/risk', '/soil', '/profit', '/planner', '/crop-calendar', '/forum', '/alerts', '/rental', '/wallet']

const allAlerts = [
  { id: 1, type: 'Weather', icon: '🌧', title: 'Heavy Rain Alert', desc: 'Agle 2 din mein heavy rainfall expected hai. Drainage system check karo aur irrigation band karo.', severity: 'high', time: '2 hours ago', read: false },
  { id: 2, type: 'Market', icon: '📈', title: 'Wheat Price Surge', desc: 'Wheat mandi price 8% badh gaya hai — ₹2,180/quintal. Sell karne ka sahi waqt hai.', severity: 'medium', time: '4 hours ago', read: false },
  { id: 3, type: 'Disease', icon: '🦠', title: 'Aphid Attack Risk', desc: 'Tumhare region mein aphid infestation report hua hai. Neem oil ya imidacloprid spray karo.', severity: 'high', time: '6 hours ago', read: false },
  { id: 4, type: 'Weather', icon: '🌡', title: 'Temperature Drop', desc: 'Raat ka temperature 5°C tak girne ka estimate hai. Frost-sensitive crops ko cover karo.', severity: 'medium', time: '1 day ago', read: true },
  { id: 5, type: 'Market', icon: '📉', title: 'Onion Price Drop', desc: 'Onion market price 12% gir gaya. Storage mein rakho — 2 hafte baad recovery expected.', severity: 'low', time: '1 day ago', read: true },
  { id: 6, type: 'Soil', icon: '🪱', title: 'Soil Moisture Low', desc: 'Tumhari farm location mein soil moisture 18% se niche hai. Irrigation recommend ki jaati hai.', severity: 'medium', time: '2 days ago', read: true },
  { id: 7, type: 'Disease', icon: '🍄', title: 'Fungal Disease Warning', desc: 'Blast disease ke cases nearby farms mein detect hue hain. Fungicide spray karo preventively.', severity: 'high', time: '2 days ago', read: true },
  { id: 8, type: 'Weather', icon: '☀️', title: 'Clear Weather Ahead', desc: 'Agle 5 din sunny aur dry rahenge. Harvesting ke liye best window hai.', severity: 'low', time: '3 days ago', read: true },
]

const sevColor = { high: '#f87171', medium: '#e8b84b', low: '#4caf72' }
const sevBg = { high: 'rgba(239,68,68,0.15)', medium: 'rgba(232,184,75,0.12)', low: 'rgba(76,175,114,0.12)' }
const typeBg = { Weather: 'rgba(96,165,250,0.15)', Market: 'rgba(167,139,250,0.15)', Disease: 'rgba(239,68,68,0.15)', Soil: 'rgba(139,94,60,0.2)' }
const typeColor = { Weather: '#60a5fa', Market: '#a78bfa', Disease: '#f87171', Soil: '#c4895a' }

const getWeatherIcon = (main) => {
  const icons = { Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️', Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌫️', Haze: '🌫️', Smoke: '🌫️', Dust: '🌪️', Sand: '🌪️', Tornado: '🌪️' }
  return icons[main] || '🌤️'
}

const getFarmingTip = (weather, temp) => {
  if (weather === 'Rain' || weather === 'Drizzle') return '⚠️ Aaj irrigation band rakho — natural rainfall ho raha hai'
  if (weather === 'Thunderstorm') return '🚨 Khet mein kaam band karo — toofan aa raha hai'
  if (weather === 'Clear' && temp > 35) return '🌡️ Zyada garmi hai — subah ya shaam ko kaam karo, dopahar mein paani do'
  if (weather === 'Clear' && temp < 10) return '🥶 Thanda hai — frost-sensitive crops ko cover karo raat ko'
  if (weather === 'Clear') return '✅ Acha mausam hai — harvesting aur spraying ke liye perfect time'
  if (weather === 'Clouds') return '🌤️ Badal hain — spraying ke liye acha time, sun ka effect kam hoga'
  if (weather === 'Mist' || weather === 'Fog') return '🌫️ Kohra hai — fungal disease ka risk hai, field inspect karo'
  return '🌾 Mausam theek hai — normal farming activities continue karo'
}

export default function AlertsPage() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('Alerts')
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Danish', location: 'Dadri' }
  const [filter, setFilter] = useState('All')
  const [alerts, setAlerts] = useState(allAlerts)

  // Weather States
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState([])
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState('')
  const [city, setCity] = useState(user.location?.split(',')[0] || 'Dadri')
  const [cityInput, setCityInput] = useState('')

  const filtered = filter === 'All' ? alerts : alerts.filter(a => a.type === filter)
  const unread = alerts.filter(a => !a.read).length

  const markRead = (id) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })))

  // Fetch Weather
  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) return
    setWeatherLoading(true)
    setWeatherError('')
    try {
      // Current weather
      const res = await fetch(`${apiUrl}${cityName}&appid=${apiKey}`)
      if (!res.ok) throw new Error('City nahi mili')
      const data = await res.json()
      setWeatherData(data)

      // 5-day forecast
      const fRes = await fetch(`${forecastUrl}${cityName}&appid=${apiKey}`)
      const fData = await fRes.json()
      // Get one reading per day (every 8th item = 24hrs)
      const daily = fData.list.filter((_, i) => i % 8 === 0).slice(0, 5)
      setForecastData(daily)
      setCity(cityName)
    } catch (err) {
      setWeatherError('City nahi mili — dusra naam try karo')
    }
    setWeatherLoading(false)
  }

  useEffect(() => {
    fetchWeather(city)
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d2818', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>
      <style>{`
        .nav-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;cursor:pointer;transition:all 0.2s;font-size:0.88rem;font-weight:500;color:#a8c4b0;margin-bottom:4px}
        .nav-item:hover{background:rgba(76,175,114,0.1);color:#fff}
        .nav-item.active{background:rgba(232,184,75,0.15);color:#e8b84b;border:1px solid rgba(232,184,75,0.2)}
        .alert-card{background:rgba(26,74,46,0.35);border:1px solid rgba(76,175,114,0.12);border-radius:14px;padding:20px;transition:all 0.3s;cursor:pointer}
        .alert-card:hover{border-color:rgba(232,184,75,0.25);transform:translateX(4px)}
        .alert-card.unread{border-left:3px solid #e8b84b}
        .filter-btn{padding:8px 18px;border-radius:20px;border:1px solid rgba(76,175,114,0.2);background:transparent;color:#a8c4b0;cursor:pointer;font-size:0.82rem;font-family:'DM Sans',sans-serif;transition:all 0.2s}
        .filter-btn:hover{color:#fff;border-color:rgba(255,255,255,0.3)}
        .filter-btn.active{background:rgba(232,184,75,0.15);color:#e8b84b;border-color:rgba(232,184,75,0.3)}
        .weather-input{background:rgba(255,255,255,0.07);border:1px solid rgba(76,175,114,0.25);border-radius:10px;color:#fff;padding:10px 14px;font-size:0.88rem;font-family:'DM Sans',sans-serif;outline:none;width:200px}
        .weather-input::placeholder{color:#a8c4b0}
        .weather-input:focus{border-color:rgba(232,184,75,0.5)}
        .weather-search-btn{padding:10px 18px;background:#e8b84b;color:#0d2818;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.85rem;transition:all 0.2s}
        .weather-search-btn:hover{background:#f5d07a}
        .forecast-card{background:rgba(26,74,46,0.4);border:1px solid rgba(76,175,114,0.15);border-radius:12px;padding:14px;text-align:center;flex:1;min-width:90px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.5s ease both}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spinner{width:28px;height:28px;border:3px solid rgba(232,184,75,0.2);border-top-color:#e8b84b;border-radius:50%;animation:spin 0.8s linear infinite}
        @media(max-width:768px){
          .mobile-menu-btn{display:block !important}
          .sidebar{transform:translateX(-100%);transition:transform 0.3s ease;z-index:65}
          .sidebar.active{transform:translateX(0)}
          .main-content{margin-left:0 !important;padding:70px 16px 24px !important}
          .stats-grid{grid-template-columns:repeat(2,1fr) !important}
          .weather-grid{grid-template-columns:1fr !important}
          .forecast-row{flex-wrap:wrap !important}
        }
      `}</style>

      {/* Mobile Menu Button */}
      <button onClick={() => { document.querySelector('.sidebar').classList.toggle('active') }}
        style={{ display: 'none', position: 'fixed', top: 20, left: 20, zIndex: 100, background: '#e8b84b', border: 'none', borderRadius: 8, padding: '8px 12px', color: '#0d2818', fontWeight: 600, cursor: 'pointer' }}
        className="mobile-menu-btn">☰ Menu</button>

      {/* SIDEBAR */}
      <div className="sidebar" style={{ width: 240, background: 'rgba(13,40,24,0.95)', borderRight: '1px solid rgba(76,175,114,0.12)', padding: '24px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 28px', borderBottom: '1px solid rgba(76,175,114,0.1)', marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#2d7a4f,#e8b84b)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌾</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 700 }}>Agri<span style={{ color: '#e8b84b' }}>Smart</span></span>
        </div>
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden'}}>
          {navItems.map((item, i) => (
            <div key={item} className={`nav-item ${activeNav === item ? 'active' : ''}`} onClick={() => { setActiveNav(item); navigate(navRoutes[i]) }}>
              <span>{navIcons[i]}</span>{item}
              {item === 'Alerts' && unread > 0 && <span style={{ marginLeft: 'auto', background: '#f87171', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>{unread}</span>}
            </div>
          ))}
        </nav>
        <div onClick={() => navigate('/profile')} style={{ borderTop: '1px solid rgba(76,175,114,0.1)', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2d7a4f,#4caf72)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{user.name.charAt(0).toUpperCase()}</div>
          <div><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div><div style={{ fontSize: '0.72rem', color: '#a8c4b0' }}>{user.location}</div></div>
          <div onClick={() => { localStorage.removeItem('user'); navigate('/') }} style={{ marginLeft: 'auto', cursor: 'pointer', color: '#a8c4b0' }}>↩</div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-content" style={{ marginLeft: 240, flex: 1, padding: '32px 36px' }}>

        {/* Header */}
        <div className="fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🔔</div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', fontWeight: 700 }}>
                Alert System
                {unread > 0 && <span style={{ marginLeft: 12, fontSize: '0.9rem', padding: '3px 12px', background: 'rgba(248,113,113,0.2)', color: '#f87171', borderRadius: 20, fontWeight: 600 }}>{unread} New</span>}
              </h1>
              <p style={{ color: '#a8c4b0', fontSize: '0.88rem' }}>Live weather + disease aur market ki real-time updates</p>
            </div>
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(76,175,114,0.3)', borderRadius: 10, color: '#4caf72', cursor: 'pointer', fontSize: '0.85rem', fontFamily: "'DM Sans',sans-serif" }}>
              ✓ Sab Read Mark Karo
            </button>
          )}
        </div>

        {/* ══════ LIVE WEATHER SECTION ══════ */}
        <div className="fade-up" style={{ background: 'rgba(26,74,46,0.4)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: 18, padding: 24, marginBottom: 28 }}>
          
          {/* Weather Header + Search */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🌦️</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Live Weather</div>
                <div style={{ fontSize: '0.72rem', color: '#a8c4b0' }}>OpenWeatherMap API — Real-time data</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                className="weather-input"
                placeholder="City name likho..."
                value={cityInput}
                onChange={e => setCityInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchWeather(cityInput)}
              />
              <button className="weather-search-btn" onClick={() => fetchWeather(cityInput)}>
                🔍 Search
              </button>
            </div>
          </div>

          {/* Weather Content */}
          {weatherLoading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px 0', gap: 14 }}>
              <div className="spinner" />
              <span style={{ color: '#a8c4b0' }}>Weather data fetch ho raha hai...</span>
            </div>
          )}

          {weatherError && (
            <div style={{ padding: '16px 20px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, color: '#f87171', fontSize: '0.88rem' }}>
              ❌ {weatherError}
            </div>
          )}

          {weatherData && !weatherLoading && (
            <>
              {/* Main Weather Card */}
              <div className="weather-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 16 }}>
                
                {/* Current Weather */}
                <div style={{ background: 'rgba(13,40,24,0.5)', borderRadius: 14, padding: '20px 24px', border: '1px solid rgba(96,165,250,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>📍 {weatherData.name}, {weatherData.sys.country}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                    <span style={{ fontSize: '4rem' }}>{getWeatherIcon(weatherData.weather[0].main)}</span>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '3rem', fontWeight: 700, lineHeight: 1, color: '#e8b84b' }}>
                        {Math.round(weatherData.main.temp)}°C
                      </div>
                      <div style={{ color: '#a8c4b0', fontSize: '0.88rem', textTransform: 'capitalize' }}>
                        {weatherData.weather[0].description}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {[
                      { icon: '🌡️', label: 'Feels Like', value: `${Math.round(weatherData.main.feels_like)}°C` },
                      { icon: '💧', label: 'Humidity', value: `${weatherData.main.humidity}%` },
                      { icon: '💨', label: 'Wind', value: `${weatherData.wind.speed} m/s` },
                      { icon: '👁️', label: 'Visibility', value: `${(weatherData.visibility / 1000).toFixed(1)} km` },
                      { icon: '📊', label: 'Pressure', value: `${weatherData.main.pressure} hPa` },
                      { icon: '☁️', label: 'Clouds', value: `${weatherData.clouds.all}%` },
                    ].map((item, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 10px' }}>
                        <div style={{ fontSize: '0.7rem', color: '#a8c4b0', marginBottom: 3 }}>{item.icon} {item.label}</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Farming Advice + Sunrise/Sunset */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Farming Tip */}
                  <div style={{ background: 'rgba(232,184,75,0.1)', border: '1px solid rgba(232,184,75,0.25)', borderRadius: 12, padding: '16px 18px', flex: 1 }}>
                    <div style={{ fontSize: '0.72rem', color: '#e8b84b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>⚡ Farming Advisory</div>
                    <div style={{ fontSize: '0.88rem', color: '#e0e0e0', lineHeight: 1.7 }}>
                      {getFarmingTip(weatherData.weather[0].main, weatherData.main.temp)}
                    </div>
                    <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(13,40,24,0.5)', borderRadius: 8, fontSize: '0.78rem', color: '#a8c4b0' }}>
                      Min: {Math.round(weatherData.main.temp_min)}°C &nbsp;|&nbsp; Max: {Math.round(weatherData.main.temp_max)}°C
                    </div>
                  </div>

                  {/* Sunrise Sunset */}
                  <div style={{ background: 'rgba(13,40,24,0.5)', border: '1px solid rgba(76,175,114,0.15)', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-around' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem' }}>🌅</div>
                      <div style={{ fontSize: '0.7rem', color: '#a8c4b0', marginTop: 4 }}>Sunrise</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e8b84b' }}>
                        {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ width: 1, background: 'rgba(76,175,114,0.2)' }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem' }}>🌇</div>
                      <div style={{ fontSize: '0.7rem', color: '#a8c4b0', marginTop: 4 }}>Sunset</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e8b84b' }}>
                        {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              {forecastData.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#a8c4b0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>📅 5-Day Forecast</div>
                  <div className="forecast-row" style={{ display: 'flex', gap: 10 }}>
                    {forecastData.map((day, i) => (
                      <div key={i} className="forecast-card">
                        <div style={{ fontSize: '0.72rem', color: '#a8c4b0', marginBottom: 6 }}>
                          {i === 0 ? 'Aaj' : new Date(day.dt * 1000).toLocaleDateString('en-IN', { weekday: 'short' })}
                        </div>
                        <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>{getWeatherIcon(day.weather[0].main)}</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e8b84b' }}>{Math.round(day.main.temp)}°C</div>
                        <div style={{ fontSize: '0.65rem', color: '#a8c4b0', marginTop: 2, textTransform: 'capitalize' }}>{day.weather[0].main}</div>
                        <div style={{ fontSize: '0.65rem', color: '#60a5fa', marginTop: 4 }}>💧 {day.main.humidity}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {/* ══════ END WEATHER SECTION ══════ */}

        {/* Stats */}
        <div className="fade-up stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total Alerts', value: alerts.length, color: '#fff' },
            { label: 'Unread', value: unread, color: '#e8b84b' },
            { label: 'High Priority', value: alerts.filter(a => a.severity === 'high').length, color: '#f87171' },
            { label: 'Weather', value: alerts.filter(a => a.type === 'Weather').length, color: '#60a5fa' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '16px 20px', background: 'rgba(26,74,46,0.35)', border: '1px solid rgba(76,175,114,0.15)', borderRadius: 12 }}>
              <div style={{ fontSize: '0.72rem', color: '#a8c4b0', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="fade-up" style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['All', 'Weather', 'Market', 'Disease', 'Soil'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        {/* Alerts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((a, i) => (
            <div key={a.id} className={`alert-card ${!a.read ? 'unread' : ''}`} onClick={() => markRead(a.id)} style={{ animationDelay: `${i * 0.05}s` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: typeBg[a.type], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{a.title}</span>
                    <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600, background: sevBg[a.severity], color: sevColor[a.severity], textTransform: 'uppercase' }}>{a.severity}</span>
                    <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: '0.68rem', background: typeBg[a.type], color: typeColor[a.type] }}>{a.type}</span>
                    {!a.read && <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '0.65rem', background: 'rgba(232,184,75,0.2)', color: '#e8b84b', fontWeight: 600 }}>NEW</span>}
                  </div>
                  <p style={{ color: '#a8c4b0', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 8 }}>{a.desc}</p>
                  <span style={{ fontSize: '0.75rem', color: '#6b8f7a' }}>🕐 {a.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}