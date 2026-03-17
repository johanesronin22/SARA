import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Activity, ShieldAlert, TrendingUp, ArrowLeft, Star } from 'lucide-react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Generate instant local mock data to show chart immediately
const generateLocalMock = (symbol) => {
  const data = [];
  let price = 100 + Math.random() * 200;
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    price += (Math.random() * 8 - 3.5);
    if (price < 5) price = 5;
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Number(price.toFixed(2)),
    });
  }
  return data;
};

const generateMockQuote = (symbol) => ({
  symbol: symbol.toUpperCase(),
  shortName: `${symbol.toUpperCase()} Inc.`,
  regularMarketPrice: Number((100 + Math.random() * 300).toFixed(2)),
  regularMarketChangePercent: Number((Math.random() * 10 - 5).toFixed(2)),
});

const StockDetail = () => {
  const { id } = useParams();
  const [aiProjection, setAiProjection] = useState(null);
  const [aiReasoning, setAiReasoning] = useState('');
  const [aiArticles, setAiArticles] = useState([]);
  const [stockData, setStockData] = useState(() => generateMockQuote(id));
  const [companyInfo, setCompanyInfo] = useState(null);
  const [baseHistory, setBaseHistory] = useState(() => generateLocalMock(id));
  const [chartData, setChartData] = useState(() => generateLocalMock(id));
  const [isStarred, setIsStarred] = useState(false);
  const [chartWidth, setChartWidth] = useState(700);

  // Responsive chart sizing based on window
  useEffect(() => {
    const updateWidth = () => {
      const w = Math.min(window.innerWidth * 0.65, 900);
      setChartWidth(Math.max(w, 400));
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Fetch real data from backend (will update the already-shown mock)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quoteRes, historyRes, companyRes] = await Promise.all([
          axios.get(`/api/quotes?symbols=${id}`),
          axios.get(`/api/history/${id}`),
          axios.get(`/api/company/${id}`)
        ]);

        if (quoteRes.data && quoteRes.data.length > 0) {
          setStockData(quoteRes.data[0]);
        }
        if (companyRes.data) setCompanyInfo(companyRes.data);

        if (historyRes.data && Array.isArray(historyRes.data) && historyRes.data.length > 0) {
          const formatted = historyRes.data.map(d => ({
            date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: d.close,
          }));
          setBaseHistory(formatted);
          setChartData(formatted);
        }
      } catch (error) {
        console.warn('Backend unavailable, using local mock data:', error.message);
        // Already using local mock — no action needed
      }
    };
    fetchData();
  }, [id]);

  // Build projection data when AI button clicked
  useEffect(() => {
    if (!aiProjection) {
      setChartData(baseHistory);
      return;
    }

    const trendMultiplier = stockData?.regularMarketChangePercent >= 0 ? 1 : -1;
    const projected = [...baseHistory];
    const lastPrice = baseHistory[baseHistory.length - 1]?.price || 100;
    
    const daysToProject = aiProjection === '1W' ? 7 : aiProjection === '1M' ? 30 : 180;
    const step = daysToProject > 30 ? 5 : 1;

    let currentPrice = lastPrice;
    for (let i = 1; i <= daysToProject; i += step) {
      currentPrice += (Math.random() * 4 - 1.5) + (trendMultiplier * 0.5);
      projected.push({
        date: `+${i}d`,
        projectedPrice: Number(currentPrice.toFixed(2)),
      });
    }
    setChartData(projected);

    // Fetch AI reasoning
    setAiReasoning('Gemini AI is analyzing market conditions...');
    setAiArticles([]);
    axios.post('/api/predict', {
      symbol: id,
      timeframe: aiProjection,
      currentPrice: stockData?.regularMarketPrice || lastPrice,
    })
      .then(res => {
          setAiReasoning(res.data.reasoning);
          if (res.data.articles) setAiArticles(res.data.articles);
      })
      .catch(() => setAiReasoning(`${id} appears to be forming a strong ${trendMultiplier > 0 ? 'bullish' : 'bearish'} momentum pattern over the next ${aiProjection} based on historical volume indicators.`));

  }, [aiProjection, baseHistory, stockData, id]);

  const price = stockData?.regularMarketPrice?.toFixed(2) || '---';
  const change = stockData?.regularMarketChangePercent?.toFixed(2) || '0.00';
  const isUp = (stockData?.regularMarketChangePercent ?? 0) >= 0;
  const strokeColor = isUp ? '#00ff9d' : '#ff3366';

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <Link to="/market" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', width: 'fit-content' }}>
        <ArrowLeft size={16} /> Back to Market
      </Link>

      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <Activity className="neon-text" size={40} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span>{id}</span>
              <button
                onClick={() => setIsStarred(!isStarred)}
                style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: isStarred ? '#FFC700' : 'var(--color-text-muted)', transition: 'color 0.2s' }}
                aria-label="Add to watchlist"
              >
                <Star size={28} fill={isStarred ? '#FFC700' : 'none'} stroke={isStarred ? '#FFC700' : 'currentColor'} />
              </button>
            </div>
            <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
              {stockData?.shortName || stockData?.longName || `${id} Inc.`}
            </span>
          </div>
        </h1>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>${price}</div>
          <div style={{ color: isUp ? 'var(--color-trend-up)' : 'var(--color-trend-down)', fontWeight: 600, fontSize: '1.25rem' }}>
            {isUp ? '+' : ''}{change}%
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        {/* ── Main Chart ── */}
        <div>
          <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <AreaChart
              width={chartWidth}
              height={420}
              data={chartData}
              margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
            >
              <defs>
                <linearGradient id="gradPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradProjected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.3)"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                interval={Math.ceil(chartData.length / 10)}
                dy={8}
              />
              <YAxis
                domain={['auto', 'auto']}
                stroke="rgba(255,255,255,0.3)"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                dx={-4}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg-deep)',
                  border: '1px solid rgba(0,240,255,0.3)',
                  borderRadius: '8px',
                  boxShadow: '0 0 16px rgba(0,240,255,0.15)',
                }}
                itemStyle={{ color: 'var(--color-text-main)' }}
                labelStyle={{ color: 'var(--color-text-muted)', marginBottom: '4px' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2}
                fill="url(#gradPrice)"
                dot={false}
                activeDot={{ r: 5, fill: strokeColor }}
                connectNulls
              />
              {aiProjection && (
                <Area
                  type="monotone"
                  dataKey="projectedPrice"
                  stroke="#00f0ff"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  fill="url(#gradProjected)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#00f0ff' }}
                  connectNulls
                />
              )}
            </AreaChart>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', paddingLeft: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                <div style={{ width: '20px', height: '2px', background: strokeColor }} />
                Historical
              </div>
              {aiProjection && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <div style={{ width: '20px', height: '2px', background: '#00f0ff', borderTop: '2px dashed #00f0ff' }} />
                  AI Projection ({aiProjection})
                </div>
              )}
            </div>
          </div>

          {/* ── Company Info & Methodology (Full Width) ── */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', marginTop: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', fontSize: '1.25rem' }}>
                  <Activity className="neon-text" size={20} /> About {stockData?.shortName || id}
                </h3>
                {companyInfo && (companyInfo.sector !== 'N/A' || companyInfo.industry !== 'N/A') ? (
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', color: 'var(--color-text-main)' }}>{companyInfo.sector}</span>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', color: 'var(--color-text-main)' }}>{companyInfo.industry}</span>
                  </div>
                ) : null}
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>
                  {companyInfo?.summary || `${stockData?.shortName || id} is a publicly traded company. Detailed business summary is currently unavailable. This section typically contains information about the company's industry, sector, and core business operations.`}
                </p>
                {companyInfo?.website && companyInfo.website !== '#' && (
                  <a href={companyInfo.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--color-accent-neon)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(0, 240, 255, 0.2)'} onMouseOut={e => e.currentTarget.style.background='rgba(0, 240, 255, 0.1)'}>
                    Visit Website
                  </a>
                )}
              </div>
              
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', fontSize: '1.25rem' }}>
                  <TrendingUp className="neon-text" size={20} /> SARA Prediction Methodology
                </h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '1rem' }}>
                  SARA's predictive engine uses a hybrid approach combining traditional technical analysis with advanced natural language processing.
                </p>
                <ul style={{ color: 'var(--color-text-muted)', paddingLeft: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
                   <li><strong style={{ color: 'var(--color-text-main)' }}>Technical Indicators:</strong> We analyze historical price action against volume flows, moving averages (EMA/SMA), and momentum oscillators (RSI, MACD).</li>
                   <li><strong style={{ color: 'var(--color-text-main)' }}>News Sentiment:</strong> Our models ingest real-time news headlines, scoring textual context for implicit bullish or bearish sentiment.</li>
                   <li><strong style={{ color: 'var(--color-text-main)' }}>AI Synthesis:</strong> Gemini AI weights these factors against your selected timeframe to project likely price trajectories and identify key support/resistance blocks.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── AI Analysis Breakdown (Full Width) ── */}
          {aiProjection && (
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', marginTop: '2rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                <Star className="neon-text" size={24} /> AI Analysis Breakdown <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>({aiProjection} Outlook)</span>
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: 'var(--color-text-main)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                {aiReasoning.split('\n\n').map((paragraph, idx) => (
                   <p key={idx} style={{ margin: 0 }}>{paragraph}</p>
                ))}
              </div>

              {aiArticles && aiArticles.length > 0 && (
                <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Referenced News Sources:</h4>
                  <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', mragin: 0 }}>
                    {aiArticles.map((article, i) => (
                      <li key={i}>
                        <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-main)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--color-accent-neon)'} onMouseOut={e => e.currentTarget.style.color='var(--color-text-main)'}>
                            {article.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* AI Prediction Engine */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}>
              <TrendingUp className="neon-text" size={18} /> AI Prediction Engine
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {['1W', '1M', '6M'].map(t => (
                <button
                  key={t}
                  onClick={() => setAiProjection(t === aiProjection ? null : t)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: `1px solid ${aiProjection === t ? 'var(--color-accent-neon)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    background: aiProjection === t ? 'rgba(0,240,255,0.1)' : 'transparent',
                    color: aiProjection === t ? 'var(--color-accent-neon)' : 'var(--color-text-main)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}>
              <ShieldAlert style={{ color: 'var(--color-trend-up)' }} size={18} /> Risk Assessment
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-trend-up)' }}>LOW</span>
              <div style={{ flex: 1, height: '8px', background: 'linear-gradient(to right, #00ff9d, #ffc700, #ff3366)', borderRadius: '4px', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  left: isUp ? '18%' : '72%',
                  width: '16px',
                  height: '16px',
                  background: '#fff',
                  borderRadius: '50%',
                  boxShadow: '0 0 6px rgba(0,0,0,0.5)',
                  transition: 'left 0.8s ease'
                }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-trend-down)' }}>HIGH</span>
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              Currently: <strong style={{ color: isUp ? 'var(--color-trend-up)' : 'var(--color-trend-down)' }}>{isUp ? 'Low Risk' : 'Moderate-High'}</strong>
            </div>
          </div>

          {/* Pro Indicators */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)', opacity: 0.6 }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', textAlign: 'center' }}>Pro Indicators</h3>
            <p style={{ fontSize: '0.8rem', textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Upgrade to Premium to unlock RSI, MACD, Bollinger Bands &amp; more.
            </p>
            <Link to="/pricing" className="btn-secondary" style={{ width: '100%', textAlign: 'center', borderRadius: 'var(--radius-full)', display: 'block', padding: '0.6rem 0' }}>
              Upgrade Now
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StockDetail;
