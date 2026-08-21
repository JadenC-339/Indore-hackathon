import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Loader2, Calendar, ChevronRight } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, tLocal } = useLang();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'https://krishimitra-backend-wrc0.onrender.com'}/history`);
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleViewResults = (item) => {
    // Map the database row to the "input" object format expected by Results.jsx
    const input = {
      n: item.n,
      p: item.p,
      k: item.k,
      ph: item.ph,
      moisture: item.moisture,
      temperature: item.temperature,
      humidity: item.humidity,
      rainfall: item.rainfall
    };
    
    // Map the database row to the "result" object format expected by Results.jsx
    // Parse arrays/JSON strings if necessary
    const result = {
      soil_quality: item.soil_quality,
      recommended_crops: typeof item.recommended_crops === 'string' ? JSON.parse(item.recommended_crops) : item.recommended_crops,
      improvement_tips: typeof item.improvement_tips === 'string' ? JSON.parse(item.improvement_tips) : item.improvement_tips,
      prediction_confidence: item.prediction_confidence,
      crop_confidences: typeof item.crop_confidences === 'string' ? JSON.parse(item.crop_confidences) : item.crop_confidences,
      model_accuracy: item.model_accuracy
    };

    // Navigate to results page passing the historical state
    navigate('/app/results', { state: { result, input } });
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}><Loader2 className="animate-spin" size={48} color="var(--primary)" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="heading" style={{ fontSize: '2rem' }}>{t.history_title}</h1>
        <p className="subheading">{t.history_subtitle}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }} className="glass">
            {t.history_empty}
          </div>
        ) : (
          history.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.01, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
              key={item.prediction_id} 
              className="glass" 
              onClick={() => handleViewResults(item)}
              style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <Calendar size={14} /> {new Date(item.created_at).toLocaleString()}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>N: {item.n}</span>
                  <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>P: {item.p}</span>
                  <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>K: {item.k}</span>
                  <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>pH: {item.ph}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>|</span>
                  <span style={{ fontWeight: 600, color: '#EF4444' }}>{item.temperature}°C</span>
                  <span style={{ fontWeight: 600, color: '#0EA5E9' }}>{item.moisture}% M</span>
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  {t.history_recommended}: <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{(typeof item.recommended_crops === 'string' ? JSON.parse(item.recommended_crops) : item.recommended_crops).join(', ')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ 
                  background: item.soil_quality === 'Good' ? 'rgba(16,185,129,0.1)' : item.soil_quality === 'Moderate' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                  color: item.soil_quality === 'Good' ? '#10B981' : item.soil_quality === 'Moderate' ? '#F59E0B' : '#EF4444',
                  padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center', minWidth: '100px'
                }}>
                  {tLocal(item.soil_quality)}
                </div>
                
                <div style={{ color: 'var(--primary)', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span className="hide-on-mobile">{tLocal('View')}</span>
                  <ChevronRight size={18} />
                </div>
              </div>

            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default History;
