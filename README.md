# 🌾 AgriSmart (KisanAI)
### A Smart AI-Powered Farming Web Application

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen?style=for-the-badge&logo=vercel)](https://agri-smart-ai-xi.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

> **"Teri Kheti, Tera Data, Tera Faisla."**
> AgriSmart empowers Indian farmers with AI-driven crop simulation, risk prediction, soil health tracking, and real-time alerts — all in one platform.

---

## 🚀 Live Demo

🌐 **Frontend:** [agri-smart-ai-xi.vercel.app](https://agri-smart-ai-xi.vercel.app)

---

## 📸 Screenshots

| Landing Page | Dashboard |
|---|---|
| ![Landing](https://via.placeholder.com/400x220/0d2818/e8b84b?text=Landing+Page) | ![Dashboard](https://via.placeholder.com/400x220/0d2818/e8b84b?text=Dashboard) |

| Farming Simulator | AgriBot Chatbot |
|---|---|
| ![Simulator](https://via.placeholder.com/400x220/0d2818/e8b84b?text=Farming+Simulator) | ![AgriBot](https://via.placeholder.com/400x220/0d2818/e8b84b?text=AgriBot) |

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌿 **Farming Simulator** | Enter crop, acres, season & budget → AI predicts profit/loss + ROI |
| ⚠️ **Risk Estimator** | Analyze crop failure risk % based on weather, season & soil type |
| 🪱 **Soil Health Passport** | Record pH, N, P, K → AI health score + improvement suggestions |
| 💰 **Profit Estimator** | Compare all crops side-by-side → find most profitable option |
| 📅 **Seasonal Planner** | Month-by-month farming calendar for Rabi, Kharif & Zaid |
| 🔔 **Alert System** | Real-time weather warnings, disease alerts & market price updates |
| 📊 **Dashboard** | Central hub with live stats from PostgreSQL database |
| 🤖 **AgriBot Chatbot** | AI chatbot powered by Groq (Llama 3.3 70B) in Hindi/Hinglish |
| 👤 **Profile Management** | Update personal info, farm details & profile photo |

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=flat-square&logo=react-router)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-316192?style=flat-square&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=json-web-tokens)

### AI & Deployment
![Groq](https://img.shields.io/badge/Groq_AI-Llama_3.3_70B-FF6B35?style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=flat-square&logo=vercel)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat-square&logo=render)
![Neon](https://img.shields.io/badge/Neon.tech-Database-00E5A0?style=flat-square)

---

## 📁 Project Structure

```
AgriSmart-AI/
├── client/                  # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # AgriBot, Sidebar
│   │   ├── pages/           # All page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FarmingSimulator.jsx
│   │   │   ├── RiskEstimator.jsx
│   │   │   ├── SoilPassport.jsx
│   │   │   ├── ProfitEstimator.jsx
│   │   │   ├── SeasonalPlanner.jsx
│   │   │   ├── AlertsPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── config.js        # API URL config
│   │   └── App.jsx
│   └── package.json
│
├── backend/                 # Node.js Backend
│   ├── config/
│   │   └── db.js            # PostgreSQL connection
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   ├── routes/
│   │   ├── auth.js          # Auth routes
│   │   ├── ai.js            # Groq AI routes
│   │   └── data.js          # Simulation & soil routes
│   ├── server.js
│   └── package.json
│
└── .gitignore
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v22+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Daniish-Qureshi/AgriSmart-AI.git
cd AgriSmart-AI
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```env
PORT=5000
DATABASE_URL=your_neon_postgresql_url
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

Create `.env` file in `client/`:
```env
VITE_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🗄️ Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  location VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Simulations Table
CREATE TABLE simulations (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  crop_name VARCHAR(100),
  budget DECIMAL,
  season VARCHAR(50),
  acres DECIMAL,
  estimated_profit DECIMAL,
  risk_percent INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Soil Records Table
CREATE TABLE soil_records (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  ph_level DECIMAL,
  nitrogen VARCHAR(20),
  phosphorus VARCHAR(20),
  potassium VARCHAR(20),
  location VARCHAR(100),
  suggestion TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### AI Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/chat` | AgriBot chatbot (Groq AI) |
| POST | `/api/ai/simulate-advice` | Farming simulator AI advice |
| POST | `/api/ai/soil-suggest` | Soil improvement suggestions |

### Data Routes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/data/simulation` | Get user simulations |
| POST | `/api/data/simulation` | Save simulation result |
| GET | `/api/data/soil` | Get soil records |
| POST | `/api/data/soil` | Save soil record |

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>Built with ❤️ by <strong>Danish Qureshi</strong> | BCA Final Year 2026</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
