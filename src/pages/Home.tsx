import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Gift, Volume2, VolumeX, Settings } from 'lucide-react';
import { Activity, Product, getActivities, getFeaturedProducts } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoriteContext';
import HomepageVideo from '../assets/home-page-cinematic.mp4';
import { StatCard } from './StatCard';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  useEffect(() => {
    loadActivities();
    loadFeaturedProducts();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    setIsMuted(true);
    video.play().catch((err) => console.log("Autoplay engellendi:", err));

    const enableSound = () => {
      if (video.muted) {
        video.muted = false;
        setIsMuted(false);

        setTimeout(() => {
          video.muted = true;
          setIsMuted(true);
        }, 8000);
      }
      window.removeEventListener("click", enableSound);
      window.removeEventListener("keydown", enableSound);
    };

    window.addEventListener("click", enableSound);
    window.addEventListener("keydown", enableSound);

    return () => {
      window.removeEventListener("click", enableSound);
      window.removeEventListener("keydown", enableSound);
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const loadActivities = async () => {
    try {
      const data = await getActivities();
      setActivities(data.slice(0, 6));
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const loadFeaturedProducts = async () => {
    try {
      const data = await getFeaturedProducts(9);
      setFeaturedProducts(data);
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleToggleFavorite = async (productId: string) => {
    if (isFavorite(productId)) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  };

  const useScrollAnimation = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

    useEffect(() => {
      if (inView) controls.start({ opacity: 1, y: 0 });
    }, [controls, inView]);

    return { ref, controls };
  };

  const featuredAnim = useScrollAnimation();
  const giftAnim = useScrollAnimation();

  return (
    <div className="min-h-screen text-gray-800">

      {/* 🎥 Hero Section with Sound Control */}
      <section className="relative h-[96vh] flex items-center justify-center overflow-visible">
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center -translate-y-8"
          poster="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&h=1080&fit=crop"
        >
          <source src={HomepageVideo} type="video/mp4" />
        </video>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 z-20">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-3 h-3 border-b-2 border-r-2 rotate-45"
              style={{
                animation: `scrollArrow 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            ></span>
          ))}

          <style>
            {`
      @keyframes scrollArrow {
        0% {
          transform: rotate(45deg) translateY(0);
          opacity: 0;
        }
        50% {
          transform: rotate(45deg) translateY(8px);
          opacity: 1;
        }
        100% {
          transform: rotate(45deg) translateY(0);
          opacity: 0;
        }
      }
    `}
          </style>
        </div>


        {/* 🔊 Ses Aç/Kapa Butonu */}
        <button
          onClick={toggleMute}
          className="absolute bottom-6 right-6 z-20 bg-white/60 hover:bg-white/80 text-gray-900 rounded-full p-3 transition"
        >
          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </button>

        {/* 🔧 Admin Panel Button */}
        <Link to="/admin">
          <button
            className="absolute bottom-6 left-6 z-20 bg-white/60 hover:bg-white/80 text-gray-900 rounded-full p-3 transition"
            title="Admin Panel"
          >
            <Settings className="h-6 w-6" />
          </button>
        </Link>
      </section>

      {/* 🔍 Search Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-12 px-4"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Unutulmaz Deneyimleri Keşfet
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-600">
              Paraşütle atlamadan spa keyfine, sıradaki maceranı bul
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Bugün ne deneyimlemek istersin?"
                  className="
                  pl-10 h-12 text-base
                  border-gray-300
                  focus:border-orange-500
                  focus-visible:ring-0 focus-visible:ring-offset-0
                  "
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-8 text-white bg-gradient-to-r from-orange-500 to-orange-400 hover:brightness-110"
              >
                Ara
              </Button>
            </form>
          </div>
        </motion.section>
      </div>
      {/* 🟠 Categories Section */}
      <motion.section
        className="about py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="about-content grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* About Text */}
            <div className="about-text space-y-6">
              <h2 className="section-title text-3xl md:text-4xl font-bold text-center md:text-left">
                Keyifli Kutu Farkı
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Her aktivite, özenle seçilmiş deneyimler ve unutulmaz anılarla dolu.
                Premium kalite, güvenilir partnerler ve sınırsız seçeneklerle
                sevdiklerinize en özel hediyeyi sunuyoruz.
              </p>
              <ul className="benefits-list list-none space-y-2 text-gray-700 font-medium">
                <li>✨ 100+ Farklı Deneyim Seçeneği</li>
                <li>🎁 Premium Ambalaj ve Sunum</li>
                <li>🌟 Esnek Kullanım Tarihleri</li>
                <li>💝 Eşsiz Bir Deneyim</li>
              </ul>
            </div>

            {/* Stats Cards */}
            <div className="about-stats grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { number: 50000, label: 'Mutlu Müşteri', suffix: 'K+' },
                { number: 100, label: 'Deneyim Seçeneği', suffix: '+' },
                { number: 4.9, label: 'Müşteri Puanı', suffix: '' },
              ].map((stat, idx) => (
                <StatCard key={idx} stat={stat} delay={idx * 0.2} />
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="container mt-16">
            <h2 className="section-title text-3xl font-bold md:text-4xl mb-12 text-center">
              Kutunuzda Neler Var?
            </h2>
            <div className="features-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: '🧖‍♀️', title: 'Spa & Wellness', desc: 'Rahatlatıcı spa deneyimleri, masaj seansları ve wellness aktiviteleri' },
                { icon: '✨', title: 'Lüks Deneyimler', desc: 'Premium araçlar, lüks akşam yemekleri ve daha fazlası' },
                { icon: '🪂', title: 'Macera & Heyecan', desc: 'Paraşütle atlama, ekstrem sporlar ve adrenalin dolu aktiviteler' },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className="feature-card bg-off-white p-10 rounded-2xl text-center border-2 border-transparent hover:border-orange-500 hover:shadow-lg transition-transform"
                >
                  <div className="feature-icon text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-orange-500 text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>


      {/* 💎 Featured Experiences - Now showing top 9 by priority */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.section
          ref={featuredAnim.ref}
          initial={{ opacity: 0, y: 60 }}
          animate={featuredAnim.controls}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="py-16"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Öne Çıkan Deneyimler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product} />
              ))}
            </div>
          </div>
        </motion.section>
      </div>


      {/* 🎁 Gift Section */}
      <motion.section
        ref={giftAnim.ref}
        initial={{ opacity: 0, y: 60 }}
        animate={giftAnim.controls}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="py-16 px-4 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <Gift className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Bir Deneyim Hediye Et</h2>
          <p className="text-xl mb-8">
            Unutulmaz anıları hediye et. Doğum günleri, yıldönümleri ya da sadece mutlu etmek için.
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="bg-white text-orange-700 hover:bg-rose-50">
              Tüm Deneyimleri Gör
            </Button>
          </Link>
        </div>
      </motion.section>

    </div>
  );
}