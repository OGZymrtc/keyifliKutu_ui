import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import keyifliLogo from '../assets/logo.jpeg';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ShoppingCart, Heart, User, Menu, X, Trash2, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoriteContext';
import { formatPriceTL, getCategoryFallbackImage } from '../lib/utils';
import { toast } from 'sonner';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signIn, signUp, signInWithGoogle, signOut } = useAuth();
  const { getCartCount, cartItems, removeFromCart, getCartTotal } = useCart();
  const { favorites, removeFromFavorites } = useFavorites();
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed in successfully');
      setAuthOpen(false);
      setEmail('');
      setPassword('');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created! Please check your email to verify.');
      setAuthOpen(false);
      setEmail('');
      setPassword('');
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error.message);
    }
  };

  const navLinks = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Tüm Deneyimler', path: '/products' },
    { name: 'Partnerimiz Ol', path: '/beOurPartner' },
    { name: 'Hakkımızda', path: '/aboutUs' },
    {/*{ name: 'Aktivitem Var', path: '/gift' },*/ }
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={keyifliLogo}
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
                >
                  {link.name}
                </Link>
              ))}
              <div className="relative">
                <span className="text-gray-700 hover:text-orange-600 transition-colors font-medium cursor-pointer peer">
                  Aktivitem Var
                </span>
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-96 p-4 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-700 text-sm font-medium opacity-0 peer-hover:opacity-100 transition-opacity z-50">
                  🌼 Keyifli’den Merhaba!<br /><br />
                  Selaaam! ☀️<br />
                  Şu anda sizlere yeni Keyifli aktiviteler ve etkinlikler sunmak için yoğun bir şekilde çalışıyoruz!<br />
                  Bu süreçte sadece ücretsiz etkinlikleri paylaşıyoruz — ama yakında çok daha fazlası geliyor! 🎉<br /><br />
                  💛 Instagram sayfamızı takip etmeyi ve<br />
                  💬 bizi beklemeye devam etmeyi unutma!<br /><br />
                  Çok yakında Türkiye’de herkesin çeşitli, uygun fiyatlı ve keyifli aktiviteler deneyimleyebileceği bir platformla karşınızda olacağız. 🇹🇷<br /><br />
                  Hazır ol Türkiye! 🌈✨
                </div>
              </div>

            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Favorites */}
              <Sheet open={favoritesOpen} onOpenChange={setFavoritesOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative peer">
                    <Heart className="h-5 w-5" />
                    {favorites.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-500">
                        {favorites.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Favoriler</SheetTitle>
                    <SheetDescription>Kaydettiğin deneyimler</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 overflow-y-auto max-h-[calc(100vh-150px)] space-y-4 pr-2 pb-4">
                    {favorites.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">Henüz favori yok</p>
                    ) : (
                      favorites.map((fav) => (
                        <div key={fav.id} className="flex gap-4 border-b pb-4">
                          <img
                            src={fav.product?.image_url || getCategoryFallbackImage(fav.product?.category_id)}
                            alt={fav.product?.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{fav.product?.title}</h4>
                            <p className="text-orange-600 font-bold">{formatPriceTL(fav.product?.price)}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 p-0 h-auto mt-1 flex items-center gap-1"
                              onClick={() => removeFromFavorites(fav.product_id)}
                            >
                              <Trash2 className="h-3 w-3" />
                              Kaldır
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Cart */}
              <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {getCartCount() > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-500">
                        {getCartCount()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Sepet</SheetTitle>
                    <SheetDescription>Ürünlerini gözden geçir</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 max-h-[400px] overflow-y-auto space-y-4 pr-2">
                    {cartItems.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">Sepetin boş</p>
                    ) : (
                      cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 border-b pb-4">
                          <img
                            src={item.product?.image_url || getCategoryFallbackImage(item.product?.category_id)}
                            alt={item.product?.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{item.product?.title}</h4>
                            <p className="text-gray-600 text-sm">Adet: {item.quantity}</p>
                            <p className="text-orange-600 font-bold">
                              {formatPriceTL((item.product?.price || 0) * item.quantity)}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 p-0 h-auto"
                              onClick={() => removeFromCart(item.product_id)}
                            >
                              Kaldır
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {cartItems.length > 0 && (
                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Toplam:</span>
                        <span className="text-orange-600">{formatPriceTL(getCartTotal())}</span>
                      </div>
                      <Button
                        className="w-full mt-4 text-white bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 hover:brightness-110"
                        onClick={() => toast.success('Ödeme yakında!')}
                      >
                        Satın Al
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>


              {/* Auth */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {user.email?.split('@')[0] || 'Hesabım'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/favorites')}>Favoriler</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/cart')}>Sepet</DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Settings className="h-4 w-4 mr-2" />
                          Panel
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>Çıkış Yap</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => setAuthOpen(true)} className="text-white bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 hover:brightness-110">Giriş Yap</Button>
              )}

              {/* Mobile Menu */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block py-2 text-gray-700 hover:text-orange-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Auth Dialog */}
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>KeyifliKutu'ya Hoş Geldin</DialogTitle>
            <DialogDescription>Devam etmek için giriş yap ya da hesap oluştur</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Giriş Yap</TabsTrigger>
              <TabsTrigger value="signup">Kayıt Ol</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">E-posta</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signin-password">Şifre</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full text-white bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 hover:brightness-110" disabled={loading}>
                  {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Ya da şu şekilde devam et</span>
                  </div>
                </div>
                <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                  Google
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-email">E-posta</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Şifre</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full text-white bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 hover:brightness-110" disabled={loading}>
                  {loading ? 'Hesap oluşturuluyor...' : 'Kayıt Ol'}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Ya da şu şekilde devam et</span>
                  </div>
                </div>
                <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                  Google
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};