import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/global/Navbar/Navbar';
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import CartPage from './pages/Cart/CartPage';
import Footer from './components/global/Footer/Footer';
import ProductDetail from './pages/Product/ProductDetail';
import SupportPage from './pages/Support/SupportPage';
import AnnouncementBar from './components/global/AnnouncementBar/AnnouncementBar';

function App() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';
  const isHeaderScrolled = isScrolled || !isHome;

  return (
    <div className="app">
      <header className={`site-header ${isHeaderScrolled ? 'scrolled' : ''}`}>
        <AnnouncementBar />
        <Navbar />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<SupportPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
