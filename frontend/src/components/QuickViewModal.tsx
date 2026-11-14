import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatCurrency';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const featuresList = product.features
    ? product.features.split('\n').filter((f) => f.trim()).slice(0, 3)
    : ['Premium quality construction', 'Official brand warranty'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 shadow-md text-gray-500 hover:text-gray-900 flex items-center justify-center hover:bg-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 relative bg-gray-50 aspect-square md:aspect-auto">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          {discountPercent > 0 && (
            <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">{product.category}</span>
              <span>{product.brand}</span>
            </div>

            <h2 className="text-xl font-extrabold text-gray-900 leading-snug">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <span className="font-bold text-gray-800">{product.rating}</span>
              <span className="text-gray-400">({product.reviews_count} reviews)</span>
              <span className="text-gray-300">•</span>
              <span className={`font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-2 pt-1">
              <span className="text-2xl font-black text-gray-900">
                {formatINR(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatINR(product.original_price)}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="space-y-1.5 pt-1">
              {featuresList.map((f, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs text-gray-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stepper & Actions */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  onClose();
                }}
                disabled={product.stock <= 0}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition ${
                  inWishlist
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'border-gray-200 text-gray-600 hover:text-rose-500'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <Link
              to={`/products/${product.id}`}
              onClick={onClose}
              className="block text-center text-xs font-bold text-blue-600 hover:underline pt-1"
            >
              View Full Specifications & Customer Reviews →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
