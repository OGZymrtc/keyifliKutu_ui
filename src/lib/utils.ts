import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPriceTL = (price?: number) => {
  if (typeof price !== 'number' || price === 0) return 'Ücretsiz';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(price);
};

// Category-based fallback images for when a product image is missing
const CATEGORY_FALLBACKS: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop', // Tema & Macera Parkları
  '2': 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1200&auto=format&fit=crop', // Oyun & Etkileşimli
  '3': '/images/WaterAdventure.jpg', // Su Maceraları
  '4': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop', // Doğa ve Arazi
  '5': 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=1200&auto=format&fit=crop', // Gökyüzü
  '6': '/images/Focused.jpg', // Hedef Odaklı
  '7': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop', // Masaj
  '8': 'https://images.unsplash.com/photo-1544986581-efac024faf62?q=80&w=1200&auto=format&fit=crop', // Spa & Termal
  '9': '/images/Hamam.jpg', // Hamam
  '10': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop', // Güzellik & Bakım
  '11': '/images/Sensory.jpg', // Duyusal
  '12': '/images/Cooking.jpg', // Yemek Atölyeleri
  '13': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop', // Sanat
  '14': '/images/PersonalCare.jpg', // Kişisel Bakım
  '15': '/images/Adults.jpg', // Yetişkinler (Ücretsiz)
  '16': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop', // Çocuklar
  '17': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop', // Tüm Yaşlar
};

export function getCategoryFallbackImage(categoryId?: string): string {
  if (!categoryId) return '/images/Adults.jpg';
  return CATEGORY_FALLBACKS[categoryId] || CATEGORY_FALLBACKS['15'];
}