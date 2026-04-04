import { useEffect, useRef } from "react";
import logo from "../assets/logo.jpg.jpeg";
import heroImage from "../assets/hero-image.jpg";

export default function LandingPage() {
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 },
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#0d2818",
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Google Fonts */}
      {/* <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      /> */}

      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .feature-card { transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s; }
        .feature-card:hover { transform: translateY(-6px); border-color: rgba(232,184,75,0.4) !important; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(232,184,75,0.3); }
        .stat-card:hover { transform: translateX(-6px); border-color: rgba(232,184,75,0.4) !important; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        .hero-content { animation: fadeUp 0.9s ease both; }
        .pulse-dot { animation: pulse 2s infinite; }
        .step-num { transition: all 0.3s; }
        .step:hover .step-num { background: #e8b84b !important; color: #0d2818 !important; }
        
        /* Responsive Improvements */
        @media (max-width: 1024px) {
          .nav-container { padding: 15px 30px !important; }
          .hero-section { padding: 140px 40px 60px !important; flex-direction: column !important; align-items: flex-start !important; }
          .stat-cards-container { position: relative !important; right: auto !important; top: auto !important; transform: none !important; flex-direction: row !important; flex-wrap: wrap; justify-content: flex-start; margin-top: 40px; width: 100%; gap: 15px !important; }
          .stat-card { min-width: 160px !important; padding: 18px 20px !important; }
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bg-circles { display: none !important; }
        }
        @media (max-width: 768px) {
          .nav-container { padding: 15px 20px !important; }
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .hero-section { padding: 120px 20px 40px !important; }
          .hero-content h1 { font-size: 2.2rem !important; }
          .features-section, .how-it-works-section, .cta-section { padding: 60px 20px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-container { flex-direction: column !important; gap: 40px !important; }
          .step-line { display: none !important; }
          .footer-container { flex-direction: column !important; gap: 20px; text-align: center; padding: 30px 20px !important; }
        }
        @media (max-width: 480px) {
          .nav-container { padding: 12px 15px !important; }
          .hero-section { padding: 100px 15px 30px !important; }
          .hero-content h1 { font-size: 1.8rem !important; }
          .hero-content p { font-size: 0.9rem !important; }
          .features-section, .how-it-works-section, .cta-section { padding: 40px 15px !important; }
          .stat-card { min-width: 140px !important; padding: 15px !important; }
          .stat-card div:nth-child(2) { font-size: 1.4rem !important; }
          .feature-card { padding: 25px 20px !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav
        className="nav-container"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 60px",
          background: "rgba(13,40,24,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(232,184,75,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.4rem",
            fontWeight: 700,
          }}
        >
          <img
            src={logo}
            alt="AgriSmart Logo"
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              objectFit: "cover",
            }}
          />
          Agri<span style={{ color: "#e8b84b" }}>Smart</span>
        </div>
        <div className="nav-links" style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {[
              { name: "Features", href: "#features", mobileHide: true },
              { name: "Dashboard", href: "/dashboard" },
              { name: "How it Works", href: "#how-it-works", mobileHide: true }
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={item.mobileHide ? "hide-mobile" : ""}
                onClick={(e) => {
                  if (item.href.startsWith("#")) {
                    e.preventDefault();
                    document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                style={{
                  color: "#a8c4b0",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                {item.name}
              </a>
            ))}
            <a
              href="/login"
              style={{
                background: "#e8b84b",
                color: "#0d2818",
                padding: "10px 22px",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              Get Started
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => {
              const mobileMenu = document.querySelector('.mobile-menu');
              mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
            }}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            ☰
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div 
          className="mobile-menu"
          style={{
            display: 'none',
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(13,40,24,0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(232,184,75,0.15)',
            flexDirection: 'column',
            padding: '20px',
            gap: '15px'
          }}
        >
          {[
            { name: "Features", href: "#features" },
            { name: "Dashboard", href: "/dashboard" },
            { name: "How it Works", href: "#how-it-works" }
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                if (item.href.startsWith("#")) {
                  e.preventDefault();
                  document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
                  document.querySelector('.mobile-menu').style.display = 'none';
                }
              }}
              style={{
                color: "#a8c4b0",
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: 500,
                padding: "10px 0",
                borderBottom: "1px solid rgba(76,175,114,0.1)"
              }}
            >
              {item.name}
            </a>
          ))}
          <a
            href="/login"
            style={{
              background: "#e8b84b",
              color: "#0d2818",
              padding: "12px 20px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: "1rem",
              textDecoration: "none",
              textAlign: 'center',
              marginTop: '10px'
            }}
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="hero-section"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "100px 60px 60px",
          position: "relative",
          overflow: "hidden",
          backgroundImage: `linear-gradient(rgba(13,40,24,0.4), rgba(13,40,24,0.4)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* BG Circles */}
        <div
          className="bg-circles"
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "#2d7a4f",
            filter: "blur(80px)",
            opacity: 0.2,
            top: -100,
            right: -100,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          className="bg-circles"
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "#e8b84b",
            filter: "blur(80px)",
            opacity: 0.15,
            bottom: -50,
            left: 200,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Hero Content */}
        <div
          className="hero-content"
          style={{ maxWidth: 640, position: "relative", zIndex: 2 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(232,184,75,0.12)",
              border: "1px solid rgba(232,184,75,0.3)",
              color: "#f5d07a",
              padding: "7px 16px",
              borderRadius: 50,
              fontSize: "0.78rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            <span
              className="pulse-dot"
              style={{
                width: 7,
                height: 7,
                background: "#e8b84b",
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            🇮🇳 Kisan ke liye, AI ke saath
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
              lineHeight: 1.08,
              fontWeight: 900,
              marginBottom: 24,
              letterSpacing: "-0.02em",
            }}
          >
            Make farming
            <br />
            <span style={{ color: "#e8b84b" }}>Smart,</span> Safe
            <br />& Profitable.
          </h1>

          <p
            style={{
              fontSize: "1.05rem",
              color: "#a8c4b0",
              lineHeight: 1.75,
              maxWidth: 500,
              marginBottom: 44,
              fontWeight: 300,
            }}
          >
            AgriSmart is an AI-powered farming platform that helps farmers make
            better decisions through crop simulation, risk prediction and profit
            planning.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button
              className="btn-primary"
              style={{
                background: "#e8b84b",
                color: "#0d2818",
                padding: "15px 32px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: "0.95rem",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              🚀 Live Demo Dekho
            </button>
            <button
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: "transparent",
                color: "#fff",
                padding: "15px 32px",
                borderRadius: 10,
                fontWeight: 500,
                fontSize: "0.95rem",
                border: "1px solid rgba(255,255,255,0.2)",
                cursor: "pointer",
              }}
            >
              Features Explore Karo →
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div
          className="stat-cards-container"
          style={{
            position: "absolute",
            right: 60,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            zIndex: 2,
          }}
        >
          {[
            { icon: "🌱", num: "12+", label: "Crops Supported" },
            { icon: "📊", num: "7", label: "AI-Powered Features" },
            { icon: "⚡", num: "Real-Time", label: "Weather + Market Alerts" },
          ].map((s, i) => (
            <div
              key={i}
              className="stat-card"
              style={{
                background: "rgba(26,74,46,0.5)",
                border: "1px solid rgba(76,175,114,0.2)",
                borderRadius: 16,
                padding: "22px 28px",
                backdropFilter: "blur(20px)",
                minWidth: 190,
                transition: "all 0.3s",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>
                {s.icon}
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "#e8b84b",
                  lineHeight: 1,
                }}
              >
                {s.num}
              </div>
              <div
                style={{ fontSize: "0.78rem", color: "#a8c4b0", marginTop: 4 }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="reveal features-section"
        style={{
          padding: "100px 60px",
          background: "rgba(26,74,46,0.2)",
          borderTop: "1px solid rgba(76,175,114,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div
            style={{
              color: "#4caf72",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            ✦ Core Features
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            Sab Kuch Ek Platform Par
          </h2>
          <p
            style={{
              color: "#a8c4b0",
              fontSize: "1rem",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Har feature specifically farmers ki daily challenges ke liye design
            kiya gaya hai.
          </p>
        </div>

        <div
          className="features-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {[
            {
              icon: "🌿",
              title: "Farming Simulator",
              desc: "Crop, budget aur season enter karo. AI simulate karega aur profit ya loss pehle hi bata dega.",
              color: "rgba(45,122,79,0.3)",
              border: "rgba(45,122,79,0.5)",
            },
            {
              icon: "⚠️",
              title: "Risk Estimator",
              desc: "Weather patterns aur soil data ke basis par crop failure ka risk percentage milega.",
              color: "rgba(239,68,68,0.15)",
              border: "rgba(239,68,68,0.4)",
            },
            {
              icon: "🪱",
              title: "Soil Health Passport",
              desc: "Apni zameen ka digital health record rakho. AI se personalized soil improvement suggestions pao.",
              color: "rgba(139,94,60,0.25)",
              border: "rgba(139,94,60,0.5)",
            },
            {
              icon: "💰",
              title: "Profit Estimator",
              desc: "Multiple crops compare karo aur dekho kaunsa crop sabse zyada profitable hai.",
              color: "rgba(232,184,75,0.15)",
              border: "rgba(232,184,75,0.4)",
            },
            {
              icon: "📅",
              title: "Seasonal Planner",
              desc: "Month-by-month farming calendar — kya boona hai, kab pani dena hai, sab organized.",
              color: "rgba(20,184,166,0.15)",
              border: "rgba(20,184,166,0.4)",
            },
            {
              icon: "🔔",
              title: "Smart Alert System",
              desc: "Real-time weather warnings, disease alerts aur mandi price updates ek jagah.",
              color: "rgba(59,130,246,0.15)",
              border: "rgba(59,130,246,0.4)",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="feature-card"
              style={{
                background: "rgba(13,40,24,0.6)",
                border: "1px solid rgba(76,175,114,0.15)",
                borderRadius: 20,
                padding: "34px 28px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: f.color,
                  border: `1px solid ${f.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  marginBottom: 20,
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  marginBottom: 10,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  color: "#a8c4b0",
                  fontSize: "0.86rem",
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}
              >
                {f.desc}
              </p>
              <div
                style={{
                  marginTop: 16,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "#e8b84b",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                → Explore
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="reveal how-it-works-section"
        style={{ padding: "100px 60px", textAlign: "center" }}
      >
        <div
          style={{
            color: "#4caf72",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          ✦ How It Works
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 3vw, 2.8rem)",
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          3 Simple Steps
        </h2>
        <p style={{ color: "#a8c4b0", fontSize: "1rem", marginBottom: 60 }}>
          Start karo aur minutes me AI-powered farming insights pao.
        </p>

        <div
          className="steps-container"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 60,
            maxWidth: 900,
            margin: "0 auto",
            position: "relative",
          }}
        >
          <div
            className="step-line"
            style={{
              position: "absolute",
              top: 28,
              left: "15%",
              right: "15%",
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(232,184,75,0.4), transparent)",
            }}
          />
          {[
            {
              num: "1",
              title: "Profile Banao",
              desc: "Zameen ka area, location aur soil type enter karo.",
            },
            {
              num: "2",
              title: "Crop Simulate Karo",
              desc: "Crop choose karo, budget dalo — AI baaki calculate karega.",
            },
            {
              num: "3",
              title: "Smart Decision Lo",
              desc: "Profit estimate, risk report aur plan — sab data ke saath.",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="step"
              style={{ flex: 1, textAlign: "center" }}
            >
              <div
                className="step-num"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#1a4a2e",
                  border: "2px solid rgba(232,184,75,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#e8b84b",
                  margin: "0 auto 20px",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {s.num}
              </div>
              <h4
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {s.title}
              </h4>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "#a8c4b0",
                  lineHeight: 1.6,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="reveal cta-section"
        style={{
          padding: "100px 60px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(45,122,79,0.25), transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 20,
            position: "relative",
          }}
        >
          Teri Kheti,
          <br />
          <span style={{ color: "#e8b84b" }}>Tera Data, Tera Faisla.</span>
        </h2>
        <p
          style={{
            color: "#a8c4b0",
            fontSize: "1rem",
            maxWidth: 460,
            margin: "0 auto 44px",
            lineHeight: 1.7,
            position: "relative",
          }}
        >
          AgriSmart ke saath apni farming journey shuru karo — free hai, fast
          hai, aur teri bhasha me hai.
        </p>
        <button
          onClick={() => {
            window.location.href = '/login';
          }}
          className="btn-primary"
          style={{
            background: "#e8b84b",
            color: "#0d2818",
            padding: "18px 44px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s",
            position: "relative",
          }}
        >
          🌾 Abhi Shuru Karo — Free
        </button>
      </section>

      {/* FOOTER */}
      <footer
        className="footer-container"
        style={{
          borderTop: "1px solid rgba(76,175,114,0.12)",
          padding: "32px 60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.1rem",
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              background: "linear-gradient(135deg, #2d7a4f, #e8b84b)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            🌾
          </div>
          Agri<span style={{ color: "#e8b84b" }}>Smart</span>
        </div>
        <div style={{ fontSize: "0.8rem", color: "#a8c4b0" }}>
          Built with ❤️ by{" "}
          <span style={{ color: "#e8b84b" }}>Danish Qureshi</span> · BCA Final
          Year 2026
        </div>
      </footer>
    </div>
  );
}
