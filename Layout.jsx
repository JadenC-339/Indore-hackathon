import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Sprout, Activity, History, LineChart, MessageCircle, LogOut, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import '../index.css';

const langOptions = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLang();

  const links = [
    { name: t.nav_analyze, path: '/app/analyze', emoji: '🔬' },
    { name: t.nav_results, path: '/app/results', emoji: '🌱' },
    { name: t.nav_insights, path: '/app/insights', emoji: '📊' },
    { name: t.nav_history, path: '/app/history', emoji: '📋' },
    { name: t.nav_sms, path: '/app/communication', emoji: '💬' },
  ];

  const farmer = JSON.parse(localStorage.getItem('soilai_farmer') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('soilai_farmer');
    navigate('/login', { replace: true });
  };

  return (
    <nav style={{
      background: '#FFFFFF',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      padding: '0.6rem 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'var(--primary)',
            padding: '0.45rem',
            borderRadius: '0.5rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sprout size={22} />
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)' }}>
            Krishi<span style={{ color: 'var(--primary)' }}>Mitra</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path} style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '0.6rem',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(76,175,80,0.08)' : 'transparent',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}>
                  <span style={{ fontSize: '1rem' }}>{link.emoji}</span>
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Always Visible Actions (Language & Logout) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Language Selector */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              background: 'rgba(46,125,50,0.06)',
              borderRadius: '0.5rem',
              padding: '0.35rem 0.5rem',
              border: '1px solid rgba(46,125,50,0.12)',
            }}>
              <Globe size={15} color="var(--primary)" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {langOptions.map(l => (
                  <option key={l.code} value={l.code} style={{ color: '#333' }}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Logout */}
            <button
              id="logout-btn"
              onClick={handleLogout}
              title="Logout"
              style={{
                background: '#FFF5F5',
                border: '1px solid #FECACA',
                borderRadius: '0.5rem',
                padding: '0.4rem',
                color: '#DC2626',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Layout = () => {
  const location = useLocation();
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-color)' }}>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="page-container"
          style={{ flexGrow: 1 }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        {[
          { name: 'Analyze', path: '/app/analyze', icon: <Sprout size={20} /> },
          { name: 'Results', path: '/app/results', icon: <Activity size={20} /> },
          { name: 'Insights', path: '/app/insights', icon: <LineChart size={20} /> },
          { name: 'History', path: '/app/history', icon: <History size={20} /> },
          { name: 'SMS', path: '/app/communication', icon: <MessageCircle size={20} /> },
        ].map(link => {
          const isActive = location.pathname === link.path;
          return (
            <Link key={link.path} to={link.path} className={`mobile-nav-link ${isActive ? 'active' : ''}`}>
              <div className="mobile-nav-icon">{link.icon}</div>
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Layout;
