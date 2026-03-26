import AnnouncementBar from './components/global/AnnouncementBar/AnnouncementBar';
import AdvertisementBanner from './components/global/AdvertisementBanner/AdvertisementBanner';
import Navbar from './components/global/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import HomeContent from './components/HomeContent/HomeContent';
import Footer from './components/global/Footer/Footer';

function App() {
  return (
    <div className="app">
      <AnnouncementBar />
      <AdvertisementBanner />
      <Navbar />
      <main>
        <Hero />
        <HomeContent />
      </main>
      <Footer />
    </div>
  );
}

export default App;
