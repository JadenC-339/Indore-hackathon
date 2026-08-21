import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import IoTTelemetry from './pages/IoTTelemetry';
import SatelliteMap from './pages/SatelliteMap';
import IrrigationScheduler from './pages/IrrigationScheduler';
import PestDetection from './pages/PestDetection';
import FertilizerOptimizer from './pages/FertilizerOptimizer';
import MarketForecasting from './pages/MarketForecasting';
import Results from './pages/Results';
import Insights from './pages/Insights';
import History from './pages/History';
import Communication from './pages/Communication';
import MoreFeatures from './pages/MoreFeatures';
import WeatherIntelligence from './pages/WeatherIntelligence';
import CropCalendar from './pages/CropCalendar';
import WaterFootprint from './pages/WaterFootprint';
import SustainabilityScore from './pages/SustainabilityScore';
import GovSchemes from './pages/GovSchemes';
import ExportReports from './pages/ExportReports';
import AIChatbot from './components/AIChatbot';

// Auth guard: redirects to /login if not logged in
const ProtectedRoute = ({ children }) => {
  const farmer = localStorage.getItem('soilai_farmer');
  if (!farmer) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <AIChatbot />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route path="/app" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analyze" element={<Analyze />} />
            <Route path="iot" element={<IoTTelemetry />} />
            <Route path="satellite" element={<SatelliteMap />} />
            <Route path="irrigation" element={<IrrigationScheduler />} />
            <Route path="pest-detection" element={<PestDetection />} />
            <Route path="fertilizer" element={<FertilizerOptimizer />} />
            <Route path="market" element={<MarketForecasting />} />
            <Route path="more" element={<MoreFeatures />} />
            <Route path="weather" element={<WeatherIntelligence />} />
            <Route path="crop-calendar" element={<CropCalendar />} />
            <Route path="water-footprint" element={<WaterFootprint />} />
            <Route path="sustainability" element={<SustainabilityScore />} />
            <Route path="gov-schemes" element={<GovSchemes />} />
            <Route path="export-reports" element={<ExportReports />} />
            <Route path="results" element={<Results />} />
            <Route path="insights" element={<Insights />} />
            <Route path="history" element={<History />} />
            <Route path="communication" element={<Communication />} />
          </Route>
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
}

export default App;
