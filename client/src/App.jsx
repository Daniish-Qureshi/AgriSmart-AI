import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import FarmingSimulator from './pages/FarmingSimulator'
import DiseaseDetection from './pages/DiseaseDetection'
import SoilPassport from './pages/SoilPassport'
import ProfitEstimator from './pages/ProfitEstimator'
import SeasonalPlanner from './pages/SeasonalPlanner'
import AlertsPage from './pages/AlertsPage'
import RiskEstimator from './pages/RiskEstimator'
import GovtSchemes from './pages/GovtSchemes'
import EquipmentRental from './pages/EquipmentRental'
import CropCalendar from './pages/CropCalendar'
import CommunityForum from './pages/CommunityForum'
import AgriBot from './components/AgriBot'
import ProfilePage from './pages/ProfilePage'
import WalletPage from './pages/WalletPage'


function App() {
  return (
    <BrowserRouter>
    <AgriBot />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/simulator" element={<FarmingSimulator />} />
        <Route path="/schemes" element={<GovtSchemes />} />
        <Route path="/rental" element={<EquipmentRental />} />
        <Route path="/crop-calendar" element={<CropCalendar />} />
        <Route path="/forum" element={<CommunityForum />} />
        <Route path="/disease" element={<DiseaseDetection />} />
        <Route path="/soil" element={<SoilPassport />} />
        <Route path="/profit" element={<ProfitEstimator />} />
        <Route path="/planner" element={<SeasonalPlanner />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/risk" element={<RiskEstimator />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wallet" element={<WalletPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App