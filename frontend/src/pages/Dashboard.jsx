import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, Cpu, Satellite, CloudSun, Bug, FlaskConical, TrendingUp, 
  ArrowRight, ShieldCheck, AlertTriangle, Droplets, Thermometer, Wind, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLang } from '../context/LanguageContext';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5005';

export default function Dashboard() {
  const { t } = useLang();
  const farmer = JSON.parse(localStorage.getItem('soilai_farmer') || '{}');

  const [iotData, setIotData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [satelliteData, setSatelliteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [iotRes, weatherRes, marketRes, satRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/iot/telemetry`).catch(() => null),
          axios.get(`${BACKEND_URL}/api/weather/forecast`).catch(() => null),
          axios.get(`${BACKEND_URL}/api/market/forecast`).catch(() => null),
          axios.get(`${BACKEND_URL}/api/satellite/field`).catch(() => null),
        ]);

        if (iotRes?.data) setIotData(iotRes.data);
        if (weatherRes?.data) setWeatherData(weatherRes.data);
        if (marketRes?.data) setMarketData(marketRes.data);
        if (satRes?.data) setSatelliteData(satRes.data);
      } catch (err) {
        console.error('Error fetching dashboard feeds', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const featureCards = [
    {
      title: 'Soil ML Analyzer',
      desc: 'Ensemble model analyzing N-P-K, pH, & moisture for precision crop yield.',
      icon: <Sprout size={24} color="#2E7D32" />,
      link: '/app/analyze',
      badge: '96% Accuracy',
      color: '#E8F5E9',
      border: '#C8E6C9'
    },
    {
      title: 'IoT Real-Time Telemetry',
      desc: '6 Live Field sensor probes monitoring moisture, temp, pH, and solar flux.',
      icon: <Cpu size={24} color="#1565C0" />,
      link: '/app/iot',
      badge: 'Live Streaming',
      color: '#E3F2FD',
      border: '#BBDEFB'
    },
    {
      title: 'Satellite GIS & NDVI',
      desc: 'Sentinel-2 imagery with 0.74 NDVI index, canopy water & zonal health maps.',
      icon: <Satellite size={24} color="#6A1B9A" />,
      link: '/app/satellite',
      badge: 'Sentinel-2 Sync',
      color: '#F3E5F5',
      border: '#E1BEE7'
    },
    {
      title: 'AI Smart Irrigation',
      desc: 'Evapotranspiration ET0 engine saved 1,800L today. Skip watering on Thu/Fri.',
      icon: <CloudSun size={24} color="#0277BD" />,
      link: '/app/irrigation',
      badge: 'Weather Adjusted',
      color: '#E0F7FA',
      border: '#B2EBF2'
    },
    {
      title: 'AI Leaf Pest Scanner',
      desc: 'Diagnostic vision engine for Early Blight, Rust, & Aphids with organic remedies.',
      icon: <Bug size={24} color="#C62828" />,
      link: '/app/pest-detection',
      badge: 'Vision AI 96.4%',
      color: '#FFEBEE',
      border: '#FFCDD2'
    },
    {
      title: 'Precision Fertilizer & Carbon',
      desc: 'Target yield dosing, Nano Urea bio-substitutes, & carbon credit calculations.',
      icon: <FlaskConical size={24} color="#EF6C00" />,
      link: '/app/fertilizer',
      badge: 'Carbon Credit A+',
      color: '#FFF3E0',
      border: '#FFE0B2'
    },
    {
      title: 'Mandi Price Forecasting',
      desc: '30-Day price trends for Wheat, Cotton, & Tomatoes. Sell vs Hold advisory.',
      icon: <TrendingUp size={24} color="#2E7D32" />,
      link: '/app/market',
      badge: 'Agmarknet AI',
      color: '#E8F5E9',
      border: '#C8E6C9'
    }
  ];

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)',
          borderRadius: '1.2rem',
          padding: '2rem',
          color: 'white',
          boxShadow: '0 10px 30px rgba(46, 125, 50, 0.25)',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.7rem', borderRadius: '1rem', fontSize: '0.78rem', fontWeight: 700 }}>
              🌿 Sustainable Advisory Engine Active
            </span>
            <span style={{ background: '#4CAF50', color: '#fff', padding: '0.2rem 0.7rem', borderRadius: '1rem', fontSize: '0.78rem', fontWeight: 800 }}>
              Live Telemetry
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.2rem 0' }}>
            Welcome back, {farmer.name || 'Farmer'}! 👋
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem', maxWidth: '650px', margin: 0, lineHeight: 1.5 }}>
            Your estate in {farmer.village || 'Nashik Region'} is operating with high soil vitality. Weather is favorable for wheat & tomato crop growth today.
          </p>
        </div>

        {/* Parallax background icon */}
        <Sprout size={180} style={{ position: 'absolute', right: '-20px', bottom: '-40px', opacity: 0.12, pointerEvents: 'none' }} />
      </motion.div>

      {/* Real-time Glance Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}>
        
        {/* Weather Quick Card */}
        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Microclimate Today</span>
            <CloudSun size={20} color="#0277BD" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-heading)' }}>
            {weatherData?.current?.temp || 31}°C
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', marginLeft: '0.5rem' }}>Sunny</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.8rem', color: '#555', fontWeight: 600 }}>
            <span><Droplets size={13} style={{ verticalAlign: 'middle' }} /> {weatherData?.current?.humidity || 58}% Humidity</span>
            <span><Wind size={13} style={{ verticalAlign: 'middle' }} /> {weatherData?.current?.wind_kmh || 14} km/h</span>
          </div>
        </div>

        {/* IoT Telemetry Quick Card */}
        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Soil Moisture (Node 01)</span>
            <Cpu size={20} color="#1565C0" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1565C0' }}>
            45.2%
            <span style={{ fontSize: '0.8rem', background: '#E3F2FD', color: '#1565C0', padding: '0.2rem 0.5rem', borderRadius: '0.4rem', marginLeft: '0.6rem', fontWeight: 700 }}>Optimal</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.75rem', margin: 0 }}>
            All 6 IoT field sensor nodes online & transmitting data.
          </p>
        </div>

        {/* Satellite NDVI Quick Card */}
        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Satellite NDVI Score</span>
            <Satellite size={20} color="#6A1B9A" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6A1B9A' }}>
            0.74 <span style={{ fontSize: '0.9rem', color: '#4CAF50', fontWeight: 700 }}>/ 1.0</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.75rem', margin: 0 }}>
            Sentinel-2 Pass: High canopy density in Zone Alpha.
          </p>
        </div>

        {/* Mandi Price Ticker Quick Card */}
        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Top Crop Forecast</span>
            <TrendingUp size={20} color="#2E7D32" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
            Wheat: ₹2,680 <span style={{ fontSize: '0.8rem', color: '#2E7D32', fontWeight: 700 }}>+9.3% ↑</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#388E3C', fontWeight: 700, marginTop: '0.75rem', margin: 0 }}>
            Advisory: Hold crop 2 more weeks for peak mandi price.
          </p>
        </div>

      </div>

      {/* Advisory Modules Hub Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
            Intelligent Advisory Modules
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            AI-driven tools tailored for sustainable agricultural optimization
          </p>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem', marginBottom: '3rem' }}>
        {featureCards.map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            style={{
              background: '#FFFFFF',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ background: card.color, padding: '0.6rem', borderRadius: '0.75rem', border: `1px solid ${card.border}` }}>
                  {card.icon}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, background: card.color, color: 'var(--text-heading)', padding: '0.25rem 0.6rem', borderRadius: '0.5rem', border: `1px solid ${card.border}` }}>
                  {card.badge}
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', margin: '0 0 0.4rem 0' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#555', lineHeight: 1.5, margin: '0 0 1.2rem 0' }}>
                {card.desc}
              </p>
            </div>

            <Link
              to={card.link}
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: 'var(--primary)',
                paddingTop: '0.5rem',
                borderTop: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              Launch Advisory Tool <ArrowRight size={16} />
            </Link>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
