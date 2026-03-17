import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

const Market = () => {
  const [search, setSearch] = useState('');
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch top 15 symbols for the market overview
    const fetchMarketOverview = async () => {
      try {
        const topSymbols = 'AAPL,MSFT,NVDA,AMZN,META,GOOGL,TSLA,BRK-B,LLY,V,JPM,WMT,MA,PG,TSM,ASML,NVO,NSRGY,TM,SHEL,AZN,BABA,TCEHY,NVS,PDD';
        const response = await api.get(`/api/quotes?symbols=${topSymbols}`);
        const data = response.data || [];

        const formattedStocks = data.map(stock => ({
          id: stock.symbol,
          name: stock.shortName || stock.longName || 'Unknown',
          price: stock.regularMarketPrice ? stock.regularMarketPrice.toFixed(2) : 'N/A',
          change: stock.regularMarketChangePercent ? `${(stock.regularMarketChangePercent > 0 ? '+' : '')}${stock.regularMarketChangePercent.toFixed(2)}%` : '0.00%',
          rawChange: stock.regularMarketChangePercent || 0,
          marketCap: stock.marketCap ? "$" + (stock.marketCap / 1e9).toFixed(2) + "B" : '---',
          volume: stock.regularMarketVolume ? (stock.regularMarketVolume / 1e6).toFixed(2) + "M" : '---',
          pe: stock.trailingPE ? stock.trailingPE.toFixed(2) : '---'
        }));

        setStocks(formattedStocks.sort((a,b) => b.rawChange - a.rawChange));
      } catch (error) {
        console.error("Error loading market data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketOverview();
  }, []);

  const filteredStocks = stocks.filter(s => 
    s.id.toLowerCase().includes(search.toLowerCase()) || 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Market <span className="neon-text">Overview</span></h1>
      
      {/* Search Bar */}
      <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 4rem auto' }}>
        <div className="glass-panel" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          borderRadius: 'var(--radius-full)',
          padding: '0.75rem 1.5rem',
          boxShadow: '0 0 15px rgba(0, 240, 255, 0.1)'
        }}>
          <Search size={20} className="neon-text" style={{ marginRight: '1rem' }} />
          <input 
            type="text" 
            placeholder="Search stocks, tickers, or companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ 
              flex: 1, 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--color-text-main)',
              fontSize: '1.125rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Stock List */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        {loading ? (
           <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '3rem' }}>Fetching live market data...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--color-text-muted)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Ticker</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Price</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>24h Change</th>
                <th style={{ padding: '1rem', fontWeight: 500, textAlign: 'right' }}>Market Cap</th>
                <th style={{ padding: '1rem', fontWeight: 500, textAlign: 'right' }}>Volume</th>
                <th style={{ padding: '1rem', fontWeight: 500, textAlign: 'right' }}>P/E Ratio</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map(s => {
                // Generate a consistent generic logo background color based on symbol character code
                const colorIndex = s.id.charCodeAt(0) % 5;
                const colors = ['#FF3366', '#00F0FF', '#FFC700', '#9D00FF', '#00FF9D'];
                const logoColor = colors[colorIndex];
                
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                     <td style={{ padding: '1rem', fontWeight: 600 }}>
                       <Link to={`/stock/${s.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'inherit', textDecoration: 'none' }}>
                         <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: logoColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '1rem', fontWeight: 800 }}>
                            {s.id.charAt(0)}
                         </div>
                         <div>
                           <div style={{ color: 'var(--color-text-main)' }}>{s.id}</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>{s.name}</div>
                         </div>
                       </Link>
                     </td>
                     <td style={{ padding: '1rem', fontWeight: 600 }}>${s.price}</td>
                     <td style={{ padding: '1rem', fontWeight: 600, color: s.rawChange >= 0 ? 'var(--color-trend-up)' : 'var(--color-trend-down)' }}>
                        {s.change}
                     </td>
                     <td style={{ padding: '1rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>{s.marketCap}</td>
                     <td style={{ padding: '1rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>{s.volume}</td>
                     <td style={{ padding: '1rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>{s.pe}</td>
                  </tr>
                );
              })}
              {filteredStocks.length === 0 && (
                 <tr>
                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                       No symbols found matching "{search}"
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Market;
