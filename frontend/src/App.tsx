import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/global/Navbar/Navbar';
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import CartPage from './pages/Cart/CartPage';
import Footer from './components/global/Footer/Footer';
import ProductDetail from './pages/Product/ProductDetail';
import SupportPage from './pages/Support/SupportPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import AddressSelection from './pages/Checkout/AddressSelection';
import AnnouncementBar from './components/global/AnnouncementBar/AnnouncementBar';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Dashboard from './pages/Admin/Dashboard';
import ProductManagement from './pages/Admin/ProductManagement';
import OrderManagement from './pages/Admin/OrderManagement';
import UserManagement from './pages/Admin/UserManagement';
import OffersManagement from './pages/Admin/OffersManagement';
import InventoryManagement from './pages/Admin/InventoryManagement';
import Settings from './pages/Admin/Settings';

import Profile from './pages/Profile/Profile';
import UserProtectedRoute from './components/admin/UserProtectedRoute';
import MobileBottomNav from './components/global/MobileNav/MobileBottomNav';

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

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHome = location.pathname === '/';
  const isHeaderScrolled = isScrolled || !isHome;

  return (
    <div className="app">
      {!isAdminRoute && (
        <header className={`site-header ${isHeaderScrolled ? 'scrolled' : ''}`}>
          <AnnouncementBar />
          <Navbar />
        </header>
      )}
      
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<SupportPage />} />
          <Route path="/story" element={<Home />} />

          {/* User Protected Routes */}
          <Route element={<UserProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout/address" element={<AddressSelection />} />
            <Route path="/checkout/payment" element={<CheckoutPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="inventory" element={<InventoryManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="offers" element={<OffersManagement />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <MobileBottomNav />}
    </div>
  );
}

export default App;
