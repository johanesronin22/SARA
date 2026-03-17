import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const About = () => {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="container animated-gradient-bg" style={{ padding: '4rem 1rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '800px', width: '100%', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>
          About <span className="neon-text">SARA</span>
        </h1>
        <div className="glass-panel" style={{ padding: '3rem', lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>
            SARA (Stock Analysis and Recommendation AI) is an intelligent investment platform designed to simplify the world of finance for beginner investors. Our mission is to make stock market insights accessible, understandable, and actionable by combining data-driven analysis with AI-powered recommendations.
          </p>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>
            SARA helps users explore markets, track investments, and make informed decisions through interactive tools, real-time insights, and personalized guidance. With features like smart portfolio tracking, AI-curated news, and an intuitive chatbot assistant, we aim to bridge the gap between complex financial data and everyday users.
          </p>
          <p style={{ fontSize: '1.125rem' }}>
            At SARA, we believe investing should feel less overwhelming and more empowering.
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div style={{ maxWidth: '800px', width: '100%', paddingBottom: '4rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Frequently Asked <span className="neon-text">Questions</span></h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { q: "Is SARA really for beginners?", a: "Absolutely! We built SARA specifically to translate complex Wall Street data into clear, easy-to-understand insights." },
            { q: "How accurate is the AI Prediction Engine?", a: "The AI provides generalized technical projections based on momentum, sentiment, and historical volume. It is a powerful tool for visual estimation, however it is not guaranteed financial advice." },
            { q: "Do I have to strictly pay for data?", a: "No! All core market data, charts, and base AI predictions are completely Free. Premium only unlocks personalized WhatsApp alerts and Pro classes." }
          ].map((faq, i) => (
            <div key={i} className="glass-panel" style={{ overflow: 'hidden' }}>
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ 
                  width: '100%', 
                  padding: '1.5rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  color: 'var(--color-text-main)',
                  textAlign: 'left'
                }}
              >
                {faq.q}
                {openFaq === i ? <ChevronUp size={20} className="neon-text" /> : <ChevronDown size={20} className="neon-text" />}
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
