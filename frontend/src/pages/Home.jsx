import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Activity, BookOpen, ShieldAlert, ArrowRight, MessageCircle, ChevronDown, ChevronUp, Newspaper } from 'lucide-react';
import api from '../api';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Scrolling ticker strip
const Ticker = ({ direction = 'left', speed = '30s', items }) => {
  // Ensure the block is wide enough for any screen
  const repeatedItems = Array(4).fill(items).flat();
  
  const TickerBlock = () => (
    <div style={{ display: 'inline-flex' }}>
      {repeatedItems.map((item, i) => (
        <span key={i} style={{ marginRight: '3.5rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--color-text-main)' }}>{item.sym}</span>
          <span style={{ color: item.up ? 'var(--color-trend-up)' : 'var(--color-trend-down)' }}>
            ${item.price} {item.up ? '▲' : '▼'}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div style={{
      overflow: 'hidden', whiteSpace: 'nowrap', width: '100%',
      backgroundColor: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)',
      padding: '0.75rem 0',
      display: 'flex'
    }}>
      <div style={{
        display: 'flex',
        width: 'max-content',
        animation: `ticker ${speed} linear infinite ${direction === 'right' ? 'reverse' : 'normal'}`,
      }}>
        <TickerBlock />
        <TickerBlock />
      </div>
    </div>
  );
};

const SNEAK_PEEK_SYMBOLS = [
  { sym: 'AAPL', label: 'Apple' },
  { sym: 'MSFT', label: 'Microsoft' },
  { sym: 'NVDA', label: 'NVIDIA' },
  { sym: 'AMZN', label: 'Amazon' },
  { sym: 'TSLA', label: 'Tesla' },
];

const Home = () => {
  const [tickerData1, setTickerData1] = useState([]);
  const [tickerData2, setTickerData2] = useState([]);
  const [movers, setMovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [user, setUser] = useState(null);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('sara_user');
    if (savedUser) {
        setUser(JSON.parse(savedUser));
        api.get('/api/news/market')
          .then(res => setNews(res.data || []))
          .catch(e => console.error(e))
          .finally(() => setNewsLoading(false));
    } else {
        setNewsLoading(false);
    }
  }, []);

  // Sneak peek chart state
  const [peekSym, setPeekSym] = useState('AAPL');
  const [peekHistory, setPeekHistory] = useState([]);
  const [peekLoading, setPeekLoading] = useState(true);
  const [peekQuote, setPeekQuote] = useState(null);

  // Fetch main ticker + movers
  useEffect(() => {
    // 18 safe thick-volume US equities to avoid fetch drop-offs
    const topSymbols = 'AAPL,MSFT,NVDA,AMZN,META,GOOGL,TSLA,WMT,JPM,V,MA,PG,HD,UNH,XOM,JNJ,ABBV,COST';
    api.get(`/api/quotes?symbols=${topSymbols}`)
      .then(res => {
        const data = res.data || [];
        const formatted = data.map(q => ({
          sym: q.symbol,
          name: q.shortName || q.longName,
          price: q.regularMarketPrice?.toFixed(2) || 'N/A',
          change: q.regularMarketChangePercent?.toFixed(2) || '0.00',
          up: (q.regularMarketChangePercent ?? 0) >= 0
        }));
        // We fetch 18 symbols. Split into two unique arrays.
        const midPoint = Math.floor(formatted.length / 2);
        setTickerData1(formatted.slice(0, midPoint));
        setTickerData2(formatted.slice(midPoint));
        setMovers(formatted.slice(0, 5));
      })
      .catch(err => {
        console.error('Market data fetch failed:', err);
        setTickerData1([]);
        setTickerData2([]);
        setMovers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch sneak peek chart + quote whenever peekSym changes
  useEffect(() => {
    setPeekLoading(true);
    setPeekHistory([]);
    Promise.all([
      api.get(`/api/history/${peekSym}`),
      api.get(`/api/quotes?symbols=${peekSym}`)
    ])
      .then(([histRes, quoteRes]) => {
        if (Array.isArray(histRes.data)) {
          setPeekHistory(histRes.data.map(d => ({
            date: d.date?.slice(5), // "MM-DD"
            price: d.close
          })));
        }
        if (quoteRes.data?.length > 0) setPeekQuote(quoteRes.data[0]);
      })
      .catch(e => console.error('Sneak peek fetch failed:', e))
      .finally(() => setPeekLoading(false));
  }, [peekSym]);

  const peekIsUp = (peekQuote?.regularMarketChangePercent ?? 0) >= 0;
  const peekColor = peekIsUp ? 'var(--color-trend-up)' : 'var(--color-trend-down)';

  return (
    <div className="animated-gradient-bg" style={{ paddingBottom: '4rem', minHeight: '100vh' }}>

      {/* ── Hero / Top Stories ── */}
      {user ? (
          <motion.section
            className="container"
            style={{ minHeight: '60vh', padding: '4rem 1rem 2rem 1rem' }}
            initial="hidden" animate="visible" variants={fadeInUp}
          >
            <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome back, <span className="neon-text">{user.name.split(' ')[0]}</span></h1>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Here are your top market stories for today.</p>
              </div>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-full)', background: 'rgba(0, 240, 255, 0.1)' }}>
                  <Newspaper size={32} className="neon-text" />
              </div>
            </div>

            {newsLoading ? (
                <div style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '1rem' }}>Loading market pulse...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                    {news.slice(0, 4).map((item, i) => (
                        <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s', ...({ '&:hover': { transform: 'translateY(-4px)' } }) }}>
                            <h3 style={{ fontSize: '1.125rem', lineHeight: 1.4, margin: 0 }}>{item.title}</h3>
                            <div className="flex-between" style={{ marginTop: 'auto', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                                <span>{item.publisher}</span>
                                {item.providerPublishTime && <span>{new Date(item.providerPublishTime * 1000).toLocaleDateString()}</span>}
                            </div>
                        </a>
                    ))}
                </div>
            )}
          </motion.section>
      ) : (
          <motion.section
            className="container flex-center"
            style={{ flexDirection: 'column', minHeight: '80vh', textAlign: 'center', padding: '2rem 1rem' }}
            initial="hidden" animate="visible" variants={fadeInUp}
          >
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-full)', background: 'rgba(0, 240, 255, 0.1)', marginBottom: '2rem', boxShadow: '0 0 30px var(--color-accent-neon-glow)' }}>
              <Activity size={48} className="neon-text" />
            </div>
            <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1.5rem', background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Master the Market with <span className="neon-text" style={{ WebkitTextFillColor: 'var(--color-accent-neon)' }}>SARA</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>
              A high-tech, beginner-friendly financial ecosystem that balances Information Density with Ease of Use. AI predictions, live data, and community in one place.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" className="btn-primary flex-center" style={{ gap: '0.5rem', fontSize: '1.125rem', padding: '1rem 2rem' }}>
                Get Started <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn-secondary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
                Learn More
              </Link>
            </div>
          </motion.section>
      )}

      {/* ── Live Tickers ── */}
      <motion.section
        style={{ marginBottom: '5rem', opacity: loading ? 0.4 : 1, transition: 'opacity 0.4s' }}
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
      >
        {tickerData1.length > 0 && <Ticker items={tickerData1} speed="40s" direction="left" />}
        {tickerData2.length > 0 && <Ticker items={tickerData2} speed="45s" direction="right" />}
        {loading && tickerData1.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Loading live market data...</div>
        )}
      </motion.section>

      {/* ── Value Props ── */}
      <motion.section
        className="container" style={{ marginBottom: '6rem' }}
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {[
            { icon: <TrendingUp className="neon-text" size={32} />, title: 'AI Predictions', desc: 'Projected momentum forecasting for 1W, 1M, and 6M powered by Gemini AI and real news.' },
            { icon: <MessageCircle className="neon-text" size={32} />, title: 'WhatsApp Alerts', desc: 'Get personalized updates and important market moves delivered directly to you.' },
            { icon: <BookOpen className="neon-text" size={32} />, title: 'Learning Hub', desc: "Exclusive 'Trading 101' classes and a Reddit-style forum for stock discussions." },
            { icon: <ShieldAlert className="neon-text" size={32} />, title: 'Risk Assessment', desc: 'Clear Low-to-High gauge analysis protecting you from unnecessary losses.' }
          ].map((f, i) => (
            <motion.div key={i} variants={fadeInUp} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--color-bg-deep)', borderRadius: 'var(--radius-md)', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Market Sneak Peek (LIVE) ── */}
      <motion.section
        className="container" style={{ marginBottom: '6rem' }}
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeInUp}
      >
        <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '2rem' }}>Market <span className="neon-text">Sneak Peek</span></h2>
          <Link to="/market" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            Go to Market →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Live Chart */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
            {/* Symbol selector */}
            <div className="flex-between" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{peekSym}</h3>
                  {peekQuote && (
                    <>
                      <span style={{ fontSize: '1.5rem', fontWeight: 700, color: peekColor }}>
                        ${peekQuote.regularMarketPrice?.toFixed(2)}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: peekColor, fontWeight: 600 }}>
                        {peekIsUp ? '+' : ''}{peekQuote.regularMarketChangePercent?.toFixed(2)}%
                      </span>
                    </>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  {peekQuote?.shortName || peekQuote?.longName || ''} · 90-day chart
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {SNEAK_PEEK_SYMBOLS.map(s => (
                  <button
                    key={s.sym}
                    onClick={() => setPeekSym(s.sym)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      border: `1px solid ${s.sym === peekSym ? 'var(--color-accent-neon)' : 'var(--color-border)'}`,
                      background: s.sym === peekSym ? 'rgba(0,240,255,0.12)' : 'transparent',
                      color: s.sym === peekSym ? 'var(--color-accent-neon)' : 'var(--color-text-muted)',
                      fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
                    }}
                  >{s.sym}</button>
                ))}
              </div>
            </div>

            {/* Recharts AreaChart */}
            {peekLoading ? (
              <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                Loading {peekSym} chart...
              </div>
            ) : peekHistory.length === 0 ? (
              <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-trend-down)' }}>
                Could not load chart data for {peekSym}.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={peekHistory} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="peekGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={peekColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={peekColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} interval={Math.ceil(peekHistory.length / 8)} />
                  <YAxis domain={['auto', 'auto']} stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} dx={-4} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--color-bg-deep)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '8px' }}
                    formatter={(v) => [`$${v}`, 'Price']}
                  />
                  <Area type="monotone" dataKey="price" stroke={peekColor} strokeWidth={2} fill="url(#peekGrad)" dot={false} activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Major Movers */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', color: 'var(--color-text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Major Movers</h3>
            {loading ? (
              <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Loading...</div>
            ) : movers.length === 0 ? (
              <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Could not load market data.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {movers.map((stock, i) => (
                  <Link to={`/stock/${stock.sym}`} key={i} className="flex-between" style={{
                    padding: '0.875rem 1rem',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    textDecoration: 'none', color: 'inherit',
                    border: '1px solid transparent',
                    transition: 'border-color 0.2s'
                  }}
                    onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-accent-neon)' }}>{stock.sym}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stock.name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700 }}>${stock.price}</div>
                      <div style={{ fontSize: '0.8rem', color: Number(stock.change) >= 0 ? 'var(--color-trend-up)' : 'var(--color-trend-down)', fontWeight: 600 }}>
                        {Number(stock.change) >= 0 ? '+' : ''}{stock.change}%
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* ── Top Hub Stories ── */}
      <motion.section
        className="container glass-panel"
        style={{ padding: '2rem', marginBottom: '4rem', borderRadius: 'var(--radius-2xl)' }}
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
      >
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Top <span className="neon-text">Hub</span> Stories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[
            { t: 'Is AI overvalued in 2026? A deeper dive into PE ratios.', u: 'TechTrader', v: '1.2k' },
            { t: "My 6-month prediction for renewables based on latest policies.", u: 'EcoInvest', v: '842' },
            { t: "Why the Fed's latest move might trigger a tech rally.", u: 'MarketWatchNews', v: '3.4k' }
          ].map((post, i) => (
            <Link to="/hub" key={i} style={{ padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', display: 'block', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--color-accent-neon)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', lineHeight: 1.4, color: 'var(--color-text-main)' }}>{post.t}</h4>
              <div className="flex-between" style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                <span>By @{post.u}</span>
                <span>▲ {post.v}</span>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ── FAQs ── */}
      <motion.section
        className="container"
        style={{ marginBottom: '6rem', maxWidth: '800px' }}
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Frequently Asked <span className="neon-text">Questions</span></h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { q: 'Is SARA really for beginners?', a: 'Absolutely! We built SARA specifically to translate complex Wall Street data into clear, easy-to-understand insights.' },
            { q: 'How accurate is the AI Prediction Engine?', a: 'The AI provides predictions backed by real current news and historical momentum. It is a powerful tool for visual estimation and research, however it is not guaranteed financial advice.' },
            { q: 'Do I have to pay for data?', a: 'No! All core market data, charts, and base AI predictions are completely Free. Premium only unlocks personalized WhatsApp alerts and Pro classes.' }
          ].map((faq, i) => (
            <div key={i} className="glass-panel" style={{ overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '1.125rem', color: 'var(--color-text-main)', textAlign: 'left' }}>
                {faq.q}
                {openFaq === i ? <ChevronUp size={20} className="neon-text" /> : <ChevronDown size={20} className="neon-text" />}
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 1.5rem 1.5rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </motion.section>

    </div>
  );
};

export default Home;
