import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Loader2, Calendar } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5005/history');
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

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
              key={item.prediction_id} 
              className="glass" 
              style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <Calendar size={14} /> {new Date(item.created_at).toLocaleString()}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>N: {item.n}</span>
                  <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>P: {item.p}</span>
                  <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>K: {item.k}</span>
                  <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>pH: {item.ph}</span>
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  {t.history_recommended}: <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{item.recommended_crops.join(', ')}</span>
                </div>
              </div>
              <div style={{ 
                background: item.soil_quality === 'Good' ? 'rgba(16,185,129,0.1)' : item.soil_quality === 'Moderate' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                color: item.soil_quality === 'Good' ? '#10B981' : item.soil_quality === 'Moderate' ? '#F59E0B' : '#EF4444',
                padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 700, fontSize: '0.9rem'
              }}>
                {item.soil_quality}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default History;
