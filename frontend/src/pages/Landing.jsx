import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import {
  Leaf, ChevronRight, Droplets, Thermometer, Sprout, BarChart3,
  Zap, Globe, Play, FlaskConical, BrainCircuit, MessageSquare,
  ShieldCheck, TrendingUp, Users, Smartphone, ArrowDown, Wheat,
  SunMedium, CloudRain, Microscope,
} from 'lucide-react';

/* ──────── Unsplash Parallax Backgrounds ──────── */
const BG = {
  hero: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80',     // golden wheat field
  soil: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=1920&q=80',     // close-up soil
  ai:   'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',     // tech/data glow
  sms:  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80',     // phone in farm
  farm: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80',     // lush green paddy
};

/* ──────── Parallax Section Component ──────── */
const ParallaxSection = ({ bgUrl, overlayColor, children, id, minHeight = '100vh' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  return (
    <section ref={ref} id={id} style={{ position: 'relative', minHeight, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Parallax BG */}
      <motion.div style={{
        y,
        position: 'absolute', inset: '-20% 0', zIndex: 0,
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        willChange: 'transform',
      }} />
      {/* Warm overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: overlayColor || 'linear-gradient(180deg, rgba(250,250,245,0.85) 0%, rgba(250,250,245,0.92) 100%)',
      }} />
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '6rem 1.5rem' }}>
        {children}
      </div>
    </section>
  );
};

/* ──────── Stats Data ──────── */
const stats = [
  { value: '96%', label: 'Model Accuracy', icon: <BarChart3 size={20} /> },
  { value: '22+',   label: 'Crop Types',     icon: <Sprout size={20} /> },
  { value: '9',     label: 'Languages',      icon: <Globe size={20} /> },
  { value: '<2s',   label: 'Response Time',   icon: <Zap size={20} /> },
];

/* ──────── Feature Cards Data ──────── */
const soilFeatures = [
  { icon: <FlaskConical size={28} />, title: 'N-P-K Analysis',       desc: 'Accurate nitrogen, phosphorus & potassium measurement from your field samples or FPGA sensors.', color: '#10B981' },
  { icon: <Thermometer size={28} />,  title: 'pH & Moisture',        desc: 'Precise pH level detection and soil moisture content to determine optimal planting conditions.', color: '#3B82F6' },
  { icon: <CloudRain size={28} />,    title: 'Climate Integration',  desc: 'Rainfall, temperature and humidity data factored into every recommendation for your region.', color: '#8B5CF6' },
  { icon: <Microscope size={28} />,   title: 'Health Scoring',       desc: 'Overall soil quality score from Excellent to Poor — so you know exactly where your field stands.', color: '#F59E0B' },
];

const aiFeatures = [
  { icon: <BrainCircuit size={28} />, title: 'Ensemble ML Model',    desc: 'XGBoost + Random Forest VotingClassifier trained on 2,200+ soil samples for maximum accuracy.' },
  { icon: <Wheat size={28} />,        title: 'Crop Matching',        desc: 'Instantly recommends the best-fit crops — rice, wheat, cotton, jute, coffee & 22+ more.' },
  { icon: <TrendingUp size={28} />,   title: 'Improvement Tips',     desc: 'Actionable fertilizer, irrigation and soil amendment suggestions tailored to your parameters.' },
  { icon: <SunMedium size={28} />,    title: 'Seasonal Guidance',    desc: 'Climate-aware advice that adapts to your region\'s monsoon patterns and growing seasons.' },
];

const benefits = [
  { emoji: '💰', title: 'Save Money',           desc: 'Stop guessing — apply only the fertilizers your soil actually needs.' },
  { emoji: '📈', title: 'Increase Yield',        desc: 'Data-driven crop selection can boost harvest by up to 30%.' },
  { emoji: '🌍', title: 'Protect the Land',      desc: 'Avoid over-fertilization, preserve soil health for future generations.' },
  { emoji: '⚡', title: 'Instant Results',        desc: 'Get complete analysis in under 2 seconds — no lab wait times.' },
  { emoji: '📱', title: 'Mobile Friendly',        desc: 'Use from any phone, anywhere in the field. Works on slow connections.' },
  { emoji: '🗣️', title: '9 Languages',           desc: 'Receive reports in Hindi, Tamil, Telugu, Bengali, Marathi & more.' },
];

/* ──────── Fade-up animation helper ──────── */
const fadeUp = (delay = 0) => ({
  initial: { y: 50, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, delay, ease: 'easeOut' },
});

/* ════════════════════════════════════════════════════════ */
/* ═══                  LANDING PAGE                   ═══ */
/* ════════════════════════════════════════════════════════ */

const Landing = () => {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroTextY = useTransform(heroScroll, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-color)' }}>

      {/* ─── Smooth scroll CSS ─── */}
      <style>{`html { scroll-behavior: smooth; }`}</style>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ██  NAVBAR
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', padding: '0.9rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 100, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Leaf color="var(--primary)" size={26} />
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '1px' }}>
            Krishi<span style={{ color: 'var(--primary)' }}>Mitra</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="#soil-analysis" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700, transition: 'color 0.3s' }}>Analysis</a>
          <a href="#ai-insights"   style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700, transition: 'color 0.3s' }}>AI Insights</a>
          <a href="#sms-alerts"    style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700, transition: 'color 0.3s' }}>SMS Alerts</a>
          <a href="#benefits"      style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700, transition: 'color 0.3s' }}>Benefits</a>
          <Link to="/login" className="btn-primary" style={{ padding: '0.55rem 1.4rem', fontSize: '0.88rem' }}>
            Get Started <ChevronRight size={15} />
          </Link>
        </div>
      </nav>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ██  HERO — Full-screen parallax
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section ref={heroRef} style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Parallax BG image */}
        <motion.div style={{
          y: useTransform(heroScroll, [0, 1], ['0%', '30%']),
          position: 'absolute', inset: '-20% 0', zIndex: 0,
          backgroundImage: `url(${BG.hero})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        {/* Gradient overlay for readability */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(250,250,245,0.75) 50%, rgba(250,250,245,1) 100%)' }} />

        {/* Hero Content */}
        <motion.div style={{ y: heroTextY, opacity: heroOpacity, position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '900px', padding: '0 1.5rem' }}>
          <motion.div {...fadeUp(0)}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'rgba(46,125,50,0.08)', border: '1px solid rgba(46,125,50,0.15)',
              padding: '0.5rem 1.25rem', borderRadius: '2rem',
              color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.5px',
            }}>
              <Zap size={14} /> Ensemble ML • 96% Accuracy
            </span>
          </motion.div>

          <motion.h1 {...fadeUp(0.15)} className="heading" style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', lineHeight: 1.05, margin: '1.5rem 0', color: 'var(--text-heading)' }}>
            Smarter Soil,<br />
            <span className="text-gradient">Bigger Harvests.</span>
          </motion.h1>

          <motion.p {...fadeUp(0.3)} className="subheading" style={{ maxWidth: '620px', margin: '0 auto 2.5rem auto', fontSize: '1.15rem' }}>
            Upload your soil parameters. Our AI analyzes nitrogen, pH, moisture & more —
            then recommends the perfect crops, fertilizers, and irrigation strategies in seconds.
          </motion.p>

          <motion.div {...fadeUp(0.45)} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn-primary btn-glow" style={{ padding: '1.1rem 2.5rem', fontSize: '1.1rem' }}>
              Start Analysis <ChevronRight size={18} />
            </Link>
            <a href="#video-section" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '1.1rem 1.5rem', borderRadius: '1rem',
              background: 'white', color: 'var(--text-heading)',
              border: '1px solid rgba(0,0,0,0.1)',
              textDecoration: 'none', fontWeight: 700, fontSize: '1.05rem', transition: 'all 0.3s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <Play size={18} /> Watch Demo
            </a>
          </motion.div>
        </motion.div>

        {/* Animated scroll indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
        >
          <ArrowDown size={22} color="rgba(255,255,255,0.3)" />
        </motion.div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ██  STATS BAR
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div {...fadeUp()} style={{ maxWidth: '900px', margin: '-3rem auto 0 auto', position: 'relative', zIndex: 20, padding: '0 1.5rem' }}>
        <div className="glass" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '2rem' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '0.4rem', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-heading)' }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ██  SECTION 1 — SOIL ANALYSIS  (Parallax)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <ParallaxSection
        id="soil-analysis"
        bgUrl={BG.soil}
        overlayColor="linear-gradient(180deg, rgba(250,250,245,0.97) 0%, rgba(250,250,245,0.92) 30%, rgba(250,250,245,0.92) 70%, rgba(250,250,245,0.97) 100%)"
        minHeight="auto"
      >
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
            padding: '0.4rem 1rem', borderRadius: '2rem',
            color: '#10B981', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '1rem',
          }}>
            <FlaskConical size={14} /> SOIL ANALYSIS
          </span>
          <h2 className="heading" style={{ fontSize: '2.8rem' }}>
            Know Your Soil, <span className="text-gradient">Inside Out.</span>
          </h2>
          <p className="subheading" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Our system analyzes 8 critical soil parameters to give you a complete understanding of your field's health.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {soilFeatures.map((f, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)} whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="glass" style={{ padding: '2rem 1.5rem', cursor: 'default', borderTop: `2px solid ${f.color}22` }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: '0.8rem',
                background: `${f.color}15`, border: `1px solid ${f.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: f.color, marginBottom: '1rem',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </ParallaxSection>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ██  SECTION 2 — AI INSIGHTS  (Parallax)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <ParallaxSection
        id="ai-insights"
        bgUrl={BG.ai}
        overlayColor="linear-gradient(180deg, rgba(250,250,245,0.97) 0%, rgba(250,250,245,0.92) 30%, rgba(250,250,245,0.92) 70%, rgba(250,250,245,0.97) 100%)"
        minHeight="auto"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* Left: text */}
          <div>
            <motion.div {...fadeUp()}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
                padding: '0.4rem 1rem', borderRadius: '2rem',
                color: '#3B82F6', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '1rem',
              }}>
                <BrainCircuit size={14} /> AI INSIGHTS
              </span>
              <h2 className="heading" style={{ fontSize: '2.8rem' }}>
                Powered by <span style={{ background: 'linear-gradient(to right, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Intelligence.</span>
              </h2>
              <p className="subheading" style={{ fontSize: '1.05rem' }}>
                Our ensemble machine learning model combines XGBoost and Random Forest to deliver
                research-grade predictions at the speed of thought.
              </p>
            </motion.div>

            {/* Accuracy meter */}
            <motion.div {...fadeUp(0.2)} className="glass" style={{ padding: '1.25rem', marginTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Model Accuracy</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#10B981' }}>96%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '96%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                  style={{ height: '100%', background: 'linear-gradient(to right, #10B981, #3B82F6)', borderRadius: '4px' }}
                />
              </div>
            </motion.div>
          </div>

          {/* Right: feature cards stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {aiFeatures.map((f, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} whileHover={{ x: 8, transition: { duration: 0.2 } }}
                className="glass" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'default' }}
              >
                <div style={{
                  flexShrink: 0, width: '46px', height: '46px', borderRadius: '0.7rem',
                  background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6',
                }}>
                  {f.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.2rem' }}>{f.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ██  SECTION 3 — SMS ALERTS  (Parallax)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <ParallaxSection
        id="sms-alerts"
        bgUrl={BG.sms}
        overlayColor="linear-gradient(180deg, rgba(250,250,245,0.97) 0%, rgba(250,250,245,0.92) 30%, rgba(250,250,245,0.92) 70%, rgba(250,250,245,0.97) 100%)"
        minHeight="auto"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* Left: phone mockup */}
          <motion.div {...fadeUp()} style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '280px', borderRadius: '2rem',
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.08)',
              padding: '1.5rem', boxShadow: '0 25px 60px -12px rgba(0,0,0,0.12)',
            }}>
              {/* Phone top bar */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <div style={{ width: '80px', height: '4px', borderRadius: '2px', background: 'rgba(0,0,0,0.08)' }} />
              </div>

              {/* SMS bubbles */}
              {[
                { text: '🌱 SoilAI Alert: Your soil analysis is ready!', time: '10:30 AM', color: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', textColor: '#065F46' },
                { text: '🌾 Recommended: Rice, Wheat. Soil Quality: Good.', time: '10:30 AM', color: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', textColor: '#1E3A5F' },
                { text: '💧 Tip: Apply 20kg/acre Urea for better nitrogen levels.', time: '10:31 AM', color: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.25)', textColor: '#4C1D95' },
              ].map((msg, i) => (
                <motion.div key={i} {...fadeUp(0.2 + i * 0.15)}
                  style={{
                    background: msg.color, border: `1px solid ${msg.border}`,
                    borderRadius: '0.8rem', padding: '0.75rem 1rem', marginBottom: '0.75rem',
                  }}
                >
                  <p style={{ fontSize: '0.78rem', color: msg.textColor, lineHeight: 1.5, margin: 0, fontWeight: 600 }}>{msg.text}</p>
                  <span style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.3rem', display: 'block' }}>{msg.time}</span>
                </motion.div>
              ))}

              {/* Phone bottom bar */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <div style={{ width: '100px', height: '4px', borderRadius: '2px', background: 'rgba(0,0,0,0.06)' }} />
              </div>
            </div>
          </motion.div>

          {/* Right: content */}
          <motion.div {...fadeUp(0.1)}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)',
              padding: '0.4rem 1rem', borderRadius: '2rem',
              color: '#A855F7', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '1rem',
            }}>
              <MessageSquare size={14} /> SMS ALERTS
            </span>
            <h2 className="heading" style={{ fontSize: '2.8rem' }}>
              Results Straight to Your <span style={{ background: 'linear-gradient(to right, #A855F7, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Phone.</span>
            </h2>
            <p className="subheading" style={{ fontSize: '1.05rem', marginBottom: '2rem' }}>
              No internet needed after analysis. We send your complete soil report, crop recommendations
              and improvement tips directly via SMS — in your preferred language.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: <Smartphone size={20} />, title: 'Works on Any Phone', desc: 'Basic feature phones to smartphones — SMS reaches everyone.' },
                { icon: <Globe size={20} />,      title: '9 Regional Languages', desc: 'Hindi, Tamil, Telugu, Bengali, Marathi, Kannada & more.' },
                { icon: <ShieldCheck size={20} />, title: 'Fast2SMS Powered',    desc: 'Reliable, instant delivery through India\'s trusted SMS gateway.' },
              ].map((item, i) => (
                <motion.div key={i} {...fadeUp(0.2 + i * 0.1)}
                  style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
                >
                  <div style={{
                    flexShrink: 0, width: '38px', height: '38px', borderRadius: '0.6rem',
                    background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A855F7',
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.15rem' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </ParallaxSection>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ██  SECTION 4 — FARMER BENEFITS  (Parallax)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <ParallaxSection
        id="benefits"
        bgUrl={BG.farm}
        overlayColor="linear-gradient(180deg, rgba(250,250,245,0.97) 0%, rgba(250,250,245,0.92) 30%, rgba(250,250,245,0.92) 70%, rgba(250,250,245,0.97) 100%)"
        minHeight="auto"
      >
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)',
            padding: '0.4rem 1rem', borderRadius: '2rem',
            color: '#F59E0B', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '1rem',
          }}>
            <Users size={14} /> FARMER BENEFITS
          </span>
          <h2 className="heading" style={{ fontSize: '2.8rem' }}>
            Built for the <span className="text-gradient">Indian Farmer.</span>
          </h2>
          <p className="subheading" style={{ maxWidth: '550px', margin: '0 auto' }}>
            Every feature designed with farmers in mind — simple, fast, and genuinely useful.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {benefits.map((b, i) => (
            <motion.div key={i} {...fadeUp(i * 0.08)} whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="glass" style={{ padding: '1.5rem', cursor: 'default', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
            >
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{b.emoji}</span>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>{b.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </ParallaxSection>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ██  VIDEO SECTION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="video-section" style={{ padding: '6rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="heading" style={{ fontSize: '2.5rem' }}>
            See It In <span className="text-gradient">Action</span>
          </h2>
          <p className="subheading">Watch how AI-powered soil analysis transforms modern farming.</p>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="animate-float" style={{ animationDuration: '8s' }}>
          <div className="glass" style={{ padding: '0.5rem', overflow: 'hidden', position: 'relative' }}>
            <div style={{ borderRadius: 'calc(var(--radius) - 0.25rem)', overflow: 'hidden' }}>
              <video
                src="/landing_video.mp4"
                controls
                autoPlay
                muted
                loop
                playsInline
                style={{ width: '100%', display: 'block', borderRadius: 'calc(var(--radius) - 0.25rem)' }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ██  HOW IT WORKS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="heading" style={{ fontSize: '2.5rem' }}>
            How It <span className="text-gradient">Works</span>
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[
            { step: '01', icon: <Droplets size={24} />, title: 'Input Soil Parameters',     desc: 'Enter nitrogen, phosphorus, potassium, pH, temperature, humidity and rainfall values from your field tests or FPGA sensors.' },
            { step: '02', icon: <BrainCircuit size={24} />, title: 'AI Ensemble Analysis',  desc: 'Our VotingClassifier (XGBoost + Random Forest) processes your data in milliseconds to determine soil quality and best-fit crops.' },
            { step: '03', icon: <Sprout size={24} />, title: 'Smart Recommendations',       desc: 'Get instant crop suggestions, fertilizer tips, and irrigation schedules. Share results via SMS directly to farmers in 9 languages.' },
          ].map((item, i) => (
            <motion.div key={i} {...fadeUp(i * 0.15)}
              className="glass" style={{ padding: '1.5rem 2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}
            >
              <div style={{
                flexShrink: 0, width: '60px', height: '60px', borderRadius: '1rem',
                background: 'linear-gradient(135deg, var(--primary), #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', position: 'relative',
              }}>
                {item.icon}
                <span style={{
                  position: 'absolute', top: '-8px', right: '-8px',
                  background: 'white', border: '2px solid var(--primary)', borderRadius: '50%',
                  width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)',
                }}>{item.step}</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.3rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ██  FINAL CTA
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: '5rem 1.5rem 6rem 1.5rem', textAlign: 'center', position: 'relative' }}>
        {/* Glow orbs */}
        <div className="animate-float" style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div className="animate-float" style={{ position: 'absolute', bottom: '10%', right: '10%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter: 'blur(60px)', animationDelay: '3s', pointerEvents: 'none' }} />

        <motion.div {...fadeUp()} style={{ position: 'relative', zIndex: 10 }}>
          <h2 className="heading" style={{ fontSize: '2.8rem', maxWidth: '700px', margin: '0 auto 1rem auto' }}>
            Ready to <span className="text-gradient">Transform</span> Your Farm?
          </h2>
          <p className="subheading" style={{ maxWidth: '500px', margin: '0 auto 2.5rem auto' }}>
            Join the precision agriculture revolution. Your soil deserves intelligence.
          </p>
          <Link to="/login" className="btn-primary btn-glow" style={{ padding: '1.2rem 3rem', fontSize: '1.15rem' }}>
            Get Started Free <ChevronRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ██  FOOTER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        © 2026 KrishiMitra — Intelligent Agriculture Platform. Built with 🌱 and ML.
      </div>
    </div>
  );
};

export default Landing;
