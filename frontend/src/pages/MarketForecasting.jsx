import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Calendar, MapPin, ArrowUpRight, ArrowDownRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5005';

export default function MarketForecasting() {
  const [marketData, setMarketData] = useState(null);
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarket() {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/market/forecast`);
        if (res.data?.success) {
          setMarketData(res.data);
        }
      } catch (err) {
        console.error('Error fetching mandi market forecast', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMarket();
  }, []);

  const activeCrop = marketData?.crops[selectedCropIndex] || null;

  // Format historical + forecast data into continuous chart array
  const chartData = activeCrop ? [
    ...activeCrop.historical_30d.map((val, i) => ({ label: `W-${7 - i}`, price: val, type: 'Historical' })),
    ...activeCrop.forecast_30d.map((val, i) => ({ label: `W+${i + 1}`, price: val, type: 'Forecast' }))
  ] : [];

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ background: '#E8F5E9', padding: '0.5rem', borderRadius: '0.6rem' }}>
            <TrendingUp size={26} color="#2E7D32" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
              Mandi Price AI Forecasting
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
              30-Day predictive mandi rates, price trend signals & selling window advisor
            </p>
          </div>
        </div>

        <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.4rem 0.8rem', borderRadius: '0.6rem', fontWeight: 700, fontSize: '0.82rem', border: '1px solid #C8E6C9' }}>
          Data Source: Agmarknet APMC Sync
        </div>
      </div>

      {/* Crop Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        {marketData?.crops.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCropIndex(idx)}
            style={{
              background: selectedCropIndex === idx ? 'var(--primary)' : '#FFFFFF',
              color: selectedCropIndex === idx ? '#FFF' : '#333',
              border: `1px solid ${selectedCropIndex === idx ? 'var(--primary)' : '#DDD'}`,
              borderRadius: '0.75rem',
              padding: '0.6rem 1.1rem',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {item.crop}
          </button>
        ))}
      </div>

      {/* Main Grid: Price Curve + Action Advisory */}
      {activeCrop && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Recharts Price Curve */}
          <div style={{ background: '#FFFFFF', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                  {activeCrop.crop} Price Trajectory
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>📍 Top Benchmark Mandi: {activeCrop.top_mandi}</span>
              </div>
              <span style={{
                background: activeCrop.trend.includes('UP') ? '#E8F5E9' : '#FFEBEE',
                color: activeCrop.trend.includes('UP') ? '#2E7D32' : '#C62828',
                padding: '0.3rem 0.7rem',
                borderRadius: '0.5rem',
                fontWeight: 800,
                fontSize: '0.82rem'
              }}>
                {activeCrop.trend}
              </span>
            </div>

            <div style={{ width: '100%', height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="label" stroke="#888" style={{ fontSize: '0.75rem' }} />
                  <YAxis domain={['auto', 'auto']} stroke="#888" style={{ fontSize: '0.75rem' }} />
                  <Tooltip contentStyle={{ borderRadius: '0.6rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="price" stroke="#2E7D32" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" name="Rate (₹/Quintal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Action Advisory Box */}
          <div style={{
            background: activeCrop.trend.includes('UP') ? 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)' : 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
            borderRadius: '1rem',
            padding: '1.75rem',
            color: '#FFF',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: '1rem', width: 'fit-content', marginBottom: '1rem' }}>
                <Zap size={14} /> Selling Strategy Advisory
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                {activeCrop.recommendation}
              </h2>

              <p style={{ opacity: 0.9, fontSize: '0.92rem', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
                Our LSTM market forecasting model analyzed arrival volumes across 45 regional APMC mandis to compute this window.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Current Mandi Rate</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹{activeCrop.current_price_rs_quintal.toLocaleString()}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Predicted 30D Peak</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: activeCrop.trend.includes('UP') ? '#52b788' : '#fca5a5' }}>
                  ₹{activeCrop.predicted_price_30d.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Mandi Rate Comparison Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', margin: '0 0 1rem 0' }}>
          All Crops Mandi Summary Table
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Crop Name</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Benchmark Mandi</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Today's Rate (₹/Qtl)</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>30-Day AI Forecast</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Trend</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Strategy Advisory</th>
              </tr>
            </thead>
            <tbody>
              {marketData?.crops.map((c, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{c.crop}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#666' }}>{c.top_mandi}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>₹{c.current_price_rs_quintal}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#2E7D32' }}>₹{c.predicted_price_30d}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      background: c.trend.includes('UP') ? '#E8F5E9' : '#FFEBEE',
                      color: c.trend.includes('UP') ? '#2E7D32' : '#C62828',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '0.4rem',
                      fontWeight: 800,
                      fontSize: '0.78rem'
                    }}>
                      {c.trend}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#444', fontWeight: 600 }}>{c.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
