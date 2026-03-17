import React from 'react';
import { ArrowUp, MessageSquare } from 'lucide-react';

const Hub = () => {
  const threads = [
    { title: "Is AI overvalued in 2026? A deeper dive into PE ratios compared to standard metrics.", author: "TechTrader", upvotes: 1245, comments: 342, tag: "Analysis", time: "2 hours ago" },
    { title: "My 6-month prediction for renewables based on latest global policies.", author: "EcoInvest", upvotes: 842, comments: 156, tag: "Theories", time: "5 hours ago" },
    { title: "Why the Fed's latest move might trigger a tech rally tomorrow.", author: "MarketWatchNews", upvotes: 3410, comments: 890, tag: "News", time: "8 hours ago" },
    { title: "What exactly is a put option? Total beginner here.", author: "NewbieTrader99", upvotes: 215, comments: 45, tag: "Questions", time: "1 day ago" },
    { title: "Analyzing TSLA's Q3 delivery numbers: Are they finally turning around?", author: "AutoBull", upvotes: 630, comments: 211, tag: "Analysis", time: "3 hours ago" },
    { title: "Rumor: Major acquisition in the semiconductor space next week.", author: "SiliconWhisper", upvotes: 4982, comments: 1240, tag: "Theories", time: "6 hours ago" },
    { title: "Healthcare sector sees massive inflows amidst new legislation.", author: "MarketWatchNews", upvotes: 1102, comments: 88, tag: "News", time: "12 hours ago" },
    { title: "How do you guys deal with the emotional toll of a red day?", author: "DiamondHands123", upvotes: 450, comments: 302, tag: "Questions", time: "18 hours ago" },
    { title: "The exact reason why value investing isn't dead yet.", author: "GrahamDisciple", upvotes: 890, comments: 410, tag: "Analysis", time: "1 day ago" },
    { title: "Is anyone else noticing the weird volume spikes in small caps recently?", author: "PennyPatcher", upvotes: 310, comments: 95, tag: "Theories", time: "2 days ago" }
  ];

  const getTagColor = (tag) => {
    switch(tag) {
      case 'Analysis': return 'rgba(0, 240, 255, 0.2)';
      case 'Theories': return 'rgba(255, 51, 102, 0.2)';
      case 'News': return 'rgba(0, 255, 157, 0.2)';
      case 'Questions': return 'rgba(255, 200, 0, 0.2)';
      default: return 'var(--color-surface)';
    }
  };

  const getTagBorder = (tag) => {
    switch(tag) {
      case 'Analysis': return 'var(--color-accent-neon)';
      case 'Theories': return 'var(--color-trend-down)';
      case 'News': return 'var(--color-trend-up)';
      case 'Questions': return '#FFC800';
      default: return 'var(--color-border)';
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '900px' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>The <span className="neon-text">Hub</span></h1>
        <button className="btn-primary">Create Post</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {['All', 'Analysis', 'Questions', 'News', 'Theories'].map(cat => (
          <button key={cat} style={{
             padding: '0.5rem 1rem',
             borderRadius: 'var(--radius-full)',
             border: '1px solid var(--color-border)',
             background: cat === 'All' ? 'var(--color-surface-hover)' : 'transparent',
             color: cat === 'All' ? 'var(--color-text-main)' : 'var(--color-text-muted)'
          }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
         {threads.map((t, idx) => (
           <div key={idx} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem' }}>
             {/* Upvote Column */}
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: '40px' }}>
                <ArrowUp size={24} style={{ color: 'var(--color-text-muted)', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.color='var(--color-trend-up)'} onMouseOut={e=>e.currentTarget.style.color='var(--color-text-muted)'} />
                <span style={{ fontWeight: 600 }}>{t.upvotes}</span>
             </div>
             
             {/* Content Column */}
             <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: 'var(--radius-sm)',
                    background: getTagColor(t.tag),
                    border: `1px solid ${getTagBorder(t.tag)}`
                  }}>{t.tag}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Posted by u/{t.author} • {t.time}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', lineHeight: 1.4, cursor: 'pointer' }}>{t.title}</h3>
                
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                   <div className="flex-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                      <MessageSquare size={16} /> {t.comments} Comments
                   </div>
                   <div className="flex-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                      Share
                   </div>
                </div>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Hub;
