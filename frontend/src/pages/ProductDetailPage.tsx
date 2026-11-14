import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2, 
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { getProductByIdOrSlug, getProducts, addProductReview } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { formatINR } from '../utils/formatCurrency';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, deliveryPincode } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews' | 'warranty'>('overview');

  // Pincode Delivery checker
  const [checkPin, setCheckPin] = useState(deliveryPincode);
  const [pinFeedback, setPinFeedback] = useState<string | null>(`Delivery available to ${deliveryPincode} in 2-3 business days.`);

  // Write a Review Form
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getProductByIdOrSlug(id);
        setProduct(data);

        // Fetch related products from same category
        const allProds = await getProducts({ category: data.category });
        setRelatedProducts(allProds.filter((p) => p.id !== data.id).slice(0, 4));
      } catch (err: any) {
        console.error(err);
        setError('Product not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkPin.length === 6) {
      setPinFeedback(`✅ Express Delivery available to PIN ${checkPin}! Dispatched within 24 hours via BlueDart/Delhivery.`);
    } else {
      setPinFeedback('❌ Please enter a valid 6-digit PIN code.');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewComment.trim()) return;
    try {
      setIsSubmittingReview(true);
      const updated = await addProductReview(product.id, {
        author: reviewAuthor.trim() || 'Verified Customer',
        rating: reviewRating,
        comment: reviewComment.trim()
      });
      setProduct(updated);
      setReviewAuthor('');
      setReviewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (e) {
      alert('Failed to post review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-100 rounded-3xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-100 rounded w-1/4 animate-pulse" />
            <div className="h-10 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
            <div className="h-24 bg-gray-100 rounded w-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">{error || 'Product Not Found'}</h2>
        <p className="text-xs text-gray-500">The product you are looking for might have been removed or is temporarily unavailable.</p>
        <Link to="/products" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md">
          Back to Shop
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const featuresList = product.features
    ? product.features.split('\n').filter((f) => f.trim())
    : [
        '100% Genuine brand manufactured product',
        'Official 1-Year National Brand Warranty across India',
        'Certified quality tested for optimal performance'
      ];

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-blue-600">Shop</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-600">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left: Product Image */}
        <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm aspect-square max-w-lg mx-auto w-full group">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {discountPercent > 0 && (
            <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
              {discountPercent}% OFF
            </span>
          )}

          <button
            onClick={() => toggleWishlist(product)}
            className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition active:scale-95 ${
              inWishlist
                ? 'bg-rose-50 text-rose-500'
                : 'bg-white/90 text-gray-600 hover:text-rose-500'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Right: Details & Purchase */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-3 text-xs mb-1.5">
              <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                {product.category}
              </span>
              <span className="text-gray-400 font-medium">Brand: {product.brand}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mt-3">
              <div className="flex items-center text-amber-400">
                {"★".repeat(5)}
              </div>
              <span className="text-xs font-extrabold text-gray-800">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviews_count} verified Indian ratings)</span>
              <span className="text-gray-300">•</span>
              <span className={`text-xs font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Pricing in INR */}
          <div className="p-4 bg-gray-50/80 rounded-2xl flex items-baseline space-x-3 border border-gray-100">
            <span className="text-3xl font-black text-gray-900">
              {formatINR(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <>
                <span className="text-base text-gray-400 line-through">
                  {formatINR(product.original_price)}
                </span>
                <span className="text-xs font-extrabold text-rose-600">
                  Save {formatINR(product.original_price - product.price)} ({discountPercent}% OFF)
                </span>
              </>
            )}
          </div>

          {/* Delivery Pincode Checker */}
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
            <span className="text-xs font-bold text-gray-700 flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Check Delivery Speed & Cash on Delivery:</span>
            </span>

            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={checkPin}
                onChange={(e) => setCheckPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN"
                className="w-36 px-3 py-1.5 text-xs font-mono font-bold bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700"
              >
                Check
              </button>
            </form>

            {pinFeedback && (
              <p className="text-[11px] text-gray-600 font-medium">{pinFeedback}</p>
            )}
          </div>

          {/* Highlights */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Key Product Highlights</h4>
            <div className="grid grid-cols-1 gap-2">
              {featuresList.map((feature, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-l-xl"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3.5 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-r-xl"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock <= 0}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition"
              >
                <span>Buy Now with 1-Click</span>
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 text-center">
            <div className="space-y-1">
              <Truck className="w-4 h-4 text-blue-600 mx-auto" />
              <p className="text-[11px] font-bold text-gray-800">Free Express Delivery</p>
              <p className="text-[9px] text-gray-400">On orders over ₹999</p>
            </div>
            <div className="space-y-1">
              <RotateCcw className="w-4 h-4 text-purple-600 mx-auto" />
              <p className="text-[11px] font-bold text-gray-800">7-Day Return</p>
              <p className="text-[9px] text-gray-400">Easy replacement</p>
            </div>
            <div className="space-y-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto" />
              <p className="text-[11px] font-bold text-gray-800">100% Genuine</p>
              <p className="text-[9px] text-gray-400">Official GST invoice</p>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Section (Overview, Specifications, Reviews, Warranty) */}
      <div className="pt-8 border-t border-gray-100 space-y-6">
        <div className="flex border-b border-gray-200 space-x-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 transition ${activeTab === 'specs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition ${activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
          >
            Customer Reviews ({product.reviews?.length || product.reviews_count})
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`pb-3 border-b-2 transition ${activeTab === 'warranty' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
          >
            Warranty & Returns
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4 text-gray-700 text-sm leading-relaxed">
            <h3 className="font-extrabold text-base text-gray-900">About this Item</h3>
            <p>{product.description}</p>
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {featuresList.map((f, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Specs Table */}
        {activeTab === 'specs' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-gray-900">Technical Specifications</h3>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden text-xs">
              {product.specs ? (
                Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 p-3 bg-white even:bg-gray-50/50">
                    <span className="font-bold text-gray-500">{k}</span>
                    <span className="col-span-2 text-gray-900 font-medium">{v}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500">Standard brand specifications apply.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Customer Reviews */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-extrabold text-base text-gray-900">Verified Purchaser Reviews</h3>

              {(!product.reviews || product.reviews.length === 0) ? (
                <div className="p-6 bg-gray-50 rounded-2xl text-xs text-gray-500 text-center">
                  Be the first to review this product!
                </div>
              ) : (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">{rev.author}</span>
                        {rev.verified && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-gray-400 text-[10px]">{rev.date}</span>
                    </div>

                    <div className="flex text-amber-400">
                      {"★".repeat(rev.rating)}
                    </div>

                    <p className="text-gray-600">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Box */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-gray-900">Write a Review</h4>

              {reviewSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl">
                  🎉 Thank you! Your review has been added.
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                  >
                    <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                    <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                    <option value={2}>★★☆☆☆ (2 Stars - Poor)</option>
                    <option value={1}>★☆☆☆☆ (1 Star - Disappointed)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Your Review</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Share your experience with this product..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            </div>

          </div>
        )}

        {/* Tab 4: Warranty */}
        {activeTab === 'warranty' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4 text-xs text-gray-700 leading-relaxed">
            <h3 className="font-extrabold text-base text-gray-900">Official Brand Warranty & Returns Policy</h3>
            <p><strong>1-Year National Warranty:</strong> This product carries an official 12-month manufacturer warranty serviceable at any authorized service center across India. Keep your Tax Invoice as proof of purchase.</p>
            <p><strong>7-Day Replacement Guarantee:</strong> In case of manufacturing defects or shipping damage, initiate a 1-click replacement within 7 days of delivery via your Order Tracking page or WhatsApp support.</p>
          </div>
        )}

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-gray-100">
          <h2 className="text-xl font-black text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
