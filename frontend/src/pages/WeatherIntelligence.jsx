import React, { useState, useEffect } from 'react';
import { CloudSun, Thermometer, Droplets, Wind, AlertTriangle, ShieldCheck, Eye, Umbrella, Sun, CloudRain, CloudSnow, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from 'recharts';

// Simulated weather data
const generateWeatherData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Thunderstorm', 'Sunny', 'Clear'];
    const icons = ['☀️', '⛅', '☁️', '🌧️', '⛈️', '☀️', '🌙'];

    return days.map((day, i) => ({
        day,
        condition: conditions[i],
        icon: icons[i],
        temp_high: Math.round(28 + Math.random() * 10),
        temp_low: Math.round(18 + Math.random() * 6),
        humidity: Math.round(45 + Math.random() * 40),
        wind_kmh: Math.round(5 + Math.random() * 25),
        rain_chance: Math.round(Math.random() * 100),
        uv_index: Math.round(3 + Math.random() * 8),
        pressure_hpa: Math.round(1008 + Math.random() * 15),
    }));
};

const generateHourlyData = () => {
    const hours = [];
    for (let h = 6; h <= 22; h++) {
        hours.push({
            time: `${h}:00`,
            temp: Math.round(20 + Math.sin((h - 6) / 16 * Math.PI) * 14),
            humidity: Math.round(70 - Math.sin((h - 6) / 16 * Math.PI) * 30),
            solar: Math.round(Math.max(0, Math.sin((h - 6) / 16 * Math.PI) * 900)),
        });
    }
    return hours;
};

const alerts = [
    { id: 1, severity: 'warning', title: 'Heat Wave Advisory', desc: 'Temperatures expected to exceed 40°C on Thursday. Protect crops with mulching and increase irrigation frequency.', time: '2 hours ago', color: '#F59E0B' },
    { id: 2, severity: 'info', title: 'Monsoon Onset Expected', desc: 'Southwest monsoon likely to arrive in your region within 5-7 days. Prepare drainage channels.', time: '6 hours ago', color: '#3B82F6' },
    { id: 3, severity: 'success', title: 'Favorable Sowing Window', desc: 'Soil moisture and temperature conditions are optimal for Rabi crop sowing this week.', time: '12 hours ago', color: '#10B981' },
];

const climateRisk = [
    { factor: 'Drought Risk', score: 22, status: 'Low', color: '#10B981' },
    { factor: 'Flood Risk', score: 45, status: 'Moderate', color: '#F59E0B' },
    { factor: 'Frost Risk', score: 8, status: 'Very Low', color: '#10B981' },
    { factor: 'Heat Stress', score: 65, status: 'High', color: '#EF4444' },
    { factor: 'Wind Damage', score: 18, status: 'Low', color: '#10B981' },
];

export default function WeatherIntelligence() {
    const [forecast] = useState(generateWeatherData());
    const [hourly] = useState(generateHourlyData());
    const [selectedDay, setSelectedDay] = useState(0);

    return (
        <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '1.5rem 1rem' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, #0EA5E9, #0284C7)', padding: '0.6rem', borderRadius: '0.75rem', color: 'white' }}>
                        <CloudSun size={28} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                            Weather Intelligence Center
                        </h1>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                            AI-powered microclimate forecasting, alerts & agricultural weather advisory
                        </p>
                    </div>
                </div>
                <div style={{ background: '#E0F2FE', color: '#0284C7', padding: '0.4rem 0.8rem', borderRadius: '0.6rem', fontWeight: 700, fontSize: '0.82rem', border: '1px solid #BAE6FD' }}>
                    📍 Nashik Region • Last Updated: 10 min ago
                </div>
            </div>

            {/* Current Conditions Banner */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 50%, #38BDF8 100%)',
                    borderRadius: '1.2rem',
                    padding: '2rem',
                    color: 'white',
                    boxShadow: '0 10px 30px rgba(14, 165, 233, 0.25)',
                    marginBottom: '2rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
                    <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>
                            Right Now — {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div style={{ fontSize: '4rem', fontWeight: 900, margin: '0.3rem 0' }}>
                            {forecast[0]?.temp_high}°C
                        </div>
                        <p style={{ opacity: 0.9, fontSize: '1rem', margin: 0 }}>
                            {forecast[0]?.icon} {forecast[0]?.condition}
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                        {[
                            { label: 'Humidity', value: `${forecast[0]?.humidity}%`, icon: <Droplets size={16} /> },
                            { label: 'Wind', value: `${forecast[0]?.wind_kmh} km/h`, icon: <Wind size={16} /> },
                            { label: 'UV Index', value: `${forecast[0]?.uv_index}/11`, icon: <Sun size={16} /> },
                            { label: 'Pressure', value: `${forecast[0]?.pressure_hpa} hPa`, icon: <Eye size={16} /> },
                        ].map((item, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.8rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', opacity: 0.85, marginBottom: '0.2rem' }}>
                                    {item.icon} {item.label}
                                </div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{item.value}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Zap size={14} /> Agricultural Advisory
                        </div>
                        <p style={{ fontSize: '0.85rem', opacity: 0.95, lineHeight: 1.5, margin: 0 }}>
                            Favorable conditions for field operations today. Optimal spraying window: 6:00 AM – 9:00 AM. Avoid noon irrigation due to high evapotranspiration.
                        </p>
                    </div>
                </div>

                <CloudSun size={200} style={{ position: 'absolute', right: '-30px', bottom: '-50px', opacity: 0.08, pointerEvents: 'none' }} />
            </motion.div>

            {/* 7-Day Forecast Cards */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-heading)', margin: '0 0 1rem 0' }}>
                    7-Day Agricultural Forecast
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.6rem' }}>
                    {forecast.map((day, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -4 }}
                            onClick={() => setSelectedDay(idx)}
                            style={{
                                background: selectedDay === idx ? 'linear-gradient(135deg, #0369A1, #0EA5E9)' : '#FFFFFF',
                                color: selectedDay === idx ? 'white' : 'var(--text-heading)',
                                borderRadius: '1rem',
                                padding: '1rem 0.5rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                border: selectedDay === idx ? 'none' : '1px solid rgba(0,0,0,0.07)',
                                boxShadow: selectedDay === idx ? '0 4px 15px rgba(14,165,233,0.3)' : '0 2px 8px rgba(0,0,0,0.03)',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{day.day}</div>
                            <div style={{ fontSize: '1.8rem', margin: '0.3rem 0' }}>{day.icon}</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                                {day.temp_high}°
                            </div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{day.temp_low}°</div>
                            <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', fontWeight: 700, opacity: 0.85 }}>
                                💧 {day.rain_chance}%
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

                {/* Hourly Temperature & Humidity Chart */}
                <div style={{ background: '#FFFFFF', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                            Hourly Forecast — {forecast[selectedDay]?.day}
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: '#0284C7', fontWeight: 700, background: '#E0F2FE', padding: '0.2rem 0.5rem', borderRadius: '0.4rem' }}>
                            Temp & Humidity
                        </span>
                    </div>
                    <div style={{ width: '100%', height: '260px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={hourly}>
                                <defs>
                                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                                <XAxis dataKey="time" stroke="#888" style={{ fontSize: '0.75rem' }} />
                                <YAxis stroke="#888" style={{ fontSize: '0.75rem' }} />
                                <Tooltip contentStyle={{ borderRadius: '0.6rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="temp" stroke="#EF4444" strokeWidth={2.5} fill="url(#tempGrad)" name="Temperature (°C)" />
                                <Area type="monotone" dataKey="humidity" stroke="#3B82F6" strokeWidth={2} fill="url(#humGrad)" name="Humidity (%)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Solar Radiation Chart */}
                <div style={{ background: '#FFFFFF', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                            Solar Radiation (W/m²)
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700, background: '#FEF3C7', padding: '0.2rem 0.5rem', borderRadius: '0.4rem' }}>
                            Peak: {Math.max(...hourly.map(h => h.solar))} W/m²
                        </span>
                    </div>
                    <div style={{ width: '100%', height: '260px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourly}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                                <XAxis dataKey="time" stroke="#888" style={{ fontSize: '0.75rem' }} />
                                <YAxis stroke="#888" style={{ fontSize: '0.75rem' }} />
                                <Tooltip contentStyle={{ borderRadius: '0.6rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="solar" name="Solar (W/m²)" radius={[4, 4, 0, 0]}>
                                    {hourly.map((entry, i) => (
                                        <Cell key={i} fill={entry.solar > 600 ? '#F59E0B' : entry.solar > 300 ? '#FBBF24' : '#FDE68A'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Alerts & Climate Risk */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

                {/* Weather Alerts */}
                <div style={{ background: '#FFFFFF', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', margin: '0 0 1rem 0' }}>
                        ⚡ Weather Alerts & Advisories
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {alerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '0.85rem',
                                    background: `${alert.color}08`,
                                    border: `1px solid ${alert.color}25`,
                                    borderLeft: `4px solid ${alert.color}`,
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                                        {alert.title}
                                    </h4>
                                    <span style={{ fontSize: '0.7rem', color: '#888', whiteSpace: 'nowrap' }}>{alert.time}</span>
                                </div>
                                <p style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.5, margin: 0 }}>
                                    {alert.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Climate Risk Assessment */}
                <div style={{ background: '#FFFFFF', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', margin: '0 0 1rem 0' }}>
                        🛡️ Climate Risk Assessment
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {climateRisk.map((risk, idx) => (
                            <div key={idx}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-heading)' }}>{risk.factor}</span>
                                    <span style={{
                                        fontSize: '0.75rem', fontWeight: 800,
                                        background: `${risk.color}15`,
                                        color: risk.color,
                                        padding: '0.15rem 0.5rem',
                                        borderRadius: '0.4rem'
                                    }}>
                                        {risk.status}
                                    </span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${risk.score}%` }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                        style={{
                                            height: '100%',
                                            background: `linear-gradient(90deg, ${risk.color}80, ${risk.color})`,
                                            borderRadius: '4px'
                                        }}
                                    />
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '0.15rem', textAlign: 'right' }}>
                                    {risk.score}/100
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#F0FDF4', borderRadius: '0.75rem', border: '1px solid #BBF7D0' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534', marginBottom: '0.3rem' }}>
                            🌿 Overall Climate Resilience Score
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#15803D' }}>
                            72<span style={{ fontSize: '1rem', color: '#22C55E' }}>/100 — Good</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
