import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CloudSun, Calendar, Droplets, Globe, Landmark, FileText,
    Cpu, Satellite, CloudRain, Bug, FlaskConical, TrendingUp,
    ChevronDown, ChevronUp, ArrowRight, Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const features = [
    {
        category: 'Advanced Advisory Tools',
        icon: <Grid size={20} color="#2563EB" />,
        items: [
            { path: '/app/iot', title: 'IoT Telemetry', desc: 'Real-time sensor data & soil moisture', icon: <Cpu size={24} color="#1565C0" />, color: '#E3F2FD' },
            { path: '/app/satellite', title: 'Satellite GIS', desc: 'Sentinel-2 NDVI & crop health index', icon: <Satellite size={24} color="#6A1B9A" />, color: '#F3E5F5' },
            { path: '/app/irrigation', title: 'AI Smart Irrigation', desc: 'ET0 engine for weather-based scheduling', icon: <CloudRain size={24} color="#0277BD" />, color: '#E0F7FA' },
            { path: '/app/pest-detection', title: 'Pest Detection', desc: 'Vision AI for leaf disease diagnosis', icon: <Bug size={24} color="#C62828" />, color: '#FFEBEE' },
            { path: '/app/fertilizer', title: 'Fertilizer Optimizer', desc: 'Yield-targeted precision dosing', icon: <FlaskConical size={24} color="#EF6C00" />, color: '#FFF3E0' },
            { path: '/app/market', title: 'Market Forecast', desc: '30-day Mandi price predictions', icon: <TrendingUp size={24} color="#2E7D32" />, color: '#E8F5E9' },
        ]
    },
    {
        category: 'New Intelligence Modules',
        icon: <Globe size={20} color="#10B981" />,
        items: [
            { path: '/app/weather', title: 'Weather Intelligence', desc: 'Microclimate forecasting & ESG climate risk', icon: <CloudSun size={24} color="#0EA5E9" />, color: '#E0F2FE' },
            { path: '/app/crop-calendar', title: 'Smart Crop Calendar', desc: 'Seasonal sowing & growth timeline planner', icon: <Calendar size={24} color="#16A34A" />, color: '#DCFCE7' },
            { path: '/app/water-footprint', title: 'Water Footprint', desc: 'Irrigation efficiency & aquifier stress', icon: <Droplets size={24} color="#2563EB" />, color: '#DBEAFE' },
            { path: '/app/sustainability', title: 'Regenerative ESG', desc: 'Carbon sequestering & compliance audit', icon: <Globe size={24} color="#059669" />, color: '#D1FAE5' },
            { path: '/app/gov-schemes', title: 'Govt Schemes', desc: 'Subsidy matching & financial assistance', icon: <Landmark size={24} color="#D97706" />, color: '#FEF3C7' },
            { path: '/app/export-reports', title: 'Export Reports', desc: 'Downloadable PDFs & raw CSV datasets', icon: <FileText size={24} color="#7C3AED" />, color: '#EDE9FE' },
        ]
    }
];

export default function MoreFeatures() {
    const navigate = useNavigate();
    const [openSections, setOpenSections] = useState({ 0: true, 1: true });

    const toggleSection = (idx) => {
        setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    return (
        <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '1.5rem 1rem' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-heading)', margin: '0 0 0.5rem 0' }}>
                    Explore More Features
                </h1>
                <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0 }}>
                    Unlock the full potential of KrishiMitra's AI intelligence modules
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {features.map((section, idx) => (
                    <div key={idx} style={{ background: '#FFFFFF', borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', overflow: 'hidden' }}>

                        {/* Accordion Header */}
                        <button
                            onClick={() => toggleSection(idx)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1.25rem 1.5rem',
                                background: '#F8FAFC',
                                border: 'none',
                                borderBottom: openSections[idx] ? '1px solid #E2E8F0' : 'none',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ background: 'white', padding: '0.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                    {section.icon}
                                </div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                                    {section.category}
                                </h2>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                                    {section.items.length} Modules
                                </span>
                                {openSections[idx] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </button>

                        {/* Accordion Content */}
                        <AnimatePresence>
                            {openSections[idx] && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
                                        {section.items.map((item, i) => (
                                            <div
                                                key={i}
                                                onClick={() => navigate(item.path)}
                                                style={{
                                                    background: '#FFFFFF',
                                                    border: '1px solid #E2E8F0',
                                                    borderRadius: '0.75rem',
                                                    padding: '1.2rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    transition: 'all 0.2s',
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = '#93C5FD';
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.05)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = '#E2E8F0';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.02)';
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                                    <div style={{ background: item.color, padding: '0.6rem', borderRadius: '0.5rem' }}>
                                                        {item.icon}
                                                    </div>
                                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                                                        {item.title}
                                                    </h3>
                                                </div>
                                                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.4, margin: '0 0 1rem 0', flex: 1 }}>
                                                    {item.desc}
                                                </p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 700, color: '#3B82F6' }}>
                                                    Launch Module <ArrowRight size={16} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                ))}
            </div>

        </div>
    );
}
