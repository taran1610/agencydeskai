import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Analytics } from './components/Analytics'
import { LandingPage } from './pages/LandingPage'
import { PricingPage } from './pages/PricingPage'
import { PrivacyPage } from './pages/PrivacyPage'

const App = () => (
  <BrowserRouter>
    <Analytics />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
    </Routes>
  </BrowserRouter>
)

export default App
