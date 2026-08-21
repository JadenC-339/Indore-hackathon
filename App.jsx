import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Analyze from './pages/Analyze';
import Results from './pages/Results';
import Insights from './pages/Insights';
import History from './pages/History';
import Communication from './pages/Communication';
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
      <BrowserRouter>
        <AIChatbot />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/app" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/app/analyze" replace />} />
            <Route path="analyze" element={<Analyze />} />
            <Route path="results" element={<Results />} />
            <Route path="insights" element={<Insights />} />
            <Route path="history" element={<History />} />
            <Route path="communication" element={<Communication />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
