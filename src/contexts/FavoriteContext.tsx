import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, TABLES, Favorite } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface FavoritesContextType {
  favorites: Favorite[];
  loading: boolean;
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

interface LocalFavoriteItem {
  id: string;
  product_id: string;
  created_at: string;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// localStorage key for favorites
const FAVORITES_STORAGE_KEY = 'keyiflikutu_favorites';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  // Load favorites from localStorage or Supabase
  const loadFavorites = async () => {
    if (!user) {
      // Load from localStorage for non-authenticated users
      const localFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (localFavorites) {
        try {
          const parsed: LocalFavoriteItem[] = JSON.parse(localFavorites);
          // Fetch product details for each item
          const itemsWithProducts = await Promise.all(
            parsed.map(async (item) => {
              const { data: product } = await supabase
                .from(TABLES.PRODUCT)
                .select('*')
                .eq('id', item.product_id)
                .single();
              return { ...item, product, user_id: '' };
            })
          );
          setFavorites(itemsWithProducts);
        } catch (error) {
          console.error('Error loading favorites from localStorage:', error);
        }
      }
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(TABLES.FAVORITES)
        .select(`
          *,
          product:${TABLES.PRODUCT}(*)
        `)
        .eq('user_id', user.id);

        if (error) throw error;

        if (Array.isArray(data)) {
          setFavorites(data as unknown as Favorite[]);
        } else {
          console.error('Unexpected Supabase response format:', data);
          setFavorites([]);
        }
        
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  // Sync localStorage favorites to Supabase on login
  const syncLocalFavoritesToSupabase = async () => {
    if (!user) return;

    const localFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!localFavorites) return;

    try {
      const parsed: LocalFavoriteItem[] = JSON.parse(localFavorites);
      for (const item of parsed) {
        await supabase.from(TABLES.FAVORITES).upsert({
          user_id: user.id,
          product_id: item.product_id,
        }, { onConflict: 'user_id,product_id' });
      }
      localStorage.removeItem(FAVORITES_STORAGE_KEY);
      await loadFavorites();
      toast.success('Favorites synced successfully');
    } catch (error) {
      console.error('Error syncing favorites:', error);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  useEffect(() => {
    if (user) {
      syncLocalFavoritesToSupabase();
    }
  }, [user]);

  const addToFavorites = async (productId: string) => {
    if (!user) {
      // Add to localStorage
      const localFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      const favorites: LocalFavoriteItem[] = localFavorites ? JSON.parse(localFavorites) : [];
      
      if (favorites.some((item) => item.product_id === productId)) {
        toast.info('Already in favorites');
        return;
      }

      favorites.push({
        id: `local_${Date.now()}`,
        product_id: productId,
        created_at: new Date().toISOString(),
      });

      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      await loadFavorites();
      toast.success('Added to favorites');
      return;
    }

    try {
      const { error } = await supabase.from(TABLES.FAVORITES).insert({
        user_id: user.id,
        product_id: productId,
      });

      if (error) throw error;
      await loadFavorites();
      toast.success('Added to favorites');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add to favorites');
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) {
      const localFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (localFavorites) {
        const favorites: LocalFavoriteItem[] = JSON.parse(localFavorites);
        const filtered = favorites.filter((item) => item.product_id !== productId);
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(filtered));
        await loadFavorites();
        toast.success('Removed from favorites');
      }
      return;
    }

    try {
      const { error } = await supabase
        .from(TABLES.FAVORITES)
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      await loadFavorites();
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some((fav) => fav.product_id === productId);
  };

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};