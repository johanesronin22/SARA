import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Search, User, LogOut } from 'lucide-react';
import api from '../api';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem('sara_user');
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [location.pathname]); // Re-check on nav

  const handleLogout = () => {
    localStorage.removeItem('sara_user');
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  useEffect(() => {
    if(searchQuery.length < 2) {
       setSearchResults([]);
       return;
    }
    const timer = setTimeout(() => {
      setIsSearching(true);
      api.get(`/api/search?q=${searchQuery}`)
        .then(res => {
            setSearchResults(res.data || []);
            setIsSearching(false);
        })
        .catch(() => setIsSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'MARKET', path: '/market' },
    { name: 'WATCHLISTS', path: '/watchlists' },
    { name: 'HUB', path: '/hub' },
    { name: 'PRICING', path: '/pricing' },
    { name: 'ABOUT US', path: '/about' },
  ];

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '5rem',
      backgroundColor: 'rgba(10, 14, 23, 0.8)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--color-border)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container flex-between" style={{ width: '100%' }}>
        <Link to="/" className="flex-center" style={{ gap: '0.5rem' }}>
          <img src="/logo.png" alt="SARA Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '2px' }}>
            SARA
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name} 
                to={item.path}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  color: isActive ? 'var(--color-accent-neon)' : 'var(--color-text-muted)',
                  transition: 'color 0.2s',
                  textShadow: isActive ? '0 0 8px var(--color-accent-neon-glow)' : 'none'
                }}
                onMouseOver={(e) => e.target.style.color = 'var(--color-text-main)'}
                onMouseOut={(e) => {
                  if(!isActive) e.target.style.color = 'var(--color-text-muted)'
                }}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Mini Search & Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--color-border)', paddingLeft: '2rem', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', background: 'var(--color-surface)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search symbol or company..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--color-text-main)', 
                  outline: 'none',
                  fontSize: '0.875rem',
                  width: '180px'
                }}
              />
            </div>

            {/* Search Dropdown */}
            {searchResults.length > 0 && searchQuery.length >= 2 && (
              <div className="glass-panel" style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                left: '2rem',
                width: '260px',
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {isSearching ? <div style={{ padding: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Searching...</div> : 
                  searchResults.map((res, i) => (
                    <Link 
                      to={`/stock/${res.symbol}`} 
                      key={i} 
                      onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                      style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column' }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--color-surface-hover)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{res.symbol}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{res.shortname || res.longname}</span>
                    </Link>
                  ))
                }
              </div>
            )}
            {/* User Profile / Login */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.5rem', 
                    background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)', 
                    padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', 
                    color: 'var(--color-text-main)', cursor: 'pointer', transition: 'background 0.2s' 
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(0, 240, 255, 0.2)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)'}
                >
                  <User size={16} className="neon-text" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name?.split(' ')[0] || 'Profile'}</span>
                </button>

                {showDropdown && (
                  <div className="glass-panel" style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '150px',
                    padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem'
                  }}>
                    <button 
                      onClick={handleLogout}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', 
                        background: 'transparent', border: 'none', color: 'var(--color-trend-down)', 
                        cursor: 'pointer', textAlign: 'left', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' 
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
