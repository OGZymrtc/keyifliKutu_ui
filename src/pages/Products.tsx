import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MultiRangeSlider from '../components/ui/multi-range-slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Product, Activity, Category, ActivityType, getActivities, getCategories, getActivityTypes, getAllProducts } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoriteContext';
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedActivity, setSelectedActivity] = useState(searchParams.get('activity') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [sortBy, setSortBy] = useState('priority');
  const [cities, setCities] = useState<string[]>([]);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchQuery, selectedActivity, selectedCategory, selectedType, selectedCity, priceRange, sortBy]);

  const loadFilters = async () => {
    try {
      const activitiesData = await getActivities();
      setActivities(activitiesData);

      const categoriesData = await getCategories();
      setCategories(categoriesData);

      const typesData = await getActivityTypes();
      setActivityTypes(typesData);

      const allProducts = await getAllProducts();
      const citiesData = allProducts.map((p) => p.city).filter(Boolean) as string[];
      const uniqueCities = [...new Set(citiesData)];
      setCities(uniqueCities as string[]);
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      let data = await getAllProducts();

      if (searchQuery) {
        const s = searchQuery.toLowerCase();
        data = data.filter((p) =>
          [p.title, p.description, p.sub_title].filter(Boolean).some((t) => String(t).toLowerCase().includes(s))
        );
      }
      if (selectedActivity !== 'all') {
        const typeIds = activityTypes
          .filter((t) => t.activity_id === selectedActivity)
          .map((t) => t.id);
        if (typeIds.length) {
          data = data.filter((p) => typeIds.includes(p.activity_type_id));
        }
      }
      if (selectedCategory !== 'all') {
        data = data.filter((p) => p.category_id === selectedCategory);
      }
      if (selectedType !== 'all') {
        data = data.filter((p) => p.activity_type_id === selectedType);
      }
      if (selectedCity !== 'all') {
        data = data.filter((p) => p.city === selectedCity);
      }
      data = data.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

      // Updated: Added priority sorting (default)
      switch (sortBy) {
        case 'priority':
          // Sort by priority DESC (highest priority first), then by newest
          data = data.sort((a, b) => {
            const priorityA = a.priority ?? 0;
            const priorityB = b.priority ?? 0;
            if (priorityB !== priorityA) {
              return priorityB - priorityA;
            }
            return new Date(b.create_date).getTime() - new Date(a.create_date).getTime();
          });
          break;
        case 'price-asc':
          data = data.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          data = data.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          data = data.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
          break;
        case 'newest':
          data = data.sort(
            (a, b) => new Date(b.create_date).getTime() - new Date(a.create_date).getTime()
          );
          break;
      }

      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (productId: string) => {
    if (isFavorite(productId)) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedActivity('all');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedCity('all');
    setPriceRange([0, 1000]);
    setSortBy('priority');
    setSearchParams({});
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Ara</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Deneyim Ara..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Şehir</h3>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger>
            <SelectValue placeholder="All cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Bütün Şehirler</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Tema</h3>
        <Select value={selectedActivity} onValueChange={setSelectedActivity}>
          <SelectTrigger>
            <SelectValue placeholder="All themes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Bütün Temalar</SelectItem>
            {activities.map((activity) => (
              <SelectItem key={activity.id} value={activity.id}>
                {activity.activity_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* <div>
        <h3 className="font-semibold mb-3">Aktivite Türü</h3>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Bütün Aktivite Türleri</SelectItem>
            {activityTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.activity_type_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>*/}

      <div>
        <h3 className="font-semibold mb-3">Fiyat Aralığı</h3>
        <MultiRangeSlider
          value={priceRange}
          min={0}
          max={5000}
          onChange={(v: number[]) => setPriceRange(v)}
        />
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Filtreleri Temizle
      </Button>
    </div>
  );

  return (

    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bütün Deneyimler</h1>
            <p className="text-gray-600">{products.length} Deneyim Bulundu</p>
          </div>
          <div className="flex gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {/* Updated: Added priority sorting option as default */}
                <SelectItem value="priority">Öncelik Sırası</SelectItem>
                <SelectItem value="newest">En Son Eklenenler</SelectItem>
                <SelectItem value="price-asc">Fiyat: Düşükten Yükseğe</SelectItem>
                <SelectItem value="price-desc">Fiyat: Yüksekten Düşüğe</SelectItem>
                <SelectItem value="rating">En Yüksek Puanlılar</SelectItem>
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtreler
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtreler</SheetTitle>
                  <SheetDescription>Size En Uygun Deneyimleri Bulun</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtreler
              </h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Aktiviteler Yükleniyor...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Herhangi Bir Aktivite Bulunamadı</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Filtreleri Temizle
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}