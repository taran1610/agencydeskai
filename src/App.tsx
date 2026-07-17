import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Analytics } from './components/Analytics'
import { LandingPage } from './pages/LandingPage'
import { PricingPage } from './pages/PricingPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'

const App = () => (
  <BrowserRouter>
    <Analytics />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Routes>
  </BrowserRouter>
)

export default App
