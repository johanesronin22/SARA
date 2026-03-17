import React, { useState, useEffect } from 'react';
import { Star, Trash2, PlusCircle, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const DEFAULT_WATCHLIST = ['TSLA', 'AAPL', 'GME', 'NVDA', 'META'];

const Watchlists = () => {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('sara_watchlist');
    return saved ? JSON.parse(saved) : DEFAULT_WATCHLIST;
  });
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');

  const fetchData = async (symbols) => {
    if (!symbols || symbols.length === 0) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await api.get(`/api/quotes?symbols=${symbols.join(',')}`);
      const map = {};
      (res.data || []).forEach(s => { map[s.symbol] = s; });
      setStockData(map);
    } catch (e) {
      console.error('Watchlist fetch failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(watchlist);
    localStorage.setItem('sara_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const removeStock = (sym) => setWatchlist(prev => prev.filter(s => s !== sym));

  const addStock = () => {
    const sym = newSymbol.trim().toUpperCase();
    if (sym && !watchlist.includes(sym)) {
      setWatchlist(prev => [...prev, sym]);
    }
    setNewSymbol('');
    setAdding(false);
  };

  return (
    <div className="animated-gradient-bg" style={{ padding: '2rem 1rem', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <motion.div
          initial="hidden" animate="visible" variants={fadeInUp}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}
        >
          <h1 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Star className="neon-text" size={32} fill="var(--color-accent-neon)" />
            Your <span className="neon-text">Watchlist</span>
          </h1>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => fetchData(watchlist)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              onClick={() => setAdding(true)}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem' }}
            >
              <PlusCircle size={16} /> Add Stock
            </button>
          </div>
        </motion.div>

        {/* Add Stock Input */}
        {adding && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', borderRadius: 'var(--radius-xl)' }}>
            <input
              type="text"
              placeholder="Enter ticker symbol (e.g. AAPL)"
              value={newSymbol}
              onChange={e => setNewSymbol(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addStock()}
              autoFocus
              style={{ flex: 1, background: 'var(--color-bg-deep)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', color: 'var(--color-text-main)', outline: 'none', fontSize: '1rem' }}
            />
            <button className="btn-primary" onClick={addStock} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)' }}>Add</button>
            <button onClick={() => setAdding(false)} style={{ padding: '0.75rem', color: 'var(--color-text-muted)' }}>Cancel</button>
          </motion.div>
        )}

        {/* Stats Summary */}
        {!loading && watchlist.length > 0 && (
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Tracked', value: watchlist.length, color: 'var(--color-accent-neon)' },
              {
                label: 'Gainers',
                value: Object.values(stockData).filter(s => s.regularMarketChangePercent >= 0).length,
                color: 'var(--color-trend-up)'
              },
              {
                label: 'Losers',
                value: Object.values(stockData).filter(s => s.regularMarketChangePercent < 0).length,
                color: 'var(--color-trend-down)'
              },
            ].map(stat => (
              <div key={stat.label} className="glass-panel" style={{ padding: '1rem 1.5rem', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '120px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, color: stat.color }}>{stat.value}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Stock Table */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-2xl)' }}>
          {watchlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
              <Star size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>Your watchlist is empty.</p>
              <button onClick={() => setAdding(true)} className="btn-primary" style={{ marginTop: '1rem' }}>Add your first stock</button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'var(--color-text-muted)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 500, fontSize: '0.875rem' }}>TICKER</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 500, fontSize: '0.875rem' }}>COMPANY</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 500, fontSize: '0.875rem', textAlign: 'right' }}>PRICE</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 500, fontSize: '0.875rem', textAlign: 'right' }}>24H</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 500, fontSize: '0.875rem', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map(sym => {
                  const data = stockData[sym];
                  const price = data?.regularMarketPrice?.toFixed(2) || '—';
                  const change = data?.regularMarketChangePercent?.toFixed(2) || null;
                  const isUp = (change ?? 0) >= 0;

                  return (
                    <tr
                      key={sym}
                      style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--color-surface-hover)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '1rem', fontWeight: 700 }}>
                        <Link to={`/stock/${sym}`} style={{ color: 'var(--color-accent-neon)' }}>{sym}</Link>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                        {data?.shortName || `${sym} Inc.`}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>
                        {loading ? <span style={{ opacity: 0.4 }}>Loading...</span> : `$${price}`}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: isUp ? 'var(--color-trend-up)' : 'var(--color-trend-down)', fontWeight: 600 }}>
                        {change !== null ? (
                          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
                            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {isUp ? '+' : ''}{change}%
                          </span>
                        ) : '—'}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => removeStock(sym)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-trend-down)', fontSize: '0.8rem', padding: '0.35rem 0.75rem', border: '1px solid rgba(255,51,102,0.3)', borderRadius: 'var(--radius-full)' }}
                          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,51,102,0.1)'}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* Tip */}
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          💡 Tip: Click the <Star size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> star on any stock detail page to instantly add it here.
        </p>
      </div>
    </div>
  );
};

export default Watchlists;
