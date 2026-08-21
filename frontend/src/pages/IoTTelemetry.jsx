import React, { useEffect, useState } from 'react';
import { Cpu, Activity, RefreshCw, AlertTriangle, ShieldCheck, BatteryCharging, Signal, Droplets, Sun, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5005';

export default function IoTTelemetry() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyChart, setHistoryChart] = useState([]);
  const [liveStream, setLiveStream] = useState(true);

  const fetchTelemetry = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/iot/telemetry`);
      if (res.data?.success) {
        setData(res.data);
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        // Find soil moisture node
        const moistureVal = res.data.sensors.find(s => s.type.includes('Moisture'))?.value || 45;
        const tempVal = res.data.sensors.find(s => s.type.includes('Temp'))?.value || 29;

        setHistoryChart(prev => {
          const updated = [...prev, { time: timeStr, moisture: moistureVal, temp: tempVal }];
          return updated.slice(-10); // Keep last 10 points
        });
      }
    } catch (err) {
      console.error('Error fetching IoT telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(() => {
      if (liveStream) {
        fetchTelemetry();
      }
    }, 4000); // 4 sec stream interval

    return () => clearInterval(interval);
  }, [liveStream]);

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Page Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: '#E3F2FD', padding: '0.5rem', borderRadius: '0.6rem' }}>
              <Cpu size={26} color="#1565C0" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                Real-Time IoT Sensor Telemetry
              </h1>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                Continuous field sensor stream via LoRaWAN & NB-IoT gateways
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button
            onClick={() => setLiveStream(!liveStream)}
            style={{
              background: liveStream ? '#E8F5E9' : '#FFF3E0',
              color: liveStream ? '#2E7D32' : '#E65100',
              border: `1px solid ${liveStream ? '#A5D6A7' : '#FFE0B2'}`,
              borderRadius: '0.6rem',
              padding: '0.5rem 1rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Activity size={16} className={liveStream ? 'animate-pulse' : ''} />
            {liveStream ? 'Live Telemetry Active' : 'Stream Paused'}
          </button>

          <button
            onClick={fetchTelemetry}
            style={{
              background: '#FFFFFF',
              border: '1px solid #CCC',
              borderRadius: '0.6rem',
              padding: '0.5rem 0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <RefreshCw size={15} /> Sync
          </button>
        </div>
      </div>

      {/* Sensor Node Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
        {data?.sensors.map((sensor) => (
          <motion.div
            key={sensor.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: '#FFFFFF',
              borderRadius: '1rem',
              padding: '1.25rem',
              border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1565C0', background: '#E3F2FD', padding: '0.2rem 0.5rem', borderRadius: '0.4rem' }}>
                  {sensor.id}
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)', margin: '0.4rem 0 0.2rem 0' }}>
                  {sensor.type}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#666' }}>📍 {sensor.location}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 700, color: '#444' }}>
                <BatteryCharging size={16} color="#2E7D32" /> {sensor.battery}%
              </div>
            </div>

            {/* Display Sensor Value */}
            <div style={{ margin: '1rem 0 0.5rem 0', display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              {sensor.value !== undefined ? (
                <>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                    {sensor.value}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {sensor.unit}
                  </span>
                </>
              ) : (
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#333' }}>
                  N: <span style={{ color: '#2E7D32' }}>{sensor.n}</span> | P: <span style={{ color: '#1565C0' }}>{sensor.p}</span> | K: <span style={{ color: '#E65100' }}>{sensor.k}</span> mg/kg
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F0F0F0', paddingTop: '0.75rem', fontSize: '0.8rem' }}>
              <span style={{ color: '#2E7D32', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={15} /> Status: {sensor.status}
              </span>
              <span style={{ color: '#888' }}>Signal: Strong (98dBm)</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Chart & System Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        {/* Real-time Graph */}
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
              Live Telemetry Stream (Moisture % vs Temp °C)
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#1565C0', fontWeight: 700, background: '#E3F2FD', padding: '0.2rem 0.5rem', borderRadius: '0.4rem' }}>
              Polling 4s
            </span>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="time" stroke="#888" style={{ fontSize: '0.75rem' }} />
                <YAxis stroke="#888" style={{ fontSize: '0.75rem' }} />
                <Tooltip contentStyle={{ borderRadius: '0.6rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="moisture" stroke="#1565C0" strokeWidth={3} dot={{ r: 4 }} name="Moisture (%)" />
                <Line type="monotone" dataKey="temp" stroke="#E65100" strokeWidth={2} dot={{ r: 3 }} name="Temp (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sensor Alerts Feed */}
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', margin: '0 0 1rem 0' }}>
            Telemetry Alert Log
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {data?.alerts.map((alt) => (
              <div 
                key={alt.id}
                style={{
                  padding: '0.9rem',
                  borderRadius: '0.75rem',
                  background: alt.severity === 'warning' ? '#FFF8E1' : alt.severity === 'info' ? '#E3F2FD' : '#E8F5E9',
                  border: `1px solid ${alt.severity === 'warning' ? '#FFE082' : alt.severity === 'info' ? '#90CAF9' : '#A5D6A7'}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem'
                }}
              >
                {alt.severity === 'warning' ? <AlertTriangle size={18} color="#F57F17" /> : <ShieldCheck size={18} color="#2E7D32" />}
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)', margin: '0 0 0.2rem 0' }}>
                    {alt.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#777' }}>{alt.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
