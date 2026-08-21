import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Leaf, Droplets, Thermometer, Cloud, Zap, FlaskConical, CircleDot, CloudRain, RotateCcw, Cpu, ChevronDown, Sprout, MapPin } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

// Average soil & environment values for common Indian crops (from agricultural research data)
const cropPresets = {
  '': { label: 'Select a crop to auto-fill...', n: 50, p: 25, k: 40, ph: 6.5, moisture: 50, temperature: 25, humidity: 60, rainfall: 100 },
  // ━━━ Original 22 Crops ━━━
  rice:       { label: '🌾 Rice',         n: 80,  p: 48,  k: 40,  ph: 6.5, moisture: 70, temperature: 24, humidity: 82, rainfall: 236 },
  wheat:      { label: '🌾 Wheat',        n: 95,  p: 60,  k: 45,  ph: 6.8, moisture: 50, temperature: 20, humidity: 55, rainfall: 85 },
  maize:      { label: '🌽 Maize',        n: 77,  p: 48,  k: 20,  ph: 6.2, moisture: 55, temperature: 23, humidity: 65, rainfall: 85 },
  cotton:     { label: '🧶 Cotton',       n: 120, p: 40,  k: 20,  ph: 7.0, moisture: 40, temperature: 30, humidity: 65, rainfall: 80 },
  sugarcane:  { label: '🎋 Sugarcane',    n: 115, p: 45,  k: 60,  ph: 6.5, moisture: 60, temperature: 30, humidity: 72, rainfall: 200 },
  jute:       { label: '🧵 Jute',         n: 80,  p: 40,  k: 40,  ph: 7.0, moisture: 70, temperature: 27, humidity: 85, rainfall: 175 },
  coffee:     { label: '☕ Coffee',       n: 100, p: 20,  k: 30,  ph: 6.0, moisture: 55, temperature: 25, humidity: 70, rainfall: 175 },
  tea:        { label: '🍵 Tea',          n: 80,  p: 32,  k: 30,  ph: 5.2, moisture: 65, temperature: 23, humidity: 82, rainfall: 225 },
  mango:      { label: '🥭 Mango',       n: 20,  p: 25,  k: 30,  ph: 5.8, moisture: 45, temperature: 31, humidity: 50, rainfall: 100 },
  banana:     { label: '🍌 Banana',       n: 100, p: 75,  k: 50,  ph: 6.0, moisture: 60, temperature: 27, humidity: 80, rainfall: 105 },
  pomegranate:{ label: '🍎 Pomegranate',  n: 20,  p: 10,  k: 40,  ph: 6.5, moisture: 35, temperature: 34, humidity: 45, rainfall: 55 },
  grapes:     { label: '🍇 Grapes',       n: 25,  p: 65,  k: 200, ph: 6.0, moisture: 40, temperature: 32, humidity: 60, rainfall: 70 },
  apple:      { label: '🍎 Apple',        n: 20,  p: 130, k: 200, ph: 6.0, moisture: 55, temperature: 22, humidity: 90, rainfall: 110 },
  coconut:    { label: '🥥 Coconut',      n: 20,  p: 10,  k: 30,  ph: 5.8, moisture: 50, temperature: 27, humidity: 95, rainfall: 175 },
  papaya:     { label: '🍈 Papaya',       n: 50,  p: 55,  k: 50,  ph: 6.5, moisture: 45, temperature: 33, humidity: 65, rainfall: 145 },
  orange:     { label: '🍊 Orange',       n: 20,  p: 10,  k: 10,  ph: 7.0, moisture: 40, temperature: 25, humidity: 75, rainfall: 110 },
  chickpea:   { label: '🫘 Chickpea',     n: 40,  p: 60,  k: 80,  ph: 7.0, moisture: 30, temperature: 18, humidity: 35, rainfall: 75 },
  lentil:     { label: '🫘 Lentil',       n: 20,  p: 60,  k: 20,  ph: 6.5, moisture: 35, temperature: 22, humidity: 50, rainfall: 50 },
  watermelon: { label: '🍉 Watermelon',   n: 100, p: 15,  k: 50,  ph: 6.5, moisture: 40, temperature: 30, humidity: 65, rainfall: 50 },
  muskmelon:  { label: '🍈 Muskmelon',    n: 100, p: 15,  k: 50,  ph: 6.5, moisture: 35, temperature: 32, humidity: 60, rainfall: 45 },
  kidneybeans:{ label: '🫘 Kidney Beans', n: 20,  p: 65,  k: 20,  ph: 5.8, moisture: 45, temperature: 20, humidity: 70, rainfall: 115 },
  mothbeans:  { label: '🫘 Moth Beans',   n: 20,  p: 45,  k: 20,  ph: 6.5, moisture: 30, temperature: 30, humidity: 45, rainfall: 45 },
  pigeonpeas: { label: '🫘 Pigeon Peas',  n: 20,  p: 60,  k: 20,  ph: 6.4, moisture: 35, temperature: 28, humidity: 50, rainfall: 140 },
  blackgram:  { label: '🫘 Black Gram',   n: 40,  p: 60,  k: 20,  ph: 7.0, moisture: 40, temperature: 28, humidity: 65, rainfall: 70 },
  mungbean:   { label: '🫘 Mung Bean',    n: 20,  p: 45,  k: 20,  ph: 6.5, moisture: 35, temperature: 28, humidity: 85, rainfall: 45 },
  // ━━━ 15 New India-Specific Crops ━━━
  turmeric:   { label: '🟡 Turmeric',     n: 60,  p: 35,  k: 75,  ph: 6.2, moisture: 55, temperature: 26, humidity: 72, rainfall: 150 },
  ginger:     { label: '🫚 Ginger',       n: 70,  p: 40,  k: 60,  ph: 6.2, moisture: 60, temperature: 25, humidity: 80, rainfall: 215 },
  groundnut:  { label: '🥜 Groundnut',    n: 28,  p: 50,  k: 35,  ph: 6.2, moisture: 40, temperature: 30, humidity: 62, rainfall: 90 },
  soybean:    { label: '🫘 Soybean',      n: 20,  p: 60,  k: 45,  ph: 6.8, moisture: 45, temperature: 27, humidity: 68, rainfall: 105 },
  mustard:    { label: '🌼 Mustard',      n: 70,  p: 40,  k: 28,  ph: 6.9, moisture: 35, temperature: 18, humidity: 52, rainfall: 55 },
  tomato:     { label: '🍅 Tomato',       n: 110, p: 60,  k: 90,  ph: 6.2, moisture: 50, temperature: 24, humidity: 62, rainfall: 90 },
  potato:     { label: '🥔 Potato',       n: 105, p: 70,  k: 115, ph: 5.8, moisture: 55, temperature: 20, humidity: 70, rainfall: 85 },
  onion:      { label: '🧅 Onion',        n: 85,  p: 45,  k: 60,  ph: 6.8, moisture: 45, temperature: 24, humidity: 60, rainfall: 70 },
  chilli:     { label: '🌶️ Chilli',       n: 95,  p: 45,  k: 60,  ph: 6.6, moisture: 50, temperature: 28, humidity: 68, rainfall: 95 },
  cardamom:   { label: '🫛 Cardamom',     n: 58,  p: 35,  k: 90,  ph: 5.8, moisture: 65, temperature: 22, humidity: 85, rainfall: 275 },
  blackpepper:{ label: '⚫ Black Pepper', n: 45,  p: 28,  k: 115, ph: 6.2, moisture: 60, temperature: 27, humidity: 82, rainfall: 275 },
  rubber:     { label: '🌳 Rubber',       n: 35,  p: 25,  k: 35,  ph: 5.2, moisture: 65, temperature: 29, humidity: 85, rainfall: 300 },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Region-Specific Presets — Indian Agro-Climatic Zones
// Data sourced from: ICAR, NBSS&LUP, IMD Climate Normals
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const regionPresets = {
  '': { label: 'Select your region...', desc: '', soil: '', crops: [], n: 50, p: 25, k: 40, ph: 6.5, moisture: 50, temperature: 25, humidity: 60, rainfall: 100 },
  // ━━━ NORTH INDIA ━━━
  'north_punjab': {
    label: '🌾 North — Punjab & Haryana (Indo-Gangetic Plain)',
    desc: 'Fertile alluvial soil, canal-irrigated, extreme summers & cold winters',
    soil: 'Alluvial (Sandy Loam)', crops: ['Wheat', 'Rice', 'Sugarcane', 'Mustard', 'Maize', 'Cotton'],
    n: 90, p: 55, k: 45, ph: 7.2, moisture: 50, temperature: 24, humidity: 55, rainfall: 70,
  },
  'north_up': {
    label: '🌾 North — Uttar Pradesh (Upper Gangetic)',
    desc: 'Rich alluvial plains, monsoon-fed, major sugarcane & wheat belt',
    soil: 'Alluvial (Clay Loam)', crops: ['Sugarcane', 'Wheat', 'Rice', 'Potato', 'Mustard', 'Lentil'],
    n: 95, p: 50, k: 50, ph: 7.0, moisture: 55, temperature: 26, humidity: 60, rainfall: 95,
  },
  'north_himachal': {
    label: '🏔️ North — Himachal Pradesh & Uttarakhand (Himalayan)',
    desc: 'Mountain terrain, acidic soil, cool climate ideal for temperate fruits',
    soil: 'Mountain (Brown Forest)', crops: ['Apple', 'Tea', 'Kidney Beans', 'Potato', 'Ginger', 'Cardamom'],
    n: 30, p: 70, k: 120, ph: 5.8, moisture: 60, temperature: 16, humidity: 75, rainfall: 150,
  },
  // ━━━ SOUTH INDIA ━━━
  'south_kerala': {
    label: '🌴 South — Kerala (Malabar Coast)',
    desc: 'Tropical, very high rainfall, laterite soil, spice & plantation capital',
    soil: 'Laterite (Red)', crops: ['Coconut', 'Rubber', 'Black Pepper', 'Cardamom', 'Tea', 'Banana', 'Ginger'],
    n: 35, p: 20, k: 60, ph: 5.3, moisture: 70, temperature: 27, humidity: 88, rainfall: 300,
  },
  'south_tn': {
    label: '🌾 South — Tamil Nadu (Cauvery Delta)',
    desc: 'Delta irrigation, red & black soil, rice granary of South India',
    soil: 'Alluvial / Red Sandy', crops: ['Rice', 'Sugarcane', 'Banana', 'Turmeric', 'Groundnut', 'Chilli'],
    n: 70, p: 40, k: 50, ph: 6.5, moisture: 55, temperature: 30, humidity: 72, rainfall: 95,
  },
  'south_karnataka': {
    label: '☕ South — Karnataka (Malnad & Coastal)',
    desc: 'Western Ghats slopes, rich biodiversity, coffee & spice plantations',
    soil: 'Laterite / Forest Loam', crops: ['Coffee', 'Cardamom', 'Black Pepper', 'Rice', 'Coconut', 'Rubber'],
    n: 45, p: 25, k: 55, ph: 5.5, moisture: 65, temperature: 24, humidity: 80, rainfall: 250,
  },
  'south_ap': {
    label: '🌶️ South — Andhra Pradesh & Telangana',
    desc: 'Deccan plateau + coastal delta, black cotton & red soil mix',
    soil: 'Black Cotton / Red', crops: ['Rice', 'Chilli', 'Turmeric', 'Cotton', 'Groundnut', 'Onion', 'Mango'],
    n: 80, p: 45, k: 55, ph: 6.8, moisture: 45, temperature: 30, humidity: 65, rainfall: 85,
  },
  // ━━━ WEST INDIA ━━━
  'west_gujarat': {
    label: '🥜 West — Gujarat (Semi-Arid)',
    desc: 'Dry climate, black & sandy soil, major groundnut & cotton belt',
    soil: 'Black Cotton / Sandy', crops: ['Groundnut', 'Cotton', 'Onion', 'Sugarcane', 'Chilli', 'Mango'],
    n: 40, p: 35, k: 45, ph: 7.5, moisture: 30, temperature: 30, humidity: 50, rainfall: 60,
  },
  'west_rajasthan': {
    label: '🏜️ West — Rajasthan (Arid & Semi-Arid)',
    desc: 'Desert & semi-desert, sandy soil, low rainfall, hardy crops only',
    soil: 'Desert Sandy / Arid', crops: ['Mustard', 'Moth Beans', 'Mung Bean', 'Groundnut', 'Watermelon', 'Chickpea'],
    n: 25, p: 30, k: 20, ph: 7.8, moisture: 20, temperature: 33, humidity: 35, rainfall: 35,
  },
  'west_maharashtra': {
    label: '🍇 West — Maharashtra (Deccan Plateau)',
    desc: 'Black basaltic soil, semi-arid interior, sugarcane & grape region',
    soil: 'Black Basaltic (Regur)', crops: ['Sugarcane', 'Grapes', 'Soybean', 'Onion', 'Pomegranate', 'Cotton', 'Chilli'],
    n: 60, p: 40, k: 50, ph: 7.0, moisture: 40, temperature: 28, humidity: 55, rainfall: 75,
  },
  // ━━━ EAST INDIA ━━━
  'east_bengal': {
    label: '🌾 East — West Bengal (Gangetic Delta)',
    desc: 'Fertile delta, heavy monsoon, ideal for rice, jute & potato',
    soil: 'Alluvial (Delta Clay)', crops: ['Rice', 'Jute', 'Potato', 'Mustard', 'Mango', 'Lentil', 'Tea'],
    n: 75, p: 45, k: 40, ph: 6.5, moisture: 65, temperature: 27, humidity: 80, rainfall: 175,
  },
  'east_odisha': {
    label: '🌾 East — Odisha (Coastal & Tribal)',
    desc: 'Coastal alluvial to hilly laterite, rice dominant, turmeric belt',
    soil: 'Laterite / Alluvial', crops: ['Rice', 'Turmeric', 'Groundnut', 'Sugarcane', 'Banana', 'Black Gram'],
    n: 65, p: 35, k: 45, ph: 5.8, moisture: 60, temperature: 28, humidity: 78, rainfall: 155,
  },
  'east_bihar': {
    label: '🥔 East — Bihar & Jharkhand',
    desc: 'Upper Gangetic alluvial, major litchi & maize zone, monsoon-heavy',
    soil: 'Alluvial (Loamy)', crops: ['Rice', 'Wheat', 'Maize', 'Potato', 'Lentil', 'Sugarcane', 'Onion'],
    n: 80, p: 50, k: 45, ph: 6.8, moisture: 55, temperature: 26, humidity: 70, rainfall: 120,
  },
  // ━━━ CENTRAL INDIA ━━━
  'central_mp': {
    label: '🫘 Central — Madhya Pradesh (Black Soil Belt)',
    desc: 'Heart of India, deep black cotton soil, soybean capital',
    soil: 'Black Cotton (Deep Regur)', crops: ['Soybean', 'Wheat', 'Chickpea', 'Cotton', 'Chilli', 'Onion', 'Tomato'],
    n: 55, p: 45, k: 40, ph: 7.2, moisture: 40, temperature: 26, humidity: 55, rainfall: 100,
  },
  'central_cg': {
    label: '🌾 Central — Chhattisgarh (Rice Bowl)',
    desc: 'Red & yellow soil, tribal farming, predominantly rice cultivation',
    soil: 'Red & Yellow Laterite', crops: ['Rice', 'Maize', 'Pigeon Peas', 'Groundnut', 'Sugarcane', 'Ginger'],
    n: 60, p: 30, k: 35, ph: 6.0, moisture: 50, temperature: 27, humidity: 65, rainfall: 130,
  },
  // ━━━ NORTHEAST INDIA ━━━
  'ne_assam': {
    label: '🍵 Northeast — Assam & Meghalaya',
    desc: 'Brahmaputra valley, extremely high rainfall, tea & ginger hub',
    soil: 'Alluvial / Acidic Red', crops: ['Tea', 'Rice', 'Ginger', 'Turmeric', 'Orange', 'Banana', 'Rubber'],
    n: 50, p: 25, k: 35, ph: 5.0, moisture: 75, temperature: 25, humidity: 85, rainfall: 280,
  },
  'ne_nagaland': {
    label: '🌿 Northeast — Nagaland, Mizoram & Manipur',
    desc: 'Hilly terrain, jhum cultivation, very high rainfall, acidic soil',
    soil: 'Mountain Acidic (Red)', crops: ['Rice', 'Ginger', 'Turmeric', 'Chilli', 'Black Pepper', 'Orange'],
    n: 40, p: 20, k: 30, ph: 4.8, moisture: 70, temperature: 22, humidity: 82, rainfall: 250,
  },
  // ━━━ COASTAL / KONKAN ━━━
  'coastal_konkan': {
    label: '🥥 Coastal — Konkan & Goa',
    desc: 'Western coastline, laterite soil, coconut & mango paradise',
    soil: 'Laterite (Sandy)', crops: ['Coconut', 'Mango', 'Rice', 'Banana', 'Black Pepper', 'Papaya'],
    n: 30, p: 20, k: 40, ph: 5.5, moisture: 60, temperature: 28, humidity: 82, rainfall: 280,
  },
};

const Analyze = () => {
  const navigate = useNavigate();
  const { t, tLocal } = useLang();
  const [loading, setLoading] = useState(false);
  const [activeParam, setActiveParam] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [presetApplied, setPresetApplied] = useState('');

  const defaults = { n: 50, p: 25, k: 40, ph: 6.5, moisture: 50, temperature: 25, humidity: 60, rainfall: 100 };
  const [formData, setFormData] = useState({ ...defaults });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
    setPresetApplied(''); // clear indicator when manual change
  };

  const handleReset = () => {
    setFormData({ ...defaults });
    setSelectedCrop('');
    setSelectedRegion('');
    setPresetApplied('');
  };

  const handleRegionPreset = (regionKey) => {
    setSelectedRegion(regionKey);
    setSelectedCrop(''); // clear crop selection when region is picked
    if (!regionKey) return;
    const preset = regionPresets[regionKey];
    setFormData({
      n: preset.n, p: preset.p, k: preset.k, ph: preset.ph,
      moisture: preset.moisture, temperature: preset.temperature,
      humidity: preset.humidity, rainfall: preset.rainfall,
    });
    setPresetApplied(preset.label);
    setTimeout(() => setPresetApplied(''), 4000);
  };

  const handleCropPreset = (cropKey) => {
    setSelectedCrop(cropKey);
    if (!cropKey) return;
    const preset = cropPresets[cropKey];
    setFormData({
      n: preset.n, p: preset.p, k: preset.k, ph: preset.ph,
      moisture: preset.moisture, temperature: preset.temperature,
      humidity: preset.humidity, rainfall: preset.rainfall,
    });
    setPresetApplied(preset.label);
    setTimeout(() => setPresetApplied(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'https://krishimitra-backend-wrc0.onrender.com'}/predict`, formData);
      navigate('/app/results', { state: { result: response.data, input: formData } });
    } catch (error) {
      console.error(error);
      alert(tLocal('Error fetching prediction. Ensure the backend is running.'));
    } finally {
      setLoading(false);
    }
  };

  const parameters = [
    { name: 'n', label: t.analyze_nitrogen, min: 0, max: 150, unit: 'mg/kg', color: '#10B981', icon: <Leaf size={18} />, hint: 'Essential for leaf growth. Low N causes yellowing.' },
    { name: 'p', label: t.analyze_phosphorus, min: 0, max: 150, unit: 'mg/kg', color: '#3B82F6', icon: <FlaskConical size={18} />, hint: 'Drives root development and flowering.' },
    { name: 'k', label: t.analyze_potassium, min: 0, max: 250, unit: 'mg/kg', color: '#F59E0B', icon: <Zap size={18} />, hint: 'Strengthens disease resistance and yield.' },
    { name: 'ph', label: t.analyze_ph, min: 0, max: 14, step: 0.1, unit: '', color: '#8B5CF6', icon: <CircleDot size={18} />, hint: '6.0–7.0 is optimal. Affects nutrient absorption.' },
    { name: 'moisture', label: t.analyze_moisture, min: 0, max: 100, unit: '%', color: '#0EA5E9', icon: <Droplets size={18} />, hint: 'Water retention level in the soil sample.' },
    { name: 'temperature', label: t.analyze_temperature, min: -10, max: 50, unit: '°C', color: '#EF4444', icon: <Thermometer size={18} />, hint: 'Ambient air temperature at measurement time.' },
    { name: 'humidity', label: t.analyze_humidity, min: 0, max: 100, unit: '%', color: '#14B8A6', icon: <Cloud size={18} />, hint: 'Relative humidity in the environment.' },
    { name: 'rainfall', label: t.analyze_rainfall, min: 0, max: 300, unit: 'mm', color: '#6366F1', icon: <CloudRain size={18} />, hint: 'Average rainfall in the region (mm/year).' },
  ];

  const getFillPct = (param) => {
    const range = param.max - param.min;
    return ((formData[param.name] - param.min) / range) * 100;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', padding: '0.4rem 1rem', borderRadius: '2rem', color: '#10B981', fontWeight: 600, fontSize: '0.8rem', marginBottom: '1rem' }}>
          <Cpu size={14} /> {tLocal('ML-Powered Analysis')}
        </div>
        <h1 className="heading" style={{ fontSize: '2.2rem' }}>{t.analyze_title}</h1>
        <p className="subheading" style={{ maxWidth: '550px', margin: '0 auto' }}>{t.analyze_subtitle}</p>
      </div>

      <form onSubmit={handleSubmit}>

        {/* ━━━ Region Preset Picker ━━━ */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass"
          style={{ padding: '1.5rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden', borderLeft: selectedRegion ? '3px solid #6366F1' : undefined }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}>
              <MapPin size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>{tLocal('Quick Fill — Region Presets')}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{tLocal('Select your Indian region to auto-fill local soil & climate conditions')}</p>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <select
              id="region-preset-select"
              value={selectedRegion}
              onChange={(e) => handleRegionPreset(e.target.value)}
              style={{
                width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem',
                border: '1px solid var(--border)', background: 'var(--surface-alt)',
                color: selectedRegion ? 'var(--text-heading)' : 'var(--text-muted)',
                fontSize: '0.95rem', fontWeight: 600, outline: 'none', cursor: 'pointer',
                appearance: 'none',
              }}
            >
              {Object.keys(regionPresets).map(key => (
                <option key={key} value={key} style={{ color: 'var(--text-heading)', background: 'var(--surface)', padding: '8px' }}>
                  {key === '' ? t.analyze_choose_region : (t[key] || regionPresets[key].label)}
                </option>
              ))}
            </select>
            <ChevronDown size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          </div>

          {/* Region Detail Card */}
          <AnimatePresence>
            {selectedRegion && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ marginTop: '1rem' }}
              >
                {/* Description & Soil Type */}
                <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-heading)', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
                    {regionPresets[selectedRegion].desc}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(139,92,246,0.08)', color: '#8B5CF6', padding: '0.3rem 0.7rem', borderRadius: '2rem', fontSize: '0.72rem', fontWeight: 700, border: '1px solid rgba(139,92,246,0.15)' }}>
                      🪨 {regionPresets[selectedRegion].soil}
                    </span>
                  </div>
                </div>

                {/* Key Params */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {[
                    { label: 'N', value: regionPresets[selectedRegion].n, color: '#10B981' },
                    { label: 'P', value: regionPresets[selectedRegion].p, color: '#3B82F6' },
                    { label: 'K', value: regionPresets[selectedRegion].k, color: '#F59E0B' },
                    { label: 'pH', value: regionPresets[selectedRegion].ph, color: '#8B5CF6' },
                    { label: 'Temp', value: `${regionPresets[selectedRegion].temperature}°C`, color: '#EF4444' },
                    { label: 'Humid', value: `${regionPresets[selectedRegion].humidity}%`, color: '#14B8A6' },
                    { label: 'Rain', value: `${regionPresets[selectedRegion].rainfall}mm`, color: '#6366F1' },
                    { label: 'Moist', value: `${regionPresets[selectedRegion].moisture}%`, color: '#0EA5E9' },
                  ].map((badge, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                      background: `${badge.color}0A`, color: badge.color,
                      padding: '0.3rem 0.6rem', borderRadius: '2rem',
                      fontSize: '0.7rem', fontWeight: 700,
                      border: `1px solid ${badge.color}20`,
                    }}>
                      {badge.label}: {badge.value}
                    </span>
                  ))}
                </div>

                {/* Best Crops for Region */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{tLocal('Best Crops:')}</span>
                  {regionPresets[selectedRegion].crops.map((crop, i) => (
                    <span key={i} style={{
                      background: 'rgba(16,185,129,0.08)', color: '#059669',
                      padding: '0.25rem 0.6rem', borderRadius: '1rem',
                      fontSize: '0.7rem', fontWeight: 700,
                      border: '1px solid rgba(16,185,129,0.15)',
                    }}>
                      {crop}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ━━━ Crop Preset Picker ━━━ */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass"
          style={{ padding: '1.5rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
              <Sprout size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>{tLocal('Quick Fill — Crop Presets')}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{tLocal('Select a crop to auto-fill average soil & climate values')}</p>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <select
              value={selectedCrop}
              onChange={(e) => handleCropPreset(e.target.value)}
              style={{
                width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem',
                border: '1px solid var(--border)', background: 'var(--surface-alt)',
                color: selectedCrop ? 'var(--text-heading)' : 'var(--text-muted)',
                fontSize: '0.95rem', fontWeight: 600, outline: 'none', cursor: 'pointer',
                appearance: 'none',
              }}
            >
              {Object.keys(cropPresets).map(key => (
                <option key={key} value={key} style={{ color: 'var(--text-heading)', background: 'var(--surface)', padding: '8px' }}>
                  {key === '' ? t.analyze_choose_crop : (t[key] || cropPresets[key].label)}
                </option>
              ))}
            </select>
            <ChevronDown size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          </div>

          {/* Show NPK preview when a crop is selected */}
          <AnimatePresence>
            {selectedCrop && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ marginTop: '1rem' }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'N', value: cropPresets[selectedCrop].n, color: '#10B981' },
                    { label: 'P', value: cropPresets[selectedCrop].p, color: '#3B82F6' },
                    { label: 'K', value: cropPresets[selectedCrop].k, color: '#F59E0B' },
                    { label: 'pH', value: cropPresets[selectedCrop].ph, color: '#8B5CF6' },
                    { label: 'Temp', value: `${cropPresets[selectedCrop].temperature}°`, color: '#EF4444' },
                    { label: 'Rain', value: `${cropPresets[selectedCrop].rainfall}mm`, color: '#6366F1' },
                  ].map((badge, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      background: `${badge.color}12`, color: badge.color,
                      padding: '0.35rem 0.7rem', borderRadius: '2rem',
                      fontSize: '0.75rem', fontWeight: 700,
                      border: `1px solid ${badge.color}25`,
                    }}>
                      {badge.label}: {badge.value}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Applied toast */}
          <AnimatePresence>
            {presetApplied && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                ✅ {tLocal(`Values loaded for ${presetApplied}`)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ━━━ Parameter Cards Grid ━━━ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {parameters.map((param, i) => {
            const fillPct = getFillPct(param);
            const isActive = activeParam === param.name;

            return (
              <motion.div
                key={param.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                onMouseEnter={() => setActiveParam(param.name)}
                onMouseLeave={() => setActiveParam(null)}
                className="glass"
                style={{
                  padding: '1.25rem 1.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                  borderColor: isActive ? `${param.color}40` : undefined,
                  boxShadow: isActive ? `0 0 20px ${param.color}15` : undefined,
                }}
              >
                {/* Background fill bar */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${fillPct}%`,
                  background: `linear-gradient(90deg, ${param.color}08, ${param.color}12)`,
                  transition: 'width 0.3s ease',
                  pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Top row: icon + label + value */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${param.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: param.color }}>
                        {param.icon}
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.92rem' }}>{param.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: param.color }}>{formData[param.name]}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{param.unit}</span>
                    </div>
                  </div>

                  {/* Slider */}
                  <input
                    type="range"
                    name={param.name}
                    min={param.min}
                    max={param.max}
                    step={param.step || 1}
                    value={formData[param.name]}
                    onChange={handleChange}
                    style={{ width: '100%', accentColor: param.color, height: '6px', cursor: 'pointer' }}
                  />

                  {/* Min/Max + Hint */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{param.min}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{param.max}</span>
                  </div>

                  {/* Tooltip-style hint */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ fontSize: '0.75rem', color: param.color, marginTop: '0.5rem', marginBottom: 0, lineHeight: 1.4, fontWeight: 500 }}
                      >
                        💡 {param.hint}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ━━━ Action Buttons ━━━ */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '0.85rem 1.5rem', borderRadius: '1rem', fontWeight: 700, fontSize: '0.95rem',
              background: 'var(--surface)', border: '1px solid var(--border)',
              color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              transition: 'all 0.3s',
            }}
          >
            <RotateCcw size={16} /> {t.analyze_reset}
          </button>

          <button type="submit" className="btn-primary btn-glow" disabled={loading} style={{ padding: '0.85rem 3rem', fontSize: '1.05rem', minWidth: '250px' }}>
            {loading ? (
              <><Loader2 className="animate-spin" size={20} /> {t.analyze_analyzing}</>
            ) : (
              <><Cpu size={18} /> {t.analyze_submit}</>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Analyze;
