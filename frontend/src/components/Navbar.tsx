import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  Menu, 
  X, 
  Truck, 
  UserCheck, 
  Sparkles,
  MapPin,
  ChevronDown,
  Tag,
  Check,
  Copy
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../services/api';
import { Product } from '../types';
import { formatINR } from '../utils/formatCurrency';

export const Navbar: React.FC = () => {
  const { totalItems, totalAmount, setIsCartOpen, wishlist, deliveryPincode, setDeliveryPincode } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [pincodeInput, setPincodeInput] = useState(deliveryPincode);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Search autocomplete
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const data = await getProducts({ search: searchQuery.trim(), limit: 5 } as any);
        setSuggestions(data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside search suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      const catParam = searchCategory !== 'All' ? `&category=${encodeURIComponent(searchCategory)}` : '';
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}${catParam}`);
      setMobileMenuOpen(false);
    }
  };

  const handleSavePincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeInput.length === 6) {
      setDeliveryPincode(pincodeInput);
      setIsPincodeModalOpen(false);
    } else {
      alert('Please enter a valid 6-digit Indian PIN code (e.g. 380015)');
    }
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const categoryPills = [
    { name: 'All Products', path: '/products' },
    { name: 'Electronics', path: '/products?category=Electronics' },
    { name: 'Fashion', path: '/products?category=Fashion' },
    { name: 'Footwear', path: '/products?category=Footwear' },
    { name: 'Accessories', path: '/products?category=Accessories' },
    { name: 'Home & Living', path: '/products?category=Home%20%26%20Living' },
    { name: '🔥 Hot Deals', path: '/products?is_trending=true' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs">
      
      {/* 1. Top Announcement & Interactive Coupon Ribbon */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white text-xs py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          <div className="flex items-center space-x-2">
            <span className="bg-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
              Diwali Mega Sale
            </span>
            <span className="text-slate-200">
              Flat 20% OFF on all orders in India • Free Delivery above ₹999
            </span>
          </div>

          {/* Quick Clickable Coupon Vouchers */}
          <div className="flex items-center space-x-3 text-[11px]">
            <button
              onClick={() => copyCoupon('FIRST20')}
              className="flex items-center space-x-1 font-mono font-bold bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md transition"
              title="Click to copy coupon code"
            >
              <Tag className="w-3 h-3 text-yellow-300" />
              <span>FIRST20</span>
              {copiedCoupon === 'FIRST20' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
            </button>

            <button
              onClick={() => copyCoupon('DIWALI500')}
              className="hidden md:flex items-center space-x-1 font-mono font-bold bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md transition"
              title="Click to copy coupon code"
            >
              <Tag className="w-3 h-3 text-yellow-300" />
              <span>DIWALI500</span>
              {copiedCoupon === 'DIWALI500' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
            </button>

            <span className="text-slate-500 hidden sm:inline">|</span>
            <Link to="/track-order" className="hover:text-blue-300 transition hidden sm:inline">
              Track Order
            </Link>
          </div>

        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform font-black text-xl">
              ₹
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-blue-600 transition">
                Urban<span className="text-blue-600">Kart</span>
              </span>
              <span className="block text-[9px] uppercase tracking-widest font-extrabold text-gray-400">
                India's Online Mega Store
              </span>
            </div>
          </Link>

          {/* Delivery Location Selector */}
          <button
            onClick={() => setIsPincodeModalOpen(true)}
            className="hidden lg:flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 border border-gray-100 text-left transition"
            title="Change Delivery Location"
          >
            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div className="text-xs leading-tight">
              <span className="block text-[10px] text-gray-400">Deliver to</span>
              <span className="font-bold text-gray-800">{deliveryPincode} (Change)</span>
            </div>
          </button>

          {/* Search Bar with Instant Autocomplete */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <div className="relative w-full flex items-center bg-gray-50 hover:bg-gray-100/70 focus-within:bg-white rounded-2xl border border-gray-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition shadow-xs">
                
                {/* Category Dropdown */}
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="hidden sm:block text-xs font-semibold text-gray-600 bg-transparent pl-3 pr-2 py-2.5 border-r border-gray-200 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Home & Living">Home & Living</option>
                </select>

                <input
                  type="text"
                  placeholder="Search laptops, headphones, sneakers, jackets, watches..."
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-transparent focus:outline-none text-gray-900 placeholder-gray-400"
                />

                <button
                  type="submit"
                  className="mr-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </form>

            {/* Instant Suggestions Dropdown */}
            {isSearchFocused && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 divide-y divide-gray-50 z-50 overflow-hidden">
                <div className="p-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50">
                  Matching Products
                </div>
                {suggestions.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    onClick={() => setIsSearchFocused(false)}
                    className="p-3 flex items-center justify-between hover:bg-blue-50/50 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={p.image_url} alt="" className="w-9 h-9 object-cover rounded-lg border border-gray-100" />
                      <div>
                        <p className="text-xs font-bold text-gray-900 line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-gray-400">{p.category} • {p.brand}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-blue-600">{formatINR(p.price)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Wishlist Link */}
            <Link
              to="/products?wishlist=true"
              className="relative p-2.5 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3.5 py-2 rounded-2xl font-semibold transition active:scale-95"
            >
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <div className="text-left text-xs leading-tight hidden sm:block">
                <span className="block font-bold text-gray-900">{formatINR(totalAmount)}</span>
                <span className="text-[10px] text-blue-600 font-semibold">{totalItems} items</span>
              </div>
              <span className="sm:hidden text-xs font-black bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            </button>

            {/* Separate Admin Portal Link */}
            <Link
              to="/admin"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center space-x-1.5 bg-slate-950 hover:bg-slate-900 text-white px-3 py-2 rounded-2xl text-xs font-bold shadow-md transition"
              title="Open Separate Admin Portal"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Panel ↗</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* 3. Category Strip Navigation */}
      <div className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none text-xs font-bold text-gray-600">
            {categoryPills.map((pill) => (
              <Link
                key={pill.name}
                to={pill.path}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                  pill.name.includes('Hot Deals')
                    ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                    : 'hover:text-blue-600 hover:bg-white'
                }`}
              >
                {pill.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 shadow-lg">
          <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs">
            <span className="text-gray-500">Pincode: <strong>{deliveryPincode}</strong></span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsPincodeModalOpen(true);
              }}
              className="text-blue-600 font-bold"
            >
              Change
            </button>
          </div>

          <div className="space-y-1">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl">
              Shop All Products
            </Link>
            <Link to="/track-order" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl">
              Track Order
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl">
              Customer Support
            </Link>
            <Link
              to="/admin"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-bold text-white bg-slate-950 rounded-xl text-center"
            >
              Separate Admin Panel ↗
            </Link>
          </div>
        </div>
      )}

      {/* Pincode Modal */}
      {isPincodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-sm text-gray-900 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Choose Delivery Location</span>
              </h3>
              <button onClick={() => setIsPincodeModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Enter your Indian PIN code to check delivery availability and express shipping timelines.
            </p>

            <form onSubmit={handleSavePincode} className="space-y-3">
              <input
                type="text"
                required
                maxLength={6}
                placeholder="Enter 6-digit PIN (e.g. 380015)"
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-2.5 text-sm font-mono tracking-wider bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white text-center font-bold"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Set Location
              </button>
            </form>
          </div>
        </div>
      )}

    </header>
  );
};
