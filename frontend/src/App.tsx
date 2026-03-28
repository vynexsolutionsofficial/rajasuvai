import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/global/Navbar/Navbar';
import AnnouncementBar from './components/global/AnnouncementBar/AnnouncementBar';
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import Footer from './components/global/Footer/Footer';

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
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
