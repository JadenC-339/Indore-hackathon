import React, { useState } from 'react';
import { FileText, Download, FileSpreadsheet, CheckCircle, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExportReports() {
    const [downloading, setDownloading] = useState(null);

    const reports = [
        { id: 'soil', title: 'Soil Health & NPK History', type: 'PDF', size: '1.2 MB', desc: 'Comprehensive history of all soil tests, AI predictions, and quality trends.' },
        { id: 'water', title: 'Water Usage & Efficiency Audit', type: 'CSV', size: '0.4 MB', desc: 'Raw data export of all irrigation events, water usage, and ET0 parameters.' },
        { id: 'sustain', title: 'Sustainability & ESG Report', type: 'PDF', size: '2.1 MB', desc: 'Farm carbon footprint, biodiversity score, and compliance metrics for carbon credits.' },
        { id: 'market', title: 'Mandi Price Forecast Extract', type: 'CSV', size: '0.8 MB', desc: '30-day historical and predicted price datasets for all tracked crops.' },
    ];

    const handleDownload = (r) => {
        setDownloading(r.id);

        // Simulate generation time for realistic UX
        setTimeout(() => {
            let content, filename, type;

            if (r.type === 'CSV') {
                // Generate a dummy CSV content based on report type
                content = r.id === 'water' ?
                    "Date,ET0,Zone,Irrigation Applied (L),Saved (L)\n2025-10-01,4.2,A,450,150\n2025-10-02,4.1,A,440,160\n" :
                    "Date,Crop,Mandi,Price/Qtl,Predicted/Qtl\n2025-10-01,Wheat,Indore,2250,2300\n2025-10-02,Wheat,Indore,2260,2315\n";
                filename = `${r.id}_extract_${new Date().toISOString().split('T')[0]}.csv`;
                type = 'text/csv';
            } else {
                // Generate a very rudimentary dummy textual 'PDF' for demonstration purposes
                // (In a real app, a library like jsPDF would be used)
                content = `KrishiMitra Automated Export\n---------------------------------\nReport Title: ${r.title}\nDescription: ${r.desc}\nGenerated At: ${new Date().toLocaleString()}\n\n[End of Document]`;
                filename = `${r.id}_report_${new Date().toISOString().split('T')[0]}.txt`; // downloading as txt for simplicity in demo
                type = 'text/plain';
            }

            const blob = new Blob([content], { type });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setDownloading(null);
        }, 1500);
    };

    return (
        <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '1.5rem 1rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', padding: '0.6rem', borderRadius: '0.75rem', color: 'white' }}>
                        <FileText size={28} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                            Export Reports & Data
                        </h1>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                            Generate compliance-ready PDF reports and raw CSV data extracts
                        </p>
                    </div>
                </div>
                <div style={{ background: '#F5F3FF', color: '#6D28D9', padding: '0.4rem 0.8rem', borderRadius: '0.6rem', fontWeight: 700, fontSize: '0.82rem', border: '1px solid #EDE9FE' }}>
                    <Database size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Data synced
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {reports.map(r => (
                    <motion.div
                        key={r.id}
                        whileHover={{ y: -4 }}
                        style={{ background: '#FFFFFF', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ background: '#F8FAFC', padding: '0.8rem', borderRadius: '0.75rem' }}>
                                {r.type === 'PDF' ? <FileText size={32} color="#EF4444" /> : <FileSpreadsheet size={32} color="#10B981" />}
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', background: '#F1F5F9', padding: '0.2rem 0.5rem', borderRadius: '0.4rem' }}>
                                {r.type} • {r.size}
                            </span>
                        </div>

                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', margin: '0 0 0.5rem 0' }}>{r.title}</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 1.5rem 0', flex: 1 }}>{r.desc}</p>

                        <button
                            onClick={() => handleDownload(r)}
                            disabled={downloading === r.id}
                            style={{
                                width: '100%',
                                background: downloading === r.id ? '#F1F5F9' : '#F5F3FF',
                                color: downloading === r.id ? '#64748B' : '#7C3AED',
                                border: `1px solid ${downloading === r.id ? '#E2E8F0' : '#DDD6FE'}`,
                                padding: '0.75rem',
                                borderRadius: '0.6rem',
                                fontWeight: 700,
                                cursor: downloading === r.id ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {downloading === r.id ? (
                                <>Generating... ⏳</>
                            ) : (
                                <><Download size={18} /> Generate & Download</>
                            )}
                        </button>
                    </motion.div>
                ))}
            </div>

        </div>
    );
}
