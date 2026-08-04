import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import './styles/tailwind.css'
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
)
