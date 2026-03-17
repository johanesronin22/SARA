import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Page Imports
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Market from './pages/Market';
import Watchlists from './pages/Watchlists';
import StockDetail from './pages/StockDetail';
import Hub from './pages/Hub';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/market" element={<Market />} />
            <Route path="/watchlists" element={<Watchlists />} />
            <Route path="/stock/:id" element={<StockDetail />} />
            <Route path="/hub" element={<Hub />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
