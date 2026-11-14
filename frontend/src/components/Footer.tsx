import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Headphones, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-10 border-t border-gray-800">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Free Express Shipping</h4>
              <p className="text-xs text-gray-400">On all orders over $50</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Secure Checkout</h4>
              <p className="text-xs text-gray-400">COD, UPI & 256-Bit SSL</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">7-Day Easy Returns</h4>
              <p className="text-xs text-gray-400">Hassle-free money back</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">24/7 Dedicated Support</h4>
              <p className="text-xs text-gray-400">Instant WhatsApp assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-white">
              Urban<span className="text-blue-500">Kart</span>
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your destination for premium electronics, trending fashion, comfortable footwear, and modern home essentials with fast, reliable doorstep delivery.
          </p>
          <div className="text-xs text-gray-400 space-y-1">
            <p className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>+91 98765 43210</span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>support@urbankart.com</span>
            </p>
          </div>
        </div>

        {/* Quick Shop Links */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shop Categories</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/products?category=Electronics" className="hover:text-blue-400 transition">Electronics & Gadgets</Link></li>
            <li><Link to="/products?category=Fashion" className="hover:text-blue-400 transition">Trending Fashion</Link></li>
            <li><Link to="/products?category=Footwear" className="hover:text-blue-400 transition">Shoes & Sneakers</Link></li>
            <li><Link to="/products?category=Accessories" className="hover:text-blue-400 transition">Bags & Watches</Link></li>
            <li><Link to="/products?category=Home%20%26%20Living" className="hover:text-blue-400 transition">Home & Living</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Care</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/track-order" className="hover:text-blue-400 transition">Track Your Order</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition">Help & FAQs</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition">Shipping & Delivery</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition">Return & Refund Policy</Link></li>
            <li><Link to="/admin/login" className="hover:text-blue-400 transition text-gray-400 text-xs">Admin Management</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Stay in the Loop</h3>
          <p className="text-xs text-gray-400 mb-3">
            Subscribe to get special discounts, VIP coupons, and new product drop notifications.
          </p>
          <form onSubmit={(e) => { e.preventDefault(); alert('🎉 Thank you for subscribing to UrbanKart updates!'); }} className="space-y-2">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="w-full px-3.5 py-2 text-xs bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-full py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-gray-800 text-xs text-center text-gray-500">
        <p>© {new Date().getFullYear()} UrbanKart Technologies Inc. All rights reserved. Built with React & FastAPI.</p>
      </div>
    </footer>
  );
};
