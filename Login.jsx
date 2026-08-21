import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, Shield, ArrowRight, Leaf, CheckCircle2, AlertCircle, Loader2, RefreshCw, User, MapPin } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://krishimitra-backend-wrc0.onrender.com';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'signup'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const otpRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  // Redirect if already logged in
  useEffect(() => {
    const farmer = localStorage.getItem('soilai_farmer');
    if (farmer) {
      navigate('/app/analyze', { replace: true });
    }
  }, [navigate]);

  // AI Voice Auto-Fill Listener
  useEffect(() => {
    const handleAutoFill = (e) => {
      const num = e.detail;
      setPhone(num);
      setError('');
      if (document.getElementById('phone-input')) {
         document.getElementById('phone-input').focus();
         // Small UX improvement: highlight that AI filled it
         document.getElementById('phone-input').style.color = 'var(--primary)';
         setTimeout(() => {
            const input = document.getElementById('phone-input');
            if (input) input.style.color = 'var(--text-heading)';
         }, 1500);
      }
    };
    window.addEventListener('fill_phone', handleAutoFill);
    return () => window.removeEventListener('fill_phone', handleAutoFill);
  }, []);

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    setError('');
  };

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('OTP sent to your mobile! 📲');
        setIsNewUser(data.isNewUser || false);
        if (data.isNewUser) {
          setStep('signup');
        } else {
          setStep('otp');
        }
        setResendTimer(120);
        setOtp(['', '', '', '', '', '']);
      } else {
        setError(data.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Server error. Please check your connection.');
    }
    setLoading(false);
  };

  const handleSignupNext = () => {
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (val && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
    }
  };

  const handleVerifyOTP = async () => {
    const otpStr = otp.join('');
    if (otpStr.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: otpStr, name: name.trim(), village: village.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        // Store farmer session
        localStorage.setItem('soilai_farmer', JSON.stringify({
          id: data.farmer.id,
          phone: data.farmer.phone,
          name: data.farmer.name,
          village: data.farmer.village,
          loggedInAt: new Date().toISOString(),
        }));
        setSuccess('Welcome, farmer! Redirecting... 🌱');
        setTimeout(() => navigate('/app/analyze'), 1200);
      } else {
        setError(data.error || 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Verification failed. Please check your connection.');
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('New OTP sent! 📲');
        setResendTimer(120);
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      } else {
        setError(data.error || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (otp.every(d => d !== '') && step === 'otp') {
      handleVerifyOTP();
    }
  }, [otp, step]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '1rem',
    }}>
      {/* Background Effects */}
      <div className="animate-float" style={{ position: 'fixed', top: '10%', left: '-8%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(46,125,50,0.08) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
      <div className="animate-float" style={{ position: 'fixed', bottom: '5%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,143,0,0.06) 0%, transparent 70%)', filter: 'blur(60px)', animationDelay: '3s', zIndex: 0, pointerEvents: 'none' }} />
      <div className="animate-float" style={{ position: 'fixed', top: '60%', left: '50%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(46,125,50,0.05) 0%, transparent 70%)', filter: 'blur(50px)', animationDelay: '5s', zIndex: 0, pointerEvents: 'none' }} />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-float" style={{
          position: 'fixed',
          width: `${6 + i * 3}px`,
          height: `${6 + i * 3}px`,
          borderRadius: '50%',
          background: i % 2 === 0 ? 'rgba(46,125,50,0.15)' : 'rgba(255,143,0,0.1)',
          top: `${15 + i * 14}%`,
          left: `${10 + i * 15}%`,
          animationDelay: `${i * 0.8}s`,
          animationDuration: `${4 + i}s`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px' }}
      >
        {/* Logo Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <div style={{
            width: '70px', height: '70px', borderRadius: '1.2rem',
            background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 10px 30px -5px rgba(46,125,50,0.3)',
          }}>
            <Leaf size={36} color="white" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>
            Krishi<span style={{ color: 'var(--primary)' }}>Mitra</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            Intelligent Agriculture Platform
          </p>
        </motion.div>

        {/* Card */}
        <div className="glass" style={{
          padding: '2.5rem 2rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative line at top */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '60px', height: '3px', borderRadius: '3px',
            background: 'linear-gradient(to right, var(--primary), #3B82F6)',
          }} />

          <AnimatePresence mode="wait">
            {/* ═══════ PHONE STEP ═══════ */}
            {step === 'phone' && (
              <motion.div
                key="phone-step"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.35 }}
              >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%',
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem auto',
                  }}>
                    <Phone size={24} color="var(--primary)" />
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
                    Welcome, Farmer! 🌾
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    Enter your mobile number to get started with soil analysis
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
                    MOBILE NUMBER
                  </label>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    background: 'var(--surface-alt)', border: '1px solid var(--border)',
                    borderRadius: '0.8rem', padding: '0 1rem', transition: 'border-color 0.3s',
                  }}>
                    <span style={{
                      color: 'var(--text-muted)', fontWeight: 700, fontSize: '1rem',
                      borderRight: '1px solid var(--border)', paddingRight: '0.75rem',
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                    }}>
                      🇮🇳 +91
                    </span>
                    <input
                      id="phone-input"
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={phone}
                      onChange={handlePhoneChange}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                      autoFocus
                      style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        color: 'var(--text-heading)', fontSize: '1.1rem', fontWeight: 600,
                        padding: '1rem 0', letterSpacing: '2px',
                        fontFamily: 'Nunito, monospace',
                      }}
                    />
                  </div>
                </div>

                <button
                  id="send-otp-btn"
                  onClick={handleSendOTP}
                  disabled={loading || phone.length !== 10}
                  className="btn-primary"
                  style={{
                    width: '100%', padding: '1rem', fontSize: '1.05rem',
                    opacity: (loading || phone.length !== 10) ? 0.5 : 1,
                    cursor: (loading || phone.length !== 10) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Sending OTP...</>
                  ) : (
                    <>Send OTP <ArrowRight size={18} /></>
                  )}
                </button>

                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '1.2rem', lineHeight: 1.5 }}>
                  🔒 Your number is safe with us. We only use it to verify your identity.
                </p>
              </motion.div>
            )}

            {/* ═══════ SIGNUP STEP (new user) ═══════ */}
            {step === 'signup' && (
              <motion.div
                key="signup-step"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.35 }}
              >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%',
                    background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem auto',
                  }}>
                    <User size={24} color="#3B82F6" />
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
                    New Farmer? Welcome! 🌱
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    Tell us a bit about yourself before we verify your number
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
                    YOUR NAME *
                  </label>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    background: 'var(--surface-alt)', border: '1px solid var(--border)',
                    borderRadius: '0.8rem', padding: '0 1rem',
                  }}>
                    <User size={18} color="var(--text-muted)" />
                    <input
                      id="name-input"
                      type="text"
                      placeholder="e.g., Ramesh Kumar"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(''); }}
                      autoFocus
                      style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        color: 'var(--text-heading)', fontSize: '1rem', fontWeight: 600,
                        padding: '1rem 0',
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
                    VILLAGE / TOWN (optional)
                  </label>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    background: 'var(--surface-alt)', border: '1px solid var(--border)',
                    borderRadius: '0.8rem', padding: '0 1rem',
                  }}>
                    <MapPin size={18} color="var(--text-muted)" />
                    <input
                      id="village-input"
                      type="text"
                      placeholder="e.g., Bhopal, MP"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        color: 'var(--text-heading)', fontSize: '1rem', fontWeight: 600,
                        padding: '1rem 0',
                      }}
                    />
                  </div>
                </div>

                <button
                  id="signup-next-btn"
                  onClick={handleSignupNext}
                  disabled={!name.trim()}
                  className="btn-primary"
                  style={{
                    width: '100%', padding: '1rem', fontSize: '1.05rem',
                    opacity: !name.trim() ? 0.5 : 1,
                    cursor: !name.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  Continue to Verify <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => { setStep('phone'); setError(''); }}
                  style={{
                    width: '100%', marginTop: '0.75rem', padding: '0.75rem',
                    background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '0.8rem', color: 'var(--text-muted)', fontSize: '0.9rem',
                    cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  ← Change Number
                </button>
              </motion.div>
            )}

            {/* ═══════ OTP STEP ═══════ */}
            {step === 'otp' && (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.35 }}
              >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%',
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem auto',
                  }}>
                    <Shield size={24} color="var(--primary)" />
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
                    Verify Your Number
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    Enter the 6-digit code sent to<br />
                    <span style={{ color: 'var(--text-heading)', fontWeight: 700 }}>+91 {phone}</span>
                  </p>
                </div>

                {/* OTP Boxes */}
                <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => otpRefs.current[idx] = el}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      autoFocus={idx === 0}
                      style={{
                        width: '50px', height: '58px',
                        textAlign: 'center', fontSize: '1.4rem', fontWeight: 800,
                        background: digit ? 'rgba(46,125,50,0.06)' : 'var(--surface-alt)',
                        border: digit ? '2px solid rgba(46,125,50,0.3)' : '1px solid var(--border)',
                        borderRadius: '0.8rem', color: 'var(--text-heading)', outline: 'none',
                        transition: 'all 0.3s',
                        caretColor: 'var(--primary)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(16,185,129,0.5)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = digit ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  ))}
                </div>

                <button
                  id="verify-otp-btn"
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.some(d => d === '')}
                  className="btn-primary"
                  style={{
                    width: '100%', padding: '1rem', fontSize: '1.05rem',
                    opacity: (loading || otp.some(d => d === '')) ? 0.5 : 1,
                    cursor: (loading || otp.some(d => d === '')) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Verifying...</>
                  ) : (
                    <><CheckCircle2 size={18} /> Verify & Login</>
                  )}
                </button>

                {/* Resend & Change Number */}
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <button
                    id="resend-otp-btn"
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0 || loading}
                    style={{
                      background: 'transparent', border: 'none', cursor: resendTimer > 0 ? 'default' : 'pointer',
                      color: resendTimer > 0 ? 'var(--text-muted)' : 'var(--primary)',
                      fontSize: '0.9rem', fontWeight: 600,
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      opacity: resendTimer > 0 ? 0.6 : 1,
                    }}
                  >
                    <RefreshCw size={14} />
                    {resendTimer > 0
                      ? `Resend OTP in ${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')}`
                      : 'Resend OTP'
                    }
                  </button>

                  <div style={{ marginTop: '0.75rem' }}>
                    <button
                      onClick={() => { setStep('phone'); setError(''); setSuccess(''); }}
                      style={{
                        background: 'transparent', border: 'none',
                        color: 'var(--text-muted)', fontSize: '0.85rem',
                        cursor: 'pointer', textDecoration: 'underline',
                      }}
                    >
                      ← Change Number
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  marginTop: '1.2rem', padding: '0.75rem 1rem',
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  color: '#EF4444', fontSize: '0.85rem', fontWeight: 600,
                }}
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  marginTop: '1.2rem', padding: '0.75rem 1rem',
                  background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  color: '#10B981', fontSize: '0.85rem', fontWeight: 600,
                }}
              >
                <CheckCircle2 size={16} /> {success}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', marginTop: '1.5rem' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.1)',
            padding: '0.5rem 1.25rem', borderRadius: '2rem',
            color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600,
          }}>
            <Shield size={12} color="var(--primary)" />
            Secured with OTP Verification
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
