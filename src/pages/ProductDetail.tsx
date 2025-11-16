import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '../components/ui/seperator';
import { Star, Heart, ShoppingCart, MapPin, Calendar, Ticket, ArrowLeft } from 'lucide-react';
import { Product, getProductById, getProductsByCategory } from '@/lib/supabase';
import { formatPriceTL, getCategoryFallbackImage } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '../contexts/FavoriteContext';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const loadProduct = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const found = await getProductById(id);
      setProduct(found);
      if (found?.category_id) {
        const related = await getProductsByCategory(found.category_id);
        setRelatedProducts(related.filter((p) => p.id !== found.id).slice(0, 4));
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Ürün yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product.id, quantity);
    }
  };

  const handleToggleFavorite = async () => {
    if (!product) return;

    if (isFavorite(product.id)) {
      await removeFromFavorites(product.id);
    } else {
      await addToFavorites(product.id);
    }
  };

  // Check if external URL is valid
  const isValidUrl = (url?: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg mb-4">Ürün bulunamadı</p>
        <Link to="/products">
          <Button>Tüm Deneyimleri Gör</Button>
        </Link>
      </div>
    );
  }

  const hasValidExternalUrl = isValidUrl(product.external_url);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Deneyimlere Dön
          </Button>
        </Link>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="relative">
            <img
              src={product.image_url || getCategoryFallbackImage(product.category_id)}
              alt={product.title}
              className="w-full h-auto max-h-[600px] object-contain rounded-lg shadow-lg bg-gray-100"
            />
            {product.rating && (
              <Badge className="absolute top-4 left-4 bg-white/90 text-gray-900">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                {product.rating}
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
              {product.sub_title && <p className="text-xl text-gray-600">{product.sub_title}</p>}
            </div>

            <div className="flex items-center gap-4">
              {product.city && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  {product.city}
                  {product.district && `, ${product.district}`}
                </div>
              )}
              {product.date && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  {product.date}
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-bold mb-4">Açıklama</h2>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'Bu harika etkinlikle hayatının macerasını yaşa.'}
              </p>
            </div>

            {/* Updated: Display full_address if available */}
            {product.full_address && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Adres
                </h3>
                <p className="text-gray-600">{product.full_address}</p>
              </div>
            )}

            {product.ticket_rule && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Ticket className="h-5 w-5 mr-2" />
                  Bilet Bilgisi
                </h3>
                <p className="text-gray-600">{product.ticket_rule}</p>
              </div>
            )}

            <Separator />

            {/* Price and Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Fiyat</p>
                  <p className="text-4xl font-bold text-orange-600 mt-5">{formatPriceTL(product.price)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleToggleFavorite}>
                  <Heart className={`h-6 w-6 ${isFavorite(product.id) ? 'fill-orange-500 text-red-500' : ''}`} />
                </Button>
              </div>

              <div className="space-y-4">
                {product.price > 0 && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Adet</label>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          -
                        </Button>
                        <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                        <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Toplam:</span>
                      <span className="text-orange-600">{`${(product.price * quantity).toLocaleString('tr-TR')} TL`}</span>
                    </div>

                    <Button className="w-full text-white bg-gradient-to-r from-amber-600 to-rose-500 hover:brightness-110" size="lg" onClick={handleAddToCart}>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Sepete Ekle
                    </Button>
                  </>
                )}

                {product.external_url && (
                  hasValidExternalUrl ? (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={product.external_url} target="_blank" rel="noopener noreferrer">
                        Resmi Siteyi Ziyaret Et
                      </a>
                    </Button>
                  ) : (
                    <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded border">
                      <p className="break-all">{product.external_url}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Benzer Deneyimler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`}>
                  <ProductCard product={relatedProduct} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}