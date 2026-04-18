# 🌾 AgriSmart
### India's Most Complete AI-Powered Farming Web Application

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Vercel-brightgreen?style=for-the-badge)](https://agri-smart-ai-xi.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Daniish--Qureshi-black?style=for-the-badge&logo=github)](https://github.com/Daniish-Qureshi/AgriSmart-AI)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

> **"Teri Kheti, Tera Data, Tera Faisla."**
>
> AgriSmart empowers Indian farmers with AI-driven tools — crop simulation, disease detection, equipment rental, government schemes, live weather, and a digital wallet — all in one free platform.

---

## 🌐 Live Links

| Service | URL |
|---|---|
| 🌐 **Frontend** | [AgriSmart-AI](https://agri-smart-ai-xi.vercel.app) | [Daniish-Qureshi/AgriSmart-AI](https://github.com/Daniish-Qureshi/AgriSmart-AI) |

---

## ✨ Features — Version 2.0

### 🌿 Core Farming Tools (v1.0)
| Feature | Description |
|---|---|
| 📊 **Dashboard** | Real-time stats from PostgreSQL — simulations, soil records, profits |
| 🌿 **Farming Simulator** | Enter crop + acres + season + budget → AI predicts profit/loss + ROI |
| ⚠️ **Risk Estimator** | Analyze crop failure risk (0–100%) based on weather, soil, and season |
| 🪱 **Soil Health Passport** | Record pH, N, P, K → AI health score + improvement suggestions |
| 💰 **Profit Estimator** | Compare all crops by profit and ROI — find the best option |
| 📅 **Seasonal Planner** | Month-by-month farming calendar for Rabi, Kharif, and Zaid |
| 🔔 **Alert System** | Weather warnings, disease alerts, mandi price notifications |
| 🤖 **AgriBot Chatbot** | 24/7 AI farming assistant in Hindi/Hinglish (Groq Llama 3.3 70B) |
| 👤 **Profile Management** | Personal info, farm details, profile photo, password |

### 🚀 New Features (v2.0)
| Feature | Description |
|---|---|
| 🌦️ **Live Weather API** | OpenWeatherMap — current weather, 5-day forecast, farming advisory |
| 🦠 **Disease Scan (AI)** | Upload crop photo → Gemini Vision AI detects disease + treatment |
| 🏛️ **Government Schemes** | PM-KISAN, PMFBY, KCC, Soil Health Card, PKVY with eligibility |
| 🛠️ **Equipment Rental** | List/browse/rent farm equipment with real-time request notifications |
| 🗓️ **Crop Calendar** | Detailed month-wise farming task guide for all major crops |
| 👥 **Community Forum** | Farmer-to-farmer Q&A — stored in PostgreSQL |
| 👛 **Farmer Wallet** | Razorpay payment gateway — UPI/Card/NetBanking + transaction history |

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
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square)

### AI & APIs
![Groq](https://img.shields.io/badge/Groq_AI-Llama_3.3_70B-FF6B35?style=flat-square)
![Gemini](https://img.shields.io/badge/Gemini-Vision_API-4285F4?style=flat-square&logo=google)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-Live_Weather-EB6E4B?style=flat-square)
![Razorpay](https://img.shields.io/badge/Razorpay-Payment-02042B?style=flat-square)

### Deployment
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=flat-square&logo=vercel)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat-square&logo=render)
![Neon](https://img.shields.io/badge/Neon.tech-Database-00E5A0?style=flat-square)

---

## 📁 Project Structure

```
AgriSmart-AI/
│
├── client/                          # React Frontend (Vercel)
│   ├── src/
│   │   ├── assets/                  # Images, logo
│   │   ├── components/
│   │   │   ├── AgriBot.jsx          # AI chatbot (Groq)
│   │   │   └── Sidebar.jsx          # Navigation sidebar
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FarmingSimulator.jsx
│   │   │   ├── RiskEstimator.jsx
│   │   │   ├── SoilPassport.jsx
│   │   │   ├── ProfitEstimator.jsx
│   │   │   ├── SeasonalPlanner.jsx
│   │   │   ├── AlertsPage.jsx       # + Live Weather
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── GovtSchemes.jsx      # NEW v2.0
│   │   │   ├── DiseaseScan.jsx      # NEW v2.0
│   │   │   ├── EquipmentRental.jsx  # NEW v2.0
│   │   │   ├── CropCalendar.jsx     # NEW v2.0
│   │   │   ├── CommunityForum.jsx   # NEW v2.0
│   │   │   └── WalletPage.jsx       # NEW v2.0
│   │   ├── config.js
│   │   └── App.jsx
│   ├── vercel.json
│   └── package.json
│
├── backend/                         # Node.js Backend (Render)
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── ai.js                    # Groq + Gemini
│   │   ├── data.js
│   │   ├── rental.js                # NEW v2.0
│   │   ├── forum.js                 # NEW v2.0
│   │   └── wallet.js                # NEW v2.0 + Razorpay
│   ├── server.js
│   └── package.json
│
└── .gitignore
```

---

## 🗄️ Database Schema (PostgreSQL — 8 Tables)

```sql
-- v1.0 Tables
CREATE TABLE users (id, name, email, password, location, created_at);
CREATE TABLE simulations (id, user_id, crop_name, budget, season, acres, estimated_profit, risk_percent);
CREATE TABLE soil_records (id, user_id, ph_level, nitrogen, phosphorus, potassium, suggestion);

-- v2.0 Tables
CREATE TABLE equipment_listings (id, owner_id, title, category, price_per_day, location, available);
CREATE TABLE rental_requests (id, user_id, listing_id, start_date, end_date, message, status);
CREATE TABLE forum_posts (id, user_id, question, body, created_at);
CREATE TABLE wallets (id, user_id, balance, updated_at);
CREATE TABLE wallet_transactions (id, user_id, type, amount, description, payment_id, status);
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login + get JWT token |
| GET | `/api/auth/me` | Get current user |

### AI Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/chat` | AgriBot (Groq Llama 3.3 70B) |
| POST | `/api/ai/simulate-advice` | Farming advice after simulation |
| POST | `/api/ai/soil-suggest` | Soil improvement suggestions |
| POST | `/api/ai/disease-scan` | Gemini Vision disease detection |

### Data
| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/data/simulation` | Simulation save/fetch |
| GET/POST | `/api/data/soil` | Soil record save/fetch |

### Equipment Rental
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/rental/listings` | All equipment listings |
| POST | `/api/rental/listings` | Create new listing |
| GET | `/api/rental/my-requests` | Owner's incoming requests |
| POST | `/api/rental/requests` | Send rental request |
| PATCH | `/api/rental/requests/:id` | Accept / Reject |

### Farmer Wallet
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/wallet` | Get wallet balance |
| GET | `/api/wallet/transactions` | Transaction history |
| POST | `/api/wallet/create-order` | Create Razorpay order |
| POST | `/api/wallet/verify-payment` | Verify + credit wallet |
| POST | `/api/wallet/withdraw` | Withdraw money |
| POST | `/api/wallet/debit` | Debit for rental payment |
| POST | `/api/wallet/welcome-bonus` | ₹500 one-time bonus |

### Community Forum
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/forum/posts` | All forum questions |
| POST | `/api/forum/posts` | Post new question |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v22+
- Git
- [Neon.tech](https://neon.tech) PostgreSQL account
- [Groq AI](https://console.groq.com) API key
- [Google AI Studio](https://aistudio.google.com) Gemini API key
- [OpenWeatherMap](https://openweathermap.org/api) API key
- [Razorpay](https://razorpay.com) Test API keys

### 1. Clone
```bash
git clone https://github.com/Daniish-Qureshi/AgriSmart-AI.git
cd AgriSmart-AI
```

### 2. Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
DATABASE_URL=your_neon_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=gsk_your_groq_key
GEMINI_API_KEY=AIza_your_gemini_key
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend
```bash
cd ../client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
# App runs on http://localhost:5173
```

---

## 🧪 Razorpay Test Credentials

```
Card Number  :  4111 1111 1111 1111
Expiry       :  Any future date
CVV          :  Any 3 digits
OTP          :  1234

UPI Success  :  success@razorpay
UPI Failure  :  failure@razorpay
```

---

## 🔒 Security Features

- ✅ JWT authentication on all protected routes
- ✅ bcryptjs password hashing (10 salt rounds)
- ✅ CORS configured for Vercel domain only
- ✅ `.env` excluded from Git (all keys safe)
- ✅ Razorpay HMAC-SHA256 signature verification
- ✅ Input validation on all forms

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ by Danish Qureshi | BCA Final Year 2026**

[🌐 Live Demo](https://agri-smart-ai-xi.vercel.app) &nbsp;·&nbsp; [🐛 Report Bug](https://github.com/Daniish-Qureshi/AgriSmart-AI/issues) &nbsp;·&nbsp; [⭐ Star this repo](https://github.com/Daniish-Qureshi/AgriSmart-AI)

</div>

