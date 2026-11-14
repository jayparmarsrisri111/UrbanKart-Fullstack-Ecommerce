import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Eye, Plus, Minus, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatCurrency';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { cart, addToCart, updateQuantity, toggleWishlist, isInWishlist } = useCart();
  const inWishlist = isInWishlist(product.id);

  const cartItem = cart.find((item) => item.product.id === product.id);

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="group relative bg-white border border-gray-100 hover:border-blue-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      
      {/* Top Badges */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercentage > 0 && (
          <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
            {discountPercentage}% OFF
          </span>
        )}
        {product.is_trending && (
          <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
            TRENDING 🔥
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            ONLY {product.stock} LEFT
          </span>
        )}
      </div>

      {/* Wishlist Heart Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition shadow-md ${
          inWishlist
            ? 'bg-rose-50 text-rose-500'
            : 'bg-white/90 text-gray-500 hover:text-rose-500 hover:bg-white'
        }`}
        title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
      </button>

      {/* Product Image */}
      <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Hover Button */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/95 hover:bg-white text-gray-800 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center space-x-1.5 whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Quick View</span>
          </button>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
            <span className="font-bold text-blue-600 uppercase tracking-wider">{product.category}</span>
            <span className="font-medium text-gray-500">{product.brand}</span>
          </div>

          {/* Title */}
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Star Rating */}
          <div className="flex items-center space-x-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-extrabold text-gray-800">{product.rating}</span>
            <span className="text-[11px] text-gray-400">({product.reviews_count} reviews)</span>
          </div>
        </div>

        {/* Price & Action Area */}
        <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base sm:text-lg font-black text-gray-900">
                {formatINR(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatINR(product.original_price)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block">Free Pan-India Delivery</span>
          </div>

          {/* Cart Stepper / Add button */}
          {cartItem ? (
            <div className="flex items-center border border-blue-600 bg-blue-50 text-blue-700 rounded-xl px-1 py-0.5">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  updateQuantity(product.id, cartItem.quantity - 1);
                }}
                className="p-1 hover:text-blue-900"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 text-xs font-black">{cartItem.quantity}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  updateQuantity(product.id, cartItem.quantity + 1);
                }}
                className="p-1 hover:text-blue-900"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product, 1)}
              disabled={product.stock <= 0}
              className={`p-2.5 rounded-2xl flex items-center justify-center transition active:scale-95 shadow-sm ${
                product.stock > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>

    </div>
  );
};
