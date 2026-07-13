import { BrowserRouter, Route, Routes } from 'react-router-dom'

import AppHeader from './components/AppHeader'
import AppFooter from './components/AppFooter'
import { AnalysisProvider } from './context/AnalysisContext'
import HomePage from './pages/HomePage'
import ClassificationPage from './pages/ClassificationPage'
import ResultPage from './pages/ResultPage'
import ModelInfoPage from './pages/ModelInfoPage'

export default function App() {
  return (
    <AnalysisProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-background">
          <AppHeader />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/klasifikasi" element={<ClassificationPage />} />
              <Route path="/hasil" element={<ResultPage />} />
              <Route path="/tentang-model" element={<ModelInfoPage />} />
            </Routes>
          </main>
          <AppFooter />
        </div>
      </BrowserRouter>
    </AnalysisProvider>
  )
}
