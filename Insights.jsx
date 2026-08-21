import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
  RadialBarChart, RadialBar,
} from 'recharts';
import { Loader2, Brain, Layers, Target, TrendingUp, Cpu, Sprout, Printer } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

const Insights = () => {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, tLocal } = useLang();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [metricsRes, historyRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || 'https://krishimitra-backend-wrc0.onrender.com'}/metrics`),
          axios.get(`${import.meta.env.VITE_API_URL || 'https://krishimitra-backend-wrc0.onrender.com'}/history`),
        ]);
        setMetrics(metricsRes.data);
        setHistory(historyRes.data || []);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}><Loader2 className="animate-spin" size={48} color="var(--primary)" /></div>;
  if (!metrics) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>Error loading insights. Ensure ML service is running.</div>;

  // ━━━ DATA PROCESSING ━━━
  const accuracy = (metrics.accuracy * 100).toFixed(1);

  // Feature importance
  let featureData = [];
  if (metrics.feature_importance) {
    featureData = Object.keys(metrics.feature_importance).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: parseFloat((metrics.feature_importance[key] * 100).toFixed(2)),
      fullMark: 30,
    })).sort((a, b) => b.value - a.value);
  } else {
    featureData = [
      { name: 'Nitrogen', value: 22, fullMark: 30 },
      { name: 'Phosphorus', value: 20, fullMark: 30 },
      { name: 'Potassium', value: 18, fullMark: 30 },
      { name: 'Moisture', value: 15, fullMark: 30 },
      { name: 'pH', value: 12, fullMark: 30 },
      { name: 'Rainfall', value: 8, fullMark: 30 },
      { name: 'Temperature', value: 5, fullMark: 30 },
    ];
  }

  // Crop class distribution from history
  const cropCounts = {};
  history.forEach(h => {
    const crops = h.recommended_crops || [];
    crops.forEach(c => { cropCounts[c] = (cropCounts[c] || 0) + 1; });
  });
  const cropPieData = Object.keys(cropCounts).map(k => ({ name: k, value: cropCounts[k] })).sort((a, b) => b.value - a.value).slice(0, 8);

  // Soil quality distribution
  const qualityCounts = { Good: 0, Moderate: 0, Poor: 0 };
  history.forEach(h => { if (h.soil_quality) qualityCounts[h.soil_quality]++; });
  const qualityData = Object.keys(qualityCounts).map(k => ({ name: k, value: qualityCounts[k] }));
  const qualityColors = { Good: '#10B981', Moderate: '#F59E0B', Poor: '#EF4444' };

  // NPK trend over analyses
  const trendData = history.slice(0, 15).reverse().map((h, i) => ({
    analysis: `#${i + 1}`,
    N: h.n,
    P: h.p,
    K: h.k,
    pH: h.ph,
  }));

  // Accuracy gauge
  const gaugeData = [{ name: 'Accuracy', value: parseFloat(accuracy), fill: '#10B981' }];

  // Card style helper
  const cardAnim = (delay = 0) => ({ initial: { y: 30, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.5, delay } });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }} className="no-print">
        <button 
          onClick={() => window.print()}
          className="glass"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, color: 'var(--primary)', border: '1px solid var(--primary)', background: 'var(--surface)' }}
        >
          <Printer size={18} />
          {tLocal('Print / Download PDF')}
        </button>
      </div>

      <div style={{ padding: '1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="heading" style={{ fontSize: '2rem' }}>{t.insights_title || 'AI Insights'}</h1>
          <p className="subheading">{t.insights_subtitle || 'View AI Model Metrics & History'}</p>
        </div>

      {/* ━━━ ROW 1: Accuracy Gauge + Feature Radar ━━━ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Accuracy Radial Gauge */}
        <motion.div {...cardAnim(0)} className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
            <Target size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>{tLocal('Model Accuracy')}</h2>
          </div>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" startAngle={180} endAngle={0} data={gaugeData} barSize={20}>
                <RadialBar background={{ fill: 'rgba(0,0,0,0.05)' }} clockWise dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '-3.5rem', position: 'relative' }}>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)' }}>{accuracy}%</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{tLocal('VotingClassifier (XGBoost + RF)')}</p>
          </div>

          {/* How Accuracy is Calculated */}
          <div style={{ marginTop: '1.5rem', textAlign: 'left', background: 'var(--surface-alt)', borderRadius: '0.75rem', padding: '1.25rem', borderLeft: '3px solid var(--primary)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              📐 {tLocal('How Accuracy is Calculated')}
            </h3>

            {/* Dataset Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {[
                { label: tLocal('Total Samples'), value: metrics.dataset_info?.total_samples || '4800', color: '#3B82F6' },
                { label: tLocal('Total Crops'), value: metrics.dataset_info?.total_crops || '37', color: '#10B981' },
                { label: tLocal('Train Set (80%)'), value: metrics.dataset_info?.train_samples || '3840', color: '#8B5CF6' },
                { label: tLocal('Test Set (20%)'), value: metrics.dataset_info?.test_samples || '960', color: '#F59E0B' },
              ].map((stat, i) => (
                <div key={i} style={{ background: `${stat.color}0A`, border: `1px solid ${stat.color}20`, borderRadius: '0.5rem', padding: '0.5rem 0.6rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Formula */}
            <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontFamily: 'inherit', fontWeight: 600 }}>{tLocal('Formula:')}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-heading)', fontWeight: 700 }}>
                {tLocal('Accuracy = Correct Predictions / Total Test Samples')}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, marginTop: '0.2rem' }}>
                = {Math.round(parseFloat(accuracy) / 100 * (metrics.dataset_info?.test_samples || 960))} / {metrics.dataset_info?.test_samples || 960} = {accuracy}%
              </div>
            </div>

            {/* Steps explanation */}
            <ol style={{ padding: '0 0 0 1.2rem', margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <li><strong style={{ color: 'var(--text-heading)' }}>{tLocal('Data Split:')}</strong> {tLocal('4800 rows → 80% train (3840) + 20% test (960)')}</li>
              <li><strong style={{ color: 'var(--text-heading)' }}>{tLocal('Feature Scaling:')}</strong> {tLocal('StandardScaler normalizes N, P, K, temp, humidity, pH, rainfall')}</li>
              <li><strong style={{ color: 'var(--text-heading)' }}>{tLocal('Ensemble Training:')}</strong> {tLocal('XGBoost (200 trees) + Random Forest (200 trees) combined via soft-voting')}</li>
              <li><strong style={{ color: 'var(--text-heading)' }}>{tLocal('Evaluation:')}</strong> {tLocal('Model predicts on the unseen 960 test samples; correct predictions ÷ total = accuracy')}</li>
            </ol>
          </div>
        </motion.div>

        {/* Feature Importance Radar */}
        <motion.div {...cardAnim(0.1)} className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Brain size={20} color="#8B5CF6" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>{tLocal('Feature Radar')}</h2>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <RadarChart data={featureData}>
                <PolarGrid stroke="rgba(0,0,0,0.1)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar name={tLocal('Importance')} dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ━━━ ROW 2: Feature Bar Chart + Soil Quality Pie ━━━ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Feature Importance Bar */}
        <motion.div {...cardAnim(0.15)} className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Layers size={20} color="#3B82F6" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>{tLocal('Feature Importance')}</h2>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={featureData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-heading)' }} cursor={{ fill: 'rgba(59,130,246,0.06)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {featureData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Soil Quality Distribution Pie */}
        <motion.div {...cardAnim(0.2)} className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Cpu size={20} color="#F59E0B" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>{tLocal('Soil Quality Distribution')}</h2>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={qualityData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {qualityData.map((entry, i) => (
                    <Cell key={i} fill={qualityColors[entry.name] || COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-heading)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {history.length === 0 && <p style={{ textAlign: 'center', color: '#64748B', fontSize: '0.8rem' }}>{tLocal('Run analyses to populate this chart')}</p>}
        </motion.div>
      </div>

      {/* ━━━ ROW 3: NPK Trend Area Chart ━━━ */}
      {trendData.length > 0 && (
        <motion.div {...cardAnim(0.25)} className="glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <TrendingUp size={20} color="#10B981" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>{tLocal('NPK & pH Trend Across Analyses')}</h2>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradN" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradK" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPH" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="analysis" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-heading)' }} />
                <Area type="monotone" dataKey="N" stroke="#10B981" fill="url(#gradN)" strokeWidth={2} name="Nitrogen" />
                <Area type="monotone" dataKey="P" stroke="#3B82F6" fill="url(#gradP)" strokeWidth={2} name="Phosphorus" />
                <Area type="monotone" dataKey="K" stroke="#F59E0B" fill="url(#gradK)" strokeWidth={2} name="Potassium" />
                <Area type="monotone" dataKey="pH" stroke="#EC4899" fill="url(#gradPH)" strokeWidth={2} name="pH" />
                <Legend wrapperStyle={{ color: '#94A3B8', fontSize: '0.85rem', paddingTop: '0.5rem' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* ━━━ ROW 4: Crop Pie + Supported Classes ━━━ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

        {/* Crop Recommendations Pie */}
        {cropPieData.length > 0 && (
          <motion.div {...cardAnim(0.3)} className="glass" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sprout size={20} color="#14B8A6" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>{tLocal('Top Recommended Crops')}</h2>
            </div>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={cropPieData} cx="50%" cy="50%" outerRadius={95} dataKey="value" label={({ name }) => name}>
                    {cropPieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-heading)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* All Supported Classes */}
        <motion.div {...cardAnim(0.35)} className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Layers size={20} color="#EC4899" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>{tLocal('Predictable Crop Classes')}</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {metrics.classes?.map((cls, i) => (
              <span key={i} style={{
                background: `${COLORS[i % COLORS.length]}15`,
                color: COLORS[i % COLORS.length],
                padding: '0.45rem 0.9rem',
                borderRadius: '2rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: `1px solid ${COLORS[i % COLORS.length]}30`,
              }}>
                {cls}
              </span>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--surface-alt)', borderRadius: '0.75rem', borderLeft: '3px solid var(--primary)' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text-heading)' }}>{metrics.classes?.length || 0}</strong> {tLocal('unique crop types supported by the model.')}
              {tLocal('The VotingClassifier combines XGBoost and Random Forest predictions using soft voting for maximum robustness.')}
            </p>
          </div>
        </motion.div>
      </div>

      </div>
    </motion.div>
  );
};

export default Insights;
