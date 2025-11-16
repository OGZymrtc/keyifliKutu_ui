import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoriteContext';
import { Navbar } from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import AboutUs from './pages/AboutUs';
import BeOurPartner from './pages/BeOurPartner';
import Helper from './pages/Helper';
import { Footer } from './components/Footer';
import Gdpr from './pages/Gdpr';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <Toaster />
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/beOurPartner" element={<BeOurPartner />} />
                <Route path="/aboutUs" element={<AboutUs />} />
                <Route path="/gift" element={<Home />} />
                <Route path="/gdpr" element={<Gdpr />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
              <Helper />
            </BrowserRouter>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;