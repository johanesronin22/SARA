import React from 'react';
import { Check, Zap, MessageCircle, BookOpen, TrendingUp, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const featureRow = (icon, text, highlight = false) => (
  <li key={text} style={{
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.6rem 0',
    borderBottom: '1px solid var(--color-border)',
    color: highlight ? 'var(--color-text-main)' : 'var(--color-text-muted)'
  }}>
    <span style={{ color: 'var(--color-accent-neon)', flexShrink: 0 }}>{icon}</span>
    {text}
  </li>
);

const Pricing = () => {
  const faqs = [
    { q: "Can I switch plans later?", a: "Absolutely. You can upgrade or downgrade at any time and only pay the prorated difference." },
    { q: "Is there a free trial for the Pro plan?", a: "Yes! New users get a 7-day free trial of The Professional Edge with no credit card required." },
    { q: "What does a WhatsApp Alert look like?", a: "You'll receive a concise, personalized message like: 'AAPL momentum breakout detected – up 3.2%. SARA confidence: High.' Sent when markets move significantly on your starred stocks." },
  ];
  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <div className="animated-gradient-bg" style={{ padding: '4rem 1rem', minHeight: '100vh' }}>
      <motion.div
        initial="hidden" animate="visible" variants={fadeInUp}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Simple, <span className="neon-text">Transparent</span> Pricing
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem', maxWidth: '560px', margin: '0 auto' }}>
          Start free. Upgrade when you're ready for the full experience.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          maxWidth: '880px',
          margin: '0 auto 6rem auto',
          alignItems: 'start'
        }}
      >
        {/* Free Tier */}
        <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '2px' }}>FREE</div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Core</h2>
          <div style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            $0
            <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 400 }}> / month</span>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            Get started with everything you need to understand the market.
          </p>

          <ul style={{ listStyle: 'none', flex: 1, marginBottom: '2rem' }}>
            {featureRow(<BarChart2 size={18} />, 'Real-time global market data')}
            {featureRow(<TrendingUp size={18} />, 'AI Prediction Engine (1W / 1M / 6M)')}
            {featureRow(<Check size={18} />, 'Interactive stock charts (Recharts)')}
            {featureRow(<Check size={18} />, 'Basic Watchlist (up to 10 stocks)')}
            {featureRow(<Check size={18} />, 'Community Hub forum access')}
          </ul>

          <Link to="/login" className="btn-secondary" style={{ width: '100%', padding: '1rem', textAlign: 'center', borderRadius: 'var(--radius-xl)' }}>
            Get Started Free
          </Link>
        </div>

        {/* Pro Tier */}
        <div className="glass-panel" style={{
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--color-accent-neon)',
          boxShadow: '0 0 40px rgba(0, 240, 255, 0.15)',
          borderRadius: 'var(--radius-2xl)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Glow badge */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
            background: 'linear-gradient(90deg, var(--color-accent-neon), var(--color-trend-up))'
          }} />

          <div style={{
            background: 'var(--color-accent-neon)', color: '#000',
            padding: '0.25rem 1rem', borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem', fontWeight: 700, alignSelf: 'flex-start',
            marginBottom: '1rem', letterSpacing: '1px'
          }}>
            MOST POPULAR
          </div>

          <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-accent-neon)', letterSpacing: '2px' }}>PRO</div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-accent-neon)' }}>
            The Professional Edge
          </h2>
          <div style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            $24
            <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 400 }}> / month</span>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            For serious investors who want a real edge with personalized guidance.
          </p>

          <ul style={{ listStyle: 'none', flex: 1, marginBottom: '2rem' }}>
            {featureRow(<Check size={18} />, 'Everything in Core', true)}
            {featureRow(<MessageCircle size={18} />, 'Personalized WhatsApp alerts & market updates', true)}
            {featureRow(<BookOpen size={18} />, '"Trading 101" classes — beginner to advanced', true)}
            {featureRow(<Zap size={18} />, 'Priority Gemini AI insight summaries', true)}
            {featureRow(<Check size={18} />, 'Unlimited Watchlists', true)}
            {featureRow(<Check size={18} />, 'Advanced technical indicators', true)}
          </ul>

          <button className="btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-xl)', fontSize: '1rem' }}>
            Upgrade to Pro
          </button>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
        style={{ maxWidth: '720px', margin: '0 auto', paddingBottom: '4rem' }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          Pricing <span className="neon-text">FAQs</span>
        </h2>
        {faqs.map((faq, i) => (
          <div key={i} className="glass-panel" style={{ marginBottom: '1rem', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                width: '100%', padding: '1.25rem 1.5rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-main)', textAlign: 'left'
              }}
            >
              {faq.q}
              <span className="neon-text" style={{ flexShrink: 0, marginLeft: '1rem', fontSize: '1.25rem' }}>
                {openFaq === i ? '−' : '+'}
              </span>
            </button>
            {openFaq === i && (
              <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Pricing;
