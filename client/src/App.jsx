import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import FarmingSimulator from './pages/FarmingSimulator'
import SoilPassport from './pages/SoilPassport'
import ProfitEstimator from './pages/ProfitEstimator'
import SeasonalPlanner from './pages/SeasonalPlanner'
import AlertsPage from './pages/AlertsPage'
import RiskEstimator from './pages/RiskEstimator'
import AgriBot from './components/AgriBot'
import ProfilePage from './pages/ProfilePage'


function App() {
  return (
    <BrowserRouter>
    <AgriBot />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/simulator" element={<FarmingSimulator />} />
        <Route path="/soil" element={<SoilPassport />} />
        <Route path="/profit" element={<ProfitEstimator />} />
        <Route path="/planner" element={<SeasonalPlanner />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/risk" element={<RiskEstimator />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App