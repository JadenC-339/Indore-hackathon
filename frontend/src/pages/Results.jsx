import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, CheckCircle, AlertTriangle, ArrowLeft, Droplets, Thermometer, Cloud, Leaf, TrendingUp, Send, Lightbulb, Target } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLang } from '../context/LanguageContext';

const Results = () => {
  const location = useLocation();
  const { t } = useLang();
  const { result, input } = location.state || {};

  if (!result) return <Navigate to="/app/analyze" />;

  const { soil_quality, recommended_crops, improvement_tips, prediction_confidence, crop_confidences, model_accuracy } = result;

  const qualityColor = soil_quality === 'Good' ? '#10B981' : soil_quality === 'Moderate' ? '#F59E0B' : '#EF4444';
  const qualityBg = soil_quality === 'Good' ? 'rgba(16,185,129,0.08)' : soil_quality === 'Moderate' ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)';

  // Radar data from input params
  const radarData = input ? [
    { param: 'Nitrogen', value: Math.min(input.n || 0, 140), max: 140 },
    { param: 'Phosphorus', value: Math.min(input.p || 0, 145), max: 145 },
    { param: 'Potassium', value: Math.min(input.k || 0, 205), max: 205 },
    { param: 'pH', value: (input.ph || 0) * 14, max: 14 * 14 }, // Scale pH to be visible
    { param: 'Temp', value: Math.min(input.temperature || 0, 45), max: 45 },
    { param: 'Humidity', value: Math.min(input.humidity || 0, 100), max: 100 },
  ] : [];

  // Donut for quality score
  const qualityScore = soil_quality === 'Good' ? 90 : soil_quality === 'Moderate' ? 60 : 30;
  const donutData = [
    { name: 'Score', value: qualityScore },
    { name: 'Remaining', value: 100 - qualityScore },
  ];

  // Input param cards
  const paramCards = input ? [
    { label: 'Nitrogen (N)', value: input.n, icon: <Leaf size={18} />, color: '#10B981' },
    { label: 'Phosphorus (P)', value: input.p, icon: <Droplets size={18} />, color: '#3B82F6' },
    { label: 'Potassium (K)', value: input.k, icon: <TrendingUp size={18} />, color: '#F59E0B' },
    { label: 'pH Level', value: input.ph, icon: <Target size={18} />, color: '#8B5CF6' },
    { label: 'Temperature', value: `${input.temperature}°C`, icon: <Thermometer size={18} />, color: '#EF4444' },
    { label: 'Humidity', value: `${input.humidity}%`, icon: <Cloud size={18} />, color: '#14B8A6' },
  ] : [];

  const cardAnim = (delay = 0) => ({
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5, delay },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1000px', margin: '0 auto' }}>

      {/* Back link */}
      <Link to="/app/analyze" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> New Analysis
      </Link>

      {/* ━━━ HERO RESULT ━━━ */}
      <motion.div {...cardAnim(0)} className="glass" style={{ padding: '2.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', background: qualityBg, borderLeft: `4px solid ${qualityColor}` }}>
        {/* Quality Badge */}
        <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
          <div style={{ width: 140, height: 140, position: 'relative' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={45} outerRadius={62} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                  <Cell fill={qualityColor} />
                  <Cell fill="rgba(0,0,0,0.05)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {soil_quality === 'Good' ? <CheckCircle size={22} color={qualityColor} /> : <AlertTriangle size={22} color={qualityColor} />}
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Score</span>
            </div>
          </div>
        </div>

        {/* Quality Text */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>{t.results_quality}</p>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: qualityColor, margin: '0 0 0.5rem 0', lineHeight: 1 }}>{soil_quality}</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            {soil_quality === 'Good' ? 'Excellent conditions for high-yield agriculture.' : soil_quality === 'Moderate' ? 'Soil requires targeted amendments for optimal output.' : 'Critical deficiencies detected. Immediate action needed.'}
          </p>
          {prediction_confidence != null && (
            <span style={{ display: 'inline-block', marginTop: '0.75rem', background: 'rgba(16,185,129,0.1)', color: '#10B981', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(16,185,129,0.2)' }}>
              Prediction Confidence: {(prediction_confidence * 100).toFixed(1)}%
            </span>
          )}
          {model_accuracy && (
            <span style={{ display: 'inline-block', marginTop: '0.5rem', marginLeft: prediction_confidence != null ? '0.5rem' : '0', background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 600, border: '1px solid rgba(139,92,246,0.15)' }}>
              Model Accuracy: {(model_accuracy * 100).toFixed(1)}%
            </span>
          )}
        </div>
      </motion.div>

      {/* ━━━ INPUT PARAMS GRID ━━━ */}
      {paramCards.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {paramCards.map((p, i) => (
            <motion.div key={i} {...cardAnim(0.05 + i * 0.04)} className="glass" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ color: p.color, marginBottom: '0.4rem', display: 'flex', justifyContent: 'center' }}>{p.icon}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>{p.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{p.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ━━━ ROW: Radar + Crops + Tips ━━━ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Soil Parameter Radar */}
        {radarData.length > 0 && (
          <motion.div {...cardAnim(0.2)} className="glass" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="#8B5CF6" /> Parameter Profile
            </h2>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(0,0,0,0.1)" />
                  <PolarAngleAxis dataKey="param" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  <Radar name="Your Soil" dataKey="value" stroke={qualityColor} fill={qualityColor} fillOpacity={0.2} strokeWidth={2} dot={{ r: 3, fill: qualityColor }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Recommended Crops */}
        <motion.div {...cardAnim(0.25)} className="glass" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sprout size={18} color="#10B981" /> {t.results_crops}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {recommended_crops.map((crop, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  background: 'rgba(16,185,129,0.06)', padding: '1rem 1.25rem',
                  borderRadius: '0.75rem', border: '1px solid rgba(16,185,129,0.1)',
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${['#10B981','#3B82F6','#F59E0B','#8B5CF6'][idx % 4]}, ${['#059669','#1D4ED8','#D97706','#7C3AED'][idx % 4]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.85rem', fontWeight: 800, flexShrink: 0 }}>
                  {idx + 1}
                </div>
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--text-heading)', textTransform: 'capitalize', fontSize: '1rem' }}>{crop}</span>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                    {idx === 0 ? 'Best match for your soil profile' : 'Alternative crop recommendation'}
                    {crop_confidences && crop_confidences[idx] && (
                      <span style={{ marginLeft: '0.5rem', fontWeight: 700, color: crop_confidences[idx].confidence >= 0.5 ? '#10B981' : crop_confidences[idx].confidence >= 0.2 ? '#F59E0B' : '#EF4444' }}>
                        ({(crop_confidences[idx].confidence * 100).toFixed(1)}% confidence)
                      </span>
                    )}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ━━━ ACTIONABLE TIPS ━━━ */}
      <motion.div {...cardAnim(0.3)} className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lightbulb size={18} color="#F59E0B" /> {t.results_tips}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {improvement_tips.map((tip, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.08 }}
              style={{
                display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                padding: '1rem 1.25rem', borderRadius: '0.75rem',
                background: idx === 0 ? 'rgba(245,158,11,0.06)' : 'var(--surface-alt)',
                border: idx === 0 ? '1px solid rgba(245,158,11,0.15)' : '1px solid var(--border)',
              }}
            >
              <span style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', background: idx === 0 ? '#F59E0B' : 'rgba(0,0,0,0.06)', color: idx === 0 ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, marginTop: '2px' }}>
                {idx + 1}
              </span>
              <p style={{ fontSize: '0.9rem', color: idx === 0 ? '#92400E' : 'var(--text-muted)', lineHeight: 1.5, margin: 0, fontWeight: idx === 0 ? 600 : 400 }}>
                {tip}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ━━━ ACTION BUTTONS ━━━ */}
      <motion.div {...cardAnim(0.4)} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <Link to="/app/analyze" className="btn-primary" style={{ flex: 1, minWidth: '200px', justifyContent: 'center' }}>
          <ArrowLeft size={16} /> Analyze Again
        </Link>
        <Link to="/app/communication" className="btn-primary" style={{ flex: 1, minWidth: '200px', justifyContent: 'center', background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }}>
          <Send size={16} /> SMS to Farmer
        </Link>
        <Link to="/app/insights" className="btn-primary" style={{ flex: 1, minWidth: '200px', justifyContent: 'center', background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', boxShadow: '0 4px 15px rgba(139,92,246,0.3)' }}>
          <TrendingUp size={16} /> View Insights
        </Link>
      </motion.div>

    </motion.div>
  );
};

export default Results;
