import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowRight, Heart, Star, ShoppingCart, Calendar } from "lucide-react";
import { formatPriceTL, getCategoryFallbackImage } from "../lib/utils";
import { Product } from "../lib/supabase";
import { useCart } from "../contexts/CartContext";
import { useFavorites } from "../contexts/FavoriteContext";
import { Button } from "../components/ui/button";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

    const handleClick = () => {
        navigate(`/product/${product.id}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleToggleFavorite = async (productId: string) => {
        if (isFavorite(productId)) {
            await removeFromFavorites(productId);
        } else {
            await addToFavorites(productId);
        }
    };

    return (
        <Card
            onClick={handleClick}
            className="relative overflow-hidden border border-gray-200 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col cursor-pointer"
        >
            {/* Görsel */}
            <div className="pt-4 pr-4 pb-2 pl-4 bg-white rounded-xl flex justify-center items-center relative">
                <div className="w-full h-[250px] overflow-hidden rounded-lg">
                    <img
                        src={product.image_url || getCategoryFallbackImage(product.category_id)}
                        alt={product.title || "Product image"}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = getCategoryFallbackImage(product.category_id);
                        }}
                        loading="lazy"
                    />
                </div>

                {/* Rating Badge */}
                {product.rating && (
                    <Badge className="absolute bottom-2 left-2 bg-white/90 text-gray-900">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {product.rating}
                    </Badge>
                )}
            </div>

            {/* İçerik */}
            <CardContent className="p-4 flex flex-col justify-between flex-1">
                <div className="space-y-2">
                    {/* Etiketler: Sadece ticket_rule varsa */}
                    <Badge
                        className={`text-xs rounded-full px-3 py-1 font-semibold shadow-sm border border-orange-200 bg-white text-gray-500 inline-block w-auto mb-2 ${!product.ticket_rule || !product.ticket_rule.trim() ? "invisible" : "visible"
                            }`}
                    >
                        {product.ticket_rule}
                    </Badge>

                    {/* Başlık */}
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-1">
                        {product.title}
                    </h3>

                    {/* Alt Başlık */}
                    {product.sub_title && (
                        <p className="text-sm text-gray-700 truncate" title={product.sub_title}>
                            {product.sub_title}
                        </p>
                    )}

                    {/* Tarih */}
                    {product.date && (
                        <div className="flex items-center text-sm text-gray-500 gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{product.date}</span>
                        </div>
                    )}

                    {/* Şehir */}
                    {product.city && (
                        <p className="text-sm text-gray-500">📍 {product.city}</p>
                    )}
                </div>

                {/* Fiyat, ok ikonu ve favori */}
                <div className="flex justify-between items-center pt-4 mt-2">
                    <p className="text-xl font-bold text-orange-600">
                        {product.price === 0 ? "Ücretsiz" : formatPriceTL(product.price)}
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="lg"
                            className="bg-transparent hover:bg-white/3"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(product.id);
                            }}
                        >
                            <Heart
                                className={`${isFavorite(product.id) ? "fill-orange-500 stroke-orange-500" : "stroke-orange-500"}`}
                            />
                        </Button>
                        <ArrowRight className="w-5 h-5 text-orange-500" />
                    </div>
                </div>

                {/* Sepete Ekle */}
                {product.price > 0 && (
                    <div className="flex gap-2 mt-4">
                        <Button
                            className="flex-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product.id);
                            }}
                        >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Sepete Ekle
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
