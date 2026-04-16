import { useEffect } from "react";
import logo from "../assets/logo.jpg.jpeg";
import heroImage from "../assets/hero-image.jpg";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: "🌿", title: "Farming Simulator", desc: "Crop, budget aur season enter karo. AI profit ya loss pehle hi bata dega with detailed ROI analysis.", color: "#2d7a4f", tag: "AI Powered" },
  { icon: "⚠️", title: "Risk Estimator", desc: "Weather patterns aur soil data ke basis par crop failure ka risk percentage milega.", color: "#ef4444", tag: "Smart Analysis" },
  { icon: "🪱", title: "Soil Health Passport", desc: "Zameen ka digital health record rakho. AI se personalized soil improvement suggestions pao.", color: "#8b5e3c", tag: "Digital Record" },
  { icon: "💰", title: "Profit Estimator", desc: "Multiple crops compare karo aur dekho kaunsa crop sabse zyada profitable hai.", color: "#e8b84b", tag: "Compare Crops" },
  { icon: "📅", title: "Seasonal Planner", desc: "Month-by-month farming calendar — kya boona hai, kab pani dena hai, sab organized.", color: "#14b8a6", tag: "Planning Tool" },
  { icon: "🔔", title: "Smart Alerts", desc: "Real-time weather warnings, disease alerts aur mandi price updates ek jagah.", color: "#3b82f6", tag: "Real-Time" },
  { icon: "🦠", title: "Disease Scan", desc: "Crop ki photo upload karo — Gemini Vision AI disease detect karega aur treatment batayega.", color: "#a855f7", tag: "Vision AI" },
  { icon: "🌦️", title: "Live Weather", desc: "OpenWeatherMap API se live weather + 5-day forecast + farming advisory ek saath.", color: "#06b6d4", tag: "Live Data" },
  { icon: "🛠️", title: "Equipment Rental", desc: "Farm equipment list karo, browse karo, rent karo — notifications ke saath.", color: "#f97316", tag: "Marketplace" },
  { icon: "🏛️", title: "Govt Schemes", desc: "PM-KISAN, PMFBY, KCC aur sabhi agriculture schemes — eligibility ke saath.", color: "#64748b", tag: "Official Info" },
  { icon: "👛", title: "Farmer Wallet", desc: "Razorpay se paisa add karo, rental pay karo, digital transactions manage karo.", color: "#10b981", tag: "FinTech" },
  { icon: "👥", title: "Community Forum", desc: "Farmers ek doosre se sawaal poochh sakte hain — knowledge sharing platform.", color: "#f59e0b", tag: "Community" },
];

const stats = [
  { num: "22+", label: "Pages" },
  { num: "17+", label: "AI Features" },
  { num: "8", label: "DB Tables" },
  { num: "₹0", label: "Cost to Use" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "#060f0a", color: "#fff", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }

        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(50px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        @keyframes rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        .pulse-dot { animation: pulse 2.5s infinite; }
        .float { animation: float 6s ease-in-out infinite; }

        .hero-animate { animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) both; }
        .hero-animate-2 { animation: fadeUp 1s 0.15s cubic-bezier(0.16,1,0.3,1) both; }
        .hero-animate-3 { animation: fadeUp 1s 0.3s cubic-bezier(0.16,1,0.3,1) both; }
        .hero-animate-4 { animation: scaleIn 1s 0.45s cubic-bezier(0.16,1,0.3,1) both; }

        .nav-link { position:relative; color:#a8c4b0; text-decoration:none; font-size:0.88rem; font-weight:500; transition:color 0.2s; padding-bottom:2px; }
        .nav-link::after { content:''; position:absolute; bottom:0; left:0; width:0; height:1px; background:#e8b84b; transition:width 0.3s; }
        .nav-link:hover { color:#fff; }
        .nav-link:hover::after { width:100%; }

        .btn-primary { background:#e8b84b; color:#060f0a; padding:14px 32px; border-radius:8px; font-weight:700; font-size:0.92rem; border:none; cursor:pointer; transition:all 0.3s cubic-bezier(0.16,1,0.3,1); letter-spacing:0.01em; }
        .btn-primary:hover { background:#f5d07a; transform:translateY(-3px); box-shadow:0 20px 40px rgba(232,184,75,0.35); }
        .btn-secondary { background:rgba(255,255,255,0.06); color:#fff; padding:14px 32px; border-radius:8px; font-weight:500; font-size:0.92rem; border:1px solid rgba(255,255,255,0.12); cursor:pointer; transition:all 0.3s; backdrop-filter:blur(10px); }
        .btn-secondary:hover { background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.25); transform:translateY(-2px); }

        .feature-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:20px; padding:28px; transition:all 0.4s cubic-bezier(0.16,1,0.3,1); cursor:pointer; position:relative; overflow:hidden; }
        .feature-card::before { content:''; position:absolute; inset:0; border-radius:20px; background:linear-gradient(135deg, rgba(232,184,75,0.06), transparent); opacity:0; transition:opacity 0.4s; }
        .feature-card:hover { transform:translateY(-8px); border-color:rgba(232,184,75,0.25); box-shadow:0 30px 60px rgba(0,0,0,0.4); }
        .feature-card:hover::before { opacity:1; }

        .stat-item { text-align:center; padding:28px 24px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; transition:all 0.3s; }
        .stat-item:hover { border-color:rgba(232,184,75,0.3); transform:translateY(-4px); }

        .step-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:20px; padding:36px 28px; transition:all 0.4s; flex:1; }
        .step-card:hover { border-color:rgba(232,184,75,0.3); transform:translateY(-6px); box-shadow:0 20px 50px rgba(0,0,0,0.3); }

        .mobile-nav { display:none; }
        @media (max-width:768px) {
          .desktop-nav { display:none !important; }
          .mobile-nav-btn { display:flex !important; }
          .hero-grid { flex-direction:column !important; }
          .hero-stats { position:relative !important; right:auto !important; top:auto !important; transform:none !important; flex-direction:row !important; flex-wrap:wrap !important; justify-content:center !important; margin-top:40px !important; }
          .features-grid { grid-template-columns:1fr !important; }
          .steps-row { flex-direction:column !important; }
          .step-connector { display:none !important; }
          .stats-row { grid-template-columns:repeat(2,1fr) !important; }
          .hero-title { font-size:2.4rem !important; }
          .section-pad { padding:70px 20px !important; }
          .footer-row { flex-direction:column !important; gap:16px !important; text-align:center !important; padding:28px 20px !important; }
          .nav-pad { padding:14px 20px !important; }
        }
        @media (max-width:480px) {
          .hero-title { font-size:1.9rem !important; }
          .features-grid { grid-template-columns:1fr !important; }
          .stat-item { padding:20px 16px !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 60px", background:"rgba(6,15,10,0.85)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.06)" }} className="nav-pad">

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, fontFamily:"'Playfair Display',serif", fontSize:"1.35rem", fontWeight:700, cursor:"pointer" }} onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}>
          <img src={logo} alt="logo" style={{ width:36, height:36, borderRadius:9, objectFit:"cover", border:"1px solid rgba(232,184,75,0.3)" }} />
          Agri<span style={{ color:"#e8b84b" }}>Smart</span>
        </div>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display:"flex", alignItems:"center", gap:32 }}>
          {[["Features","#features"],["How it Works","#how-it-works"],["Dashboard","/dashboard"]].map(([name,href]) => (
            <a key={name} href={href} className="nav-link"
              onClick={(e) => { if(href.startsWith("#")){ e.preventDefault(); document.querySelector(href)?.scrollIntoView({behavior:"smooth"}); } }}>
              {name}
            </a>
          ))}
          <button className="btn-primary" style={{ padding:"10px 24px" }} onClick={() => navigate("/login")}>
            Get Started
          </button>
        </div>

        {/* Mobile Nav Button */}
        <button className="mobile-nav-btn" onClick={() => { const m = document.querySelector(".mobile-nav"); m.style.display = m.style.display==="flex"?"none":"flex"; }}
          style={{ display:"none", background:"none", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", fontSize:"1.2rem", cursor:"pointer", padding:"8px 12px", borderRadius:8 }}>
          ☰
        </button>

        {/* Mobile Dropdown */}
        <div className="mobile-nav" style={{ display:"none", position:"absolute", top:"100%", left:0, right:0, background:"rgba(6,15,10,0.98)", backdropFilter:"blur(20px)", flexDirection:"column", padding:"20px 24px", gap:12, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          {[["Features","#features"],["How it Works","#how-it-works"],["Dashboard","/dashboard"]].map(([name,href]) => (
            <a key={name} href={href} style={{ color:"#a8c4b0", textDecoration:"none", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.06)", fontSize:"0.95rem" }}
              onClick={(e)=>{ if(href.startsWith("#")){ e.preventDefault(); document.querySelector(href)?.scrollIntoView({behavior:"smooth"}); document.querySelector(".mobile-nav").style.display="none"; } }}>
              {name}
            </a>
          ))}
          <button className="btn-primary" style={{ marginTop:8 }} onClick={()=>navigate("/login")}>Get Started</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", padding:"120px 60px 80px", position:"relative", overflow:"hidden", backgroundImage:`linear-gradient(rgba(6,15,10,0.55),rgba(6,15,10,0.7)),url(${heroImage})`, backgroundSize:"cover", backgroundPosition:"center" }} className="section-pad">

        {/* Decorative orbs */}
        <div style={{ position:"absolute", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle, rgba(45,122,79,0.2), transparent 70%)", top:-200, right:-100, pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(232,184,75,0.12), transparent 70%)", bottom:-100, left:100, pointerEvents:"none" }} />

        {/* Grain overlay */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")", opacity:0.4, pointerEvents:"none" }} />

        <div className="hero-grid" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", maxWidth:1300, margin:"0 auto", gap:60 }}>

          {/* Left — Text */}
          <div style={{ maxWidth:620, position:"relative", zIndex:2 }}>
            {/* Badge */}
            <div className="hero-animate" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(232,184,75,0.1)", border:"1px solid rgba(232,184,75,0.25)", color:"#f5d07a", padding:"7px 16px", borderRadius:50, fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:28 }}>
              <span className="pulse-dot" style={{ width:6, height:6, background:"#e8b84b", borderRadius:"50%", display:"inline-block" }} />
              🇮🇳 &nbsp;Kisan ke liye, AI ke saath
            </div>

            {/* Title */}
            <h1 className="hero-animate-2 hero-title" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.8rem,5vw,4.8rem)", lineHeight:1.05, fontWeight:900, letterSpacing:"-0.02em", marginBottom:24 }}>
              Make farming<br />
              <em style={{ color:"#e8b84b", fontStyle:"italic" }}>Smart,</em> Safe<br />
              &amp; Profitable.
            </h1>

            {/* Desc */}
            <p className="hero-animate-3" style={{ fontSize:"1.02rem", color:"#8aab96", lineHeight:1.8, maxWidth:500, marginBottom:44, fontWeight:300 }}>
              AgriSmart is India's most complete AI-powered farming platform — crop simulation, disease detection, equipment rental, government schemes, and a digital wallet. Sab kuch ek jagah.
            </p>

            {/* Buttons */}
            <div className="hero-animate-4" style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              <button className="btn-primary" onClick={() => navigate("/login")}>🚀 Abhi Shuru Karo</button>
              <button className="btn-secondary" onClick={() => document.getElementById("features")?.scrollIntoView({behavior:"smooth"})}>Features Dekho →</button>
            </div>

            {/* Trust badges */}
            <div className="hero-animate-4" style={{ display:"flex", gap:24, marginTop:40, paddingTop:32, borderTop:"1px solid rgba(255,255,255,0.07)", flexWrap:"wrap" }}>
              {[["🔒","100% Secure","JWT Auth"],["⚡","Super Fast","Groq AI"],["🆓","Free Forever","Zero Cost"]].map(([icon,title,sub],i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:"1.2rem" }}>{icon}</span>
                  <div>
                    <div style={{ fontSize:"0.82rem", fontWeight:600, color:"#fff" }}>{title}</div>
                    <div style={{ fontSize:"0.7rem", color:"#5a8a6a" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Stat Cards */}
          <div className="hero-stats float" style={{ display:"flex", flexDirection:"column", gap:16, zIndex:2, flexShrink:0 }}>
            {[
              { icon:"🌱", num:"22+", label:"Total Pages", sub:"Full platform" },
              { icon:"🤖", num:"17+", label:"AI Features", sub:"Groq + Gemini" },
              { icon:"⚡", num:"Live", label:"Weather + Mandi", sub:"OpenWeatherMap" },
              { icon:"💳", num:"Razorpay", label:"Payment Gateway", sub:"UPI / Card" },
            ].map((s,i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"18px 24px", backdropFilter:"blur(20px)", minWidth:210, transition:"all 0.3s", cursor:"default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(232,184,75,0.35)"; e.currentTarget.style.background="rgba(232,184,75,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}>
                <div style={{ fontSize:"1.4rem", marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", fontWeight:700, color:"#e8b84b", lineHeight:1 }}>{s.num}</div>
                <div style={{ fontSize:"0.8rem", fontWeight:600, color:"#fff", marginTop:4 }}>{s.label}</div>
                <div style={{ fontSize:"0.68rem", color:"#5a8a6a", marginTop:2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="reveal section-pad" style={{ padding:"60px", background:"rgba(255,255,255,0.02)", borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div className="stats-row" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, maxWidth:900, margin:"0 auto" }}>
          {stats.map((s,i) => (
            <div key={i} className="stat-item">
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"2.2rem", fontWeight:900, color:"#e8b84b", lineHeight:1 }}>{s.num}</div>
              <div style={{ fontSize:"0.78rem", color:"#5a8a6a", marginTop:6, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.08em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="reveal section-pad" style={{ padding:"100px 60px" }}>
        <div style={{ textAlign:"center", marginBottom:64, maxWidth:600, margin:"0 auto 64px" }}>
          <div style={{ color:"#4caf72", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:14 }}>✦ &nbsp;Core Features</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,3.5vw,2.8rem)", fontWeight:700, marginBottom:14 }}>Sab Kuch Ek Platform Par</h2>
          <p style={{ color:"#5a8a6a", fontSize:"0.95rem", lineHeight:1.8 }}>Har feature specifically Indian farmers ki daily challenges ke liye design kiya gaya hai.</p>
        </div>

        <div className="features-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, maxWidth:1200, margin:"0 auto" }}>
          {features.map((f,i) => (
            <div key={i} className="feature-card reveal" style={{ transitionDelay:`${(i%3)*0.1}s` }}>
              {/* Tag */}
              <div style={{ display:"inline-block", padding:"3px 10px", background:`${f.color}20`, border:`1px solid ${f.color}40`, borderRadius:20, fontSize:"0.65rem", fontWeight:700, color:f.color, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:16 }}>
                {f.tag}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                <div style={{ width:46, height:46, borderRadius:12, background:`${f.color}18`, border:`1px solid ${f.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem", flexShrink:0 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", fontWeight:700 }}>{f.title}</h3>
              </div>
              <p style={{ color:"#5a8a6a", fontSize:"0.83rem", lineHeight:1.75, fontWeight:300 }}>{f.desc}</p>
              <div style={{ marginTop:16, display:"flex", alignItems:"center", gap:6, fontSize:"0.7rem", fontWeight:600, color:"#e8b84b", letterSpacing:"0.06em", textTransform:"uppercase" }}>
                Explore <span style={{ fontSize:"0.9rem" }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="reveal section-pad" style={{ padding:"100px 60px", background:"rgba(255,255,255,0.02)", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <div style={{ color:"#4caf72", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:14 }}>✦ &nbsp;How It Works</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,3vw,2.8rem)", fontWeight:700, marginBottom:14 }}>3 Simple Steps</h2>
          <p style={{ color:"#5a8a6a", fontSize:"0.95rem" }}>Start karo aur minutes mein AI-powered farming insights pao.</p>
        </div>

        <div className="steps-row" style={{ display:"flex", gap:0, maxWidth:1000, margin:"0 auto", alignItems:"stretch" }}>
          {[
            { num:"01", icon:"👤", title:"Profile Banao", desc:"Zameen ka area, location aur soil type enter karo. Account free mein banao — sirf 2 minutes." },
            { num:"02", icon:"🌾", title:"Feature Use Karo", desc:"Simulator, Disease Scan, Weather, Rental, Schemes — jo chahiye wo select karo. AI baaki karega." },
            { num:"03", icon:"📊", title:"Smart Decision Lo", desc:"Profit estimate, risk report, soil suggestions aur mandi prices — sab data ke saath faisla lo." },
          ].map((s,i) => (
            <div key={i} style={{ display:"flex", alignItems:"stretch", flex:1 }}>
              <div className="step-card reveal" style={{ transitionDelay:`${i*0.15}s` }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"2.5rem", fontWeight:900, color:"rgba(232,184,75,0.2)", lineHeight:1 }}>{s.num}</span>
                  <div style={{ width:42, height:42, borderRadius:10, background:"rgba(232,184,75,0.1)", border:"1px solid rgba(232,184,75,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem" }}>{s.icon}</div>
                </div>
                <h4 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:700, marginBottom:10 }}>{s.title}</h4>
                <p style={{ color:"#5a8a6a", fontSize:"0.84rem", lineHeight:1.75, fontWeight:300 }}>{s.desc}</p>
              </div>
              {i < 2 && <div className="step-connector" style={{ width:1, background:"linear-gradient(to bottom, transparent, rgba(232,184,75,0.3), transparent)", margin:"32px 0", flexShrink:0 }} />}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="reveal section-pad" style={{ padding:"120px 60px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 800px 500px at 50% 50%, rgba(45,122,79,0.12), transparent)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:1, height:"80%", background:"linear-gradient(to bottom, transparent, rgba(232,184,75,0.15), transparent)", left:"50%", top:"10%", pointerEvents:"none" }} />

        <div style={{ position:"relative", maxWidth:600, margin:"0 auto" }}>
          <div style={{ display:"inline-block", padding:"5px 16px", background:"rgba(232,184,75,0.1)", border:"1px solid rgba(232,184,75,0.2)", borderRadius:20, fontSize:"0.7rem", fontWeight:700, color:"#e8b84b", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:24 }}>
            ✦ Get Started Today
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.2rem,4vw,3.8rem)", fontWeight:900, lineHeight:1.05, marginBottom:20 }}>
            Teri Kheti,<br />
            <span style={{ color:"#e8b84b", fontStyle:"italic" }}>Tera Data, Tera Faisla.</span>
          </h2>
          <p style={{ color:"#5a8a6a", fontSize:"1rem", maxWidth:440, margin:"0 auto 44px", lineHeight:1.8, fontWeight:300 }}>
            AgriSmart ke saath apni farming journey shuru karo — free hai, fast hai, aur teri bhasha mein hai.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn-primary" style={{ fontSize:"1rem", padding:"16px 40px" }} onClick={() => navigate("/login")}>
              🌾 &nbsp;Abhi Shuru Karo — Free
            </button>
            <button className="btn-secondary" style={{ fontSize:"0.95rem" }} onClick={() => navigate("/login")}>
              Sign In →
            </button>
          </div>
          <p style={{ marginTop:24, fontSize:"0.75rem", color:"#3a6a4a" }}>No credit card required · Completely free · Instant access</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-row" style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"36px 60px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(0,0,0,0.3)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:700 }}>
          <div style={{ width:32, height:32, background:"linear-gradient(135deg,#2d7a4f,#e8b84b)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>🌾</div>
          Agri<span style={{ color:"#e8b84b" }}>Smart</span>
        </div>
        <div style={{ display:"flex", gap:24 }}>
          {[["Features","#features"],["Dashboard","/dashboard"],["How it Works","#how-it-works"]].map(([name,href]) => (
            <a key={name} href={href} style={{ color:"#3a6a4a", textDecoration:"none", fontSize:"0.8rem", transition:"color 0.2s" }}
              onMouseEnter={e => e.target.style.color="#fff"} onMouseLeave={e => e.target.style.color="#3a6a4a"}>{name}</a>
          ))}
        </div>
        <div style={{ fontSize:"0.78rem", color:"#3a6a4a" }}>
          Built with ❤️ by <span style={{ color:"#e8b84b" }}>Danish Qureshi</span> · BCA Final Year 2026
        </div>
      </footer>
    </div>
  );
}