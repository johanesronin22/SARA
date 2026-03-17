import React, { useState, useEffect } from 'react';
import { CheckCircle, Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase';

const Login = () => {
  const [step, setStep] = useState('initial'); // initial, signing-in, success
  const [authMode, setAuthMode] = useState('login'); // login, signup
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  // Simulation of Google sign-in process (can be wired to real Google OAuth later)
  const handleGoogleSignIn = () => {
    setError('');
    setStep('signing-in');
    setTimeout(() => {
      setStep('success');
      localStorage.setItem('sara_user', JSON.stringify({ email: 'google_user@test.com', name: 'Google User' }));
      setTimeout(() => window.location.href = '/', 1500);
    }, 1800);
  };

  const handleTraditionalAuth = async (e) => {
    e.preventDefault();
    setError('');
    setStep('signing-in');
    
    try {
        let userData = null;
        if (authMode === 'signup') {
            const { data, error: signupError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: { full_name: formData.name }
                }
            });
            if (signupError) throw signupError;
            userData = { email: data.user.email, name: formData.name };
        } else {
            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            });
            if (loginError) throw loginError;
            userData = { email: data.user.email, name: data.user.user_metadata?.full_name || data.user.email };
        }
        
        // Skip 2FA and go to success
        setTimeout(() => {
            setStep('success');
            localStorage.setItem('sara_user', JSON.stringify(userData));
            setTimeout(() => window.location.href = '/', 1500);
        }, 1200);
        
    } catch (err) {
        setError(err.message || 'Authentication failed. Please try again.');
        setStep('initial');
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
    setFormData({ name: '', email: '', password: '' });
    setError('');
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    paddingLeft: '2.75rem',
    background: 'var(--color-bg-deep)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-main)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  const iconStyle = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--color-text-muted)'
  };

  return (
    <div className="container" style={{ display: 'flex', minHeight: 'calc(100vh - 10rem)', alignItems: 'center', padding: '2rem 0' }}>
      {/* Left Side: Branding/Mission */}
      <div style={{ flex: 1, paddingRight: '4rem', borderRight: '1px solid var(--color-border)' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Democratizing <br/><span className="neon-text">Stock Data</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: 1.6, maxWidth: '500px' }}>
            SARA is designed to balance deep information density with ease of use. 
            Our mission is to make professional-grade trading analysis accessible to beginners 
            through AI-powered clarity and community-driven insights.
          </p>
          <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }} className="neon-text">15k+</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Active Traders</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }} className="neon-text">98%</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>AI Accuracy</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Auth Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 2rem' }}>
        <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '440px', borderRadius: 'var(--radius-2xl)' }}>
          <AnimatePresence mode="wait">
            
            {/* Initial Login/Signup View */}
            {step === 'initial' && (
              <motion.div key="initial" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <h2 style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>
                  {authMode === 'login' ? 'Enter your details to access your dashboard' : 'Sign up to start your trading journey with SARA'}
                </p>

                {/* Error Box */}
                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '0.75rem', background: 'rgba(255, 51, 102, 0.1)', border: '1px solid rgba(255, 51, 102, 0.3)', borderRadius: 'var(--radius-md)', color: 'var(--color-trend-down)', fontSize: '0.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <AlertCircle size={16} /> {error}
                    </motion.div>
                )}

                {/* Google Sign In */}
                <button onClick={handleGoogleSignIn} className="flex-center" style={{ 
                  width: '100%', padding: '0.875rem', background: 'var(--color-surface)', 
                  border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-main)', gap: '0.75rem', fontSize: '0.95rem',
                  fontWeight: 600, marginBottom: '1.5rem', cursor: 'pointer', transition: 'all 0.2s'
                }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-accent-neon)'}
                   onMouseOut={e => e.currentTarget.style.borderColor = 'var(--color-border)'}>
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px' }} />
                  {authMode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                </button>

                <div className="flex-center" style={{ gap: '1rem', marginBottom: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                  <div style={{ height: '1px', flex: 1, background: 'var(--color-border)' }}></div>
                  OR
                  <div style={{ height: '1px', flex: 1, background: 'var(--color-border)' }}></div>
                </div>

                {/* Traditional Form */}
                <form onSubmit={handleTraditionalAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {authMode === 'signup' && (
                    <div style={{ position: 'relative' }}>
                      <User size={18} style={iconStyle} />
                      <input 
                        type="text" placeholder="Full Name" required 
                        style={inputStyle} value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  )}
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={iconStyle} />
                    <input 
                      type="email" placeholder="Email Address" required 
                      style={inputStyle} value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={iconStyle} />
                    <input 
                      type="password" placeholder="Password" required 
                      style={inputStyle} value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                    {authMode === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '1.5rem', textAlign: 'center' }}>
                  {authMode === 'login' ? "Don't have an account?" : "Already have an account?"} {' '}
                  <span 
                    onClick={toggleAuthMode}
                    style={{ color: 'var(--color-accent-neon)', cursor: 'pointer', fontWeight: 600 }}
                  >
                    {authMode === 'login' ? 'Sign up' : 'Log in'}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Loading/Signing-in State */}
            {step === 'signing-in' && (
              <motion.div key="signing-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
                <Loader2 size={48} className="neon-text" style={{ margin: '0 auto 2rem auto', animation: 'spin 1s linear infinite' }} />
                <h2 style={{ marginBottom: '1rem' }}>Verifying Identity</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Connecting to SARA Secure Auth servers...</p>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              </motion.div>
            )}

            {/* Success State */}
            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <CheckCircle size={80} style={{ color: 'var(--color-trend-up)', margin: '0 auto' }} />
                </div>
                <h2 style={{ color: 'var(--color-trend-up)', marginBottom: '1rem' }}>Access Granted</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Welcome back to SARA. Redirecting...</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;
