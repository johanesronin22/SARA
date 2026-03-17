import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-bg-deep)',
      padding: '4rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container flex-between" style={{ alignItems: 'flex-start' }}>
        <div style={{ maxWidth: '300px' }}>
          <Link to="/" className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start', marginBottom: '1rem' }}>
            <Activity size={24} className="neon-text" />
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '2px' }}>
              SARA
            </span>
          </Link>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            A high-tech, beginner-friendly financial ecosystem that balances Information Density with Ease of Use.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '4rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ color: 'var(--color-text-main)', fontSize: '1rem' }}>Platform</h4>
            <Link to="/pricing" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>PRICING</Link>
            <Link to="/about" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>ABOUT US</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ color: 'var(--color-text-main)', fontSize: '1rem' }}>Help</h4>
            <Link to="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>SUPPORT</Link>
            <Link to="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>CONTACT</Link>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div style={{ 
          marginTop: '3rem', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid var(--color-border)',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.75rem'
        }}>
          &copy; {new Date().getFullYear()} SARA Trading Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
