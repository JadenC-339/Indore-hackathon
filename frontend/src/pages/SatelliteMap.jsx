import React, { useEffect, useState } from 'react';
import { Satellite, Layers, MapPin, CheckCircle, AlertCircle, Info, RefreshCw, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5005';

export default function SatelliteMap() {
  const [satData, setSatData] = useState(null);
  const [activeLayer, setActiveLayer] = useState('ndvi');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSatellite() {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/satellite/field`);
        if (res.data?.success) {
          setSatData(res.data);
        }
      } catch (err) {
        console.error('Error fetching satellite GIS data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSatellite();
  }, []);

  const layers = [
    { key: 'ndvi', label: 'NDVI Vegetation Index', color: '#2E7D32' },
    { key: 'moisture', label: 'Canopy Water Content', color: '#0277BD' },
    { key: 'chlorophyll', label: 'Chlorophyll Density', color: '#558B2F' },
    { key: 'thermal', label: 'Surface Thermal Stress', color: '#D84315' }
  ];

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ background: '#F3E5F5', padding: '0.5rem', borderRadius: '0.6rem' }}>
            <Satellite size={26} color="#6A1B9A" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
              Satellite GIS & NDVI Analytics
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
              Sentinel-2 multispectral satellite crop health & zonal moisture mapping
            </p>
          </div>
        </div>

        <div style={{ background: '#F3E5F5', color: '#6A1B9A', padding: '0.4rem 0.8rem', borderRadius: '0.6rem', fontWeight: 700, fontSize: '0.82rem', border: '1px solid #E1BEE7' }}>
          Pass: Sentinel-2B (Cloud Cover: 1.2%)
        </div>
      </div>

      {/* Main Grid: GIS Viewer + Metrics Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* GIS Canvas Container */}
        <div style={{ background: '#111827', borderRadius: '1rem', padding: '1.5rem', color: '#FFF', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', position: 'relative', overflow: 'hidden' }}>
          
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', zIndex: 10, position: 'relative' }}>
            <div style={{ display: 'flex', items: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 700 }}>
              <Layers size={18} color="#A78BFA" /> Satellite Layer:
            </div>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {layers.map(l => (
                <button
                  key={l.key}
                  onClick={() => setActiveLayer(l.key)}
                  style={{
                    background: activeLayer === l.key ? '#8B5CF6' : 'rgba(255,255,255,0.1)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '0.4rem',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {l.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Satellite Interactive Field Visualizer */}
          <div style={{ 
            height: '320px', 
            borderRadius: '0.75rem', 
            background: activeLayer === 'ndvi' 
              ? 'radial-gradient(circle at 60% 40%, #22c55e 0%, #16a34a 35%, #eab308 70%, #ef4444 100%)' 
              : activeLayer === 'moisture'
              ? 'radial-gradient(circle at 40% 50%, #0284c7 0%, #0369a1 40%, #0284c7 75%, #e0f2fe 100%)'
              : 'radial-gradient(circle at 50% 50%, #84cc16 0%, #65a30d 50%, #ca8a04 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)',
            border: '2px solid rgba(255,255,255,0.15)'
          }}>
            
            {/* Field Parcel SVG Overlay */}
            <svg width="90%" height="80%" viewBox="0 0 400 240" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))' }}>
              {/* Zone Alpha */}
              <path d="M 30 40 L 220 30 L 250 140 L 40 160 Z" fill="rgba(34, 197, 94, 0.45)" stroke="#16a34a" strokeWidth="2" />
              <text x="100" y="90" fill="#FFF" fontSize="12" fontWeight="bold">Zone Alpha (NDVI: 0.82)</text>
              
              {/* Zone Beta */}
              <path d="M 220 30 L 370 50 L 350 170 L 250 140 Z" fill="rgba(234, 179, 8, 0.45)" stroke="#ca8a04" strokeWidth="2" />
              <text x="260" y="100" fill="#FFF" fontSize="12" fontWeight="bold">Zone Beta (NDVI: 0.71)</text>
              
              {/* Zone Gamma */}
              <path d="M 40 160 L 250 140 L 350 170 L 320 220 L 60 210 Z" fill="rgba(239, 68, 68, 0.45)" stroke="#dc2626" strokeWidth="2" />
              <text x="140" y="185" fill="#FFF" fontSize="12" fontWeight="bold">Zone Gamma (NDVI: 0.58)</text>
            </svg>

            <div style={{ position: 'absolute', bottom: '10px', left: '12px', background: 'rgba(0,0,0,0.7)', padding: '0.3rem 0.7rem', borderRadius: '0.4rem', fontSize: '0.75rem', fontWeight: 700 }}>
              🌐 GPS Bounds: 19.9975° N, 73.7898° E (14.5 Hectares)
            </div>
          </div>

          {/* Color Scale Legend */}
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.85 }}>
            <span>Low Vigor (0.0)</span>
            <div style={{ flexGrow: 1, margin: '0 1rem', height: '8px', borderRadius: '4px', background: 'linear-gradient(to right, #ef4444, #eab308, #22c55e, #15803d)' }}></div>
            <span>High Density (1.0)</span>
          </div>

        </div>

        {/* Satellite Key Metrics */}
        <div style={{ background: '#FFFFFF', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', margin: '0 0 1.2rem 0' }}>
            Multispectral Spectral Index
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#F3E5F5', padding: '1rem', borderRadius: '0.8rem', border: '1px solid #E1BEE7' }}>
              <span style={{ fontSize: '0.78rem', color: '#6A1B9A', fontWeight: 700 }}>Mean NDVI Score</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6A1B9A', marginTop: '0.2rem' }}>
                {satData?.metrics?.ndvi_mean || 0.74}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#4CAF50', fontWeight: 700 }}>High Canopy Vigor</span>
            </div>

            <div style={{ background: '#E0F7FA', padding: '1rem', borderRadius: '0.8rem', border: '1px solid #B2EBF2' }}>
              <span style={{ fontSize: '0.78rem', color: '#0277BD', fontWeight: 700 }}>Canopy Water Index</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0277BD', marginTop: '0.2rem' }}>
                {satData?.metrics?.canopy_moisture_index || 0.68}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#0277BD', fontWeight: 700 }}>Optimal Moisture</span>
            </div>
          </div>

          {/* Additional Satellite Parameters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: '#444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #F0F0F0' }}>
              <span>Chlorophyll Index (NDRE):</span>
              <strong style={{ color: '#2E7D32' }}>{satData?.metrics?.chlorophyll_index || 0.81}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #F0F0F0' }}>
              <span>Surface Temperature:</span>
              <strong>{satData?.metrics?.surface_temperature_c || 28.4}°C</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span>Drought Vulnerability Score:</span>
              <strong style={{ color: '#2E7D32' }}>{satData?.metrics?.drought_vulnerability_score || 'Low (12/100)'}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Field Zonal Breakdown Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', margin: '0 0 1rem 0' }}>
          Zonal Precision Management
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Zone Name</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Area Share</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>NDVI Index</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Vegetation Status</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>AI Action Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {satData?.zones.map((zone, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{zone.name}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>{zone.area_pct}% of field</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: zone.ndvi > 0.75 ? '#2E7D32' : zone.ndvi > 0.65 ? '#E65100' : '#C62828' }}>
                    {zone.ndvi}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      background: zone.status === 'Healthy' ? '#E8F5E9' : zone.status === 'Moderate' ? '#FFF3E0' : '#FFEBEE',
                      color: zone.status === 'Healthy' ? '#2E7D32' : zone.status === 'Moderate' ? '#E65100' : '#C62828',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '0.4rem',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}>
                      {zone.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#444' }}>{zone.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
