import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Flame, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Award,
  ChevronRight,
  ChevronLeft,
  Clock,
  Tag,
  Copy,
  Check
} from 'lucide-react';
import { getProducts, getCategories, getCoupons } from '../services/api';
import { Product, Category, Coupon } from '../types';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatCurrency';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    {
      badge: "Festive Tech Carnival",
      title: "Supercharged Sound & Computing at Direct Prices",
      subtitle: "Discover high-performance noise-canceling headphones, Apple M3 MacBooks, and titanium smartwatches with 1-day express delivery across India.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80",
      cta: "Explore Tech Fest",
      link: "/products?category=Electronics",
      accent: "from-blue-600 to-indigo-600"
    },
    {
      badge: "Streetwear & Sneaker Drop",
      title: "Trending Footwear, Denim & Urban Streetwear",
      subtitle: "Upgrade your style with authentic Nike Air Max, Adidas Ultraboosts, and classic Sherpa trucker jackets designed for all-day comfort.",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80",
      cta: "Shop Footwear",
      link: "/products?category=Footwear",
      accent: "from-rose-600 to-amber-600"
    },
    {
      badge: "Modern Living & Lifestyle",
      title: "Smart Ambiance & Minimalist Living Essentials",
      subtitle: "Transform your home with voice-controlled RGB floor lamps, Italian leather timepieces, and artisan pour-over coffee gear.",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1000&auto=format&fit=crop&q=80",
      cta: "Shop Home & Living",
      link: "/products?category=Home%20%26%20Living",
      accent: "from-purple-600 to-pink-600"
    }
  ];

  // Deal of the Day Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Autoplay Hero Carousel
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(slideTimer);
  }, [heroSlides.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allProds, cats, couponList] = await Promise.all([
          getProducts(),
          getCategories(),
          getCoupons()
        ]);
        setFeaturedProducts(allProds.filter((p) => p.is_featured));
        setTrendingProducts(allProds.filter((p) => p.is_trending));
        setCategories(cats);
        setCoupons(couponList);
      } catch (err) {
        console.error('Failed to load home page products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Carousel */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:py-28 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[520px]">
          
          {/* Slide Text */}
          <div className="space-y-6 text-center lg:text-left transition-all duration-500">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>{heroSlides[currentSlide].badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {heroSlides[currentSlide].title}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {heroSlides[currentSlide].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
              <Link
                to={heroSlides[currentSlide].link}
                className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center space-x-2 transition active:scale-95"
              >
                <span>{heroSlides[currentSlide].cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?is_trending=true"
                className="px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 backdrop-blur-sm flex items-center justify-center space-x-2 transition"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Hot Trending</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-black text-white">50,000+</p>
                <p className="text-xs text-gray-400 font-medium">Orders Delivered</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs text-gray-400 font-medium">Authentic & GST Billed</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">₹0</p>
                <p className="text-xs text-gray-400 font-medium">Shipping Over ₹999</p>
              </div>
            </div>
          </div>

          {/* Slide Visual Image */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src={heroSlides[currentSlide].image}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                <span className="text-[10px] font-black uppercase tracking-wider text-yellow-300">Trending Deal</span>
                <h3 className="text-sm font-bold mt-0.5">{heroSlides[currentSlide].badge}</h3>
                <Link
                  to={heroSlides[currentSlide].link}
                  className="mt-2 inline-flex items-center text-xs font-bold text-blue-300 hover:text-white"
                >
                  <span>Explore Collection</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === i ? 'w-8 bg-blue-500' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. Interactive Coupon Vouchers Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                Savings Hub
              </span>
              <h3 className="text-base font-extrabold text-gray-900 mt-1">Exclusive Discount Vouchers for You</h3>
            </div>
            <p className="text-xs text-gray-500">Click any voucher to copy the code directly</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {coupons.map((c) => (
              <div
                key={c.code}
                onClick={() => handleCopyCode(c.code)}
                className="bg-white p-3.5 rounded-2xl border border-blue-200/60 shadow-xs hover:border-blue-400 hover:shadow-md cursor-pointer transition flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center space-x-1.5 font-mono font-black text-sm text-blue-700">
                    <Tag className="w-3.5 h-3.5 text-blue-600" />
                    <span>{c.code}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{c.description}</p>
                </div>

                <div className="p-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition">
                  {copiedCode === c.code ? <Check className="w-4 h-4 text-emerald-600 group-hover:text-white" /> : <Copy className="w-4 h-4" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Explore Categories</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Top-rated collections handpicked for Indian customers</p>
          </div>
          <Link to="/products" className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-3xl overflow-hidden aspect-4/5 bg-gray-900 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">{cat.count} Items</span>
                <h3 className="text-base font-extrabold mt-0.5">{cat.name}</h3>
                <p className="text-[11px] text-gray-300 line-clamp-1 mt-0.5 opacity-90">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Flash Deal of the Day with Countdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span>Limited Time Flash Sale</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Flat 20% OFF Everything Across India!
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-md">
              Apply coupon code <span className="font-extrabold text-yellow-300 underline font-mono">FIRST20</span> during checkout to claim your instant discount.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center space-x-3">
            <div className="text-center bg-black/25 backdrop-blur-md rounded-2xl px-4 py-3 min-w-[70px]">
              <span className="text-2xl sm:text-3xl font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="block text-[10px] uppercase font-bold text-blue-200 mt-0.5">Hours</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="text-center bg-black/25 backdrop-blur-md rounded-2xl px-4 py-3 min-w-[70px]">
              <span className="text-2xl sm:text-3xl font-black">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="block text-[10px] uppercase font-bold text-blue-200 mt-0.5">Mins</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="text-center bg-black/25 backdrop-blur-md rounded-2xl px-4 py-3 min-w-[70px]">
              <span className="text-2xl sm:text-3xl font-black">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="block text-[10px] uppercase font-bold text-blue-200 mt-0.5">Secs</span>
            </div>
          </div>

          <Link
            to="/products"
            className="px-6 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition active:scale-95 whitespace-nowrap"
          >
            Claim Deals Now
          </Link>
        </div>
      </section>

      {/* 5. Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Handpicked For You</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Featured Indian Picks</h2>
          </div>
          <Link to="/products" className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1">
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-gray-100 rounded-3xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 6. Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>Most Popular</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Trending This Week</h2>
          </div>
          <Link to="/products?is_trending=true" className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-gray-100 rounded-3xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 7. Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-black text-gray-900">What Our Indian Shoppers Say</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Real feedback from verified purchasers across India</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex text-amber-400">
              {"★".repeat(5)}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 italic">
              "The Sony noise-canceling headphones arrived in just 2 days in Ahmedabad. Pristine condition, amazing sound quality, and official GST invoice was included!"
            </p>
            <div className="pt-2 border-t border-gray-50 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                AP
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Aarav Patel</p>
                <p className="text-[10px] text-gray-400">Verified Buyer • Ahmedabad, Gujarat</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex text-amber-400">
              {"★".repeat(5)}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 italic">
              "Ordered the Nike Air Max sneakers using Cash on Delivery in Surat. Size was a perfect fit and customer support on WhatsApp answered my query within 2 minutes!"
            </p>
            <div className="pt-2 border-t border-gray-50 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                PS
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Pooja Sharma</p>
                <p className="text-[10px] text-gray-400">Verified Buyer • Surat, Gujarat</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex text-amber-400">
              {"★".repeat(5)}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 italic">
              "The MacBook Air M3 deal was unbelievable! Saved over ₹20,000 with the launch coupon. Highly recommended store for genuine electronics."
            </p>
            <div className="pt-2 border-t border-gray-50 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                RD
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Rohan Desai</p>
                <p className="text-[10px] text-gray-400">Verified Buyer • Vadodara, Gujarat</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

    </div>
  );
};
