import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag, Sparkles, Check, X, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatCurrency';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shippingFee,
    totalAmount,
    promoCode,
    applyPromoCode,
    removePromoCode,
    availableCoupons,
    deliveryPincode,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const navigate = useNavigate();

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || inputCoupon).trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponFeedback(null);
    try {
      const res = await applyPromoCode(code);
      setCouponFeedback(res);
      if (res.success) {
        setInputCoupon('');
      }
    } catch {
      setCouponFeedback({ success: false, message: 'Failed to apply coupon' });
    } finally {
      setCouponLoading(false);
    }
  };

  const freeShippingThreshold = 999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - (subtotal - discount));
  const freeShippingProgress = Math.min(100, Math.round(((subtotal - discount) / freeShippingThreshold) * 100));

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-5">
        <div className="w-24 h-24 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-slate-500">
            Looks like you haven't added anything to your cart yet. Discover trending deals and gadgets!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>Shopping Cart</span>
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)} Items
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review items & apply discount coupons before checkout • Delivering to PIN: <span className="font-bold text-slate-700">{deliveryPincode}</span>
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
        >
          <span>← Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free Shipping Meter */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                {amountNeededForFreeShipping === 0 ? (
                  <p className="font-bold text-emerald-700 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Congratulations! You qualify for FREE Delivery across India.
                  </p>
                ) : (
                  <p className="font-medium text-slate-700">
                    Add <span className="font-bold text-blue-700">{formatINR(amountNeededForFreeShipping)}</span> more to unlock <span className="font-bold text-emerald-600">FREE Delivery</span>!
                  </p>
                )}
                <div className="w-48 sm:w-64 h-2 bg-white/80 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-500 bg-white px-3 py-1 rounded-full shadow-xs">
              Orders above ₹999
            </span>
          </div>

          {/* Cart Items Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-6 divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={item.product.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 min-w-0">
                  <Link to={`/products/${item.product.id}`} className="relative flex-shrink-0">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl bg-slate-50 border border-slate-100 hover:opacity-90 transition"
                    />
                  </Link>
                  <div className="min-w-0 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                      {item.product.category}
                    </span>
                    <Link
                      to={`/products/${item.product.id}`}
                      className="block text-sm font-bold text-slate-900 hover:text-blue-600 transition truncate max-w-xs sm:max-w-md"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-slate-400">
                      Brand: <span className="font-medium text-slate-700">{item.product.brand}</span>
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-black text-slate-900">
                        {formatINR(item.product.price)}
                      </span>
                      {item.product.original_price > item.product.price && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatINR(item.product.original_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stepper, Row Total & Remove */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-slate-50">
                  {/* Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50/70 p-0.5 shadow-xs">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 text-sm font-bold transition"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-9 text-center text-xs font-black text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-30 text-sm font-bold transition"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[90px]">
                    <span className="text-sm sm:text-base font-black text-slate-900 block">
                      {formatINR(item.product.price * item.quantity)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({item.quantity} × {formatINR(item.product.price)})
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center gap-3">
              <span className="text-2xl">🇮🇳</span>
              <div className="text-[11px]">
                <p className="font-bold text-slate-900">Pan-India Delivery</p>
                <p className="text-slate-400">Over 28,000+ Pin codes</p>
              </div>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div className="text-[11px]">
                <p className="font-bold text-slate-900">Instant UPI & Cards</p>
                <p className="text-slate-400">Zero transaction fee</p>
              </div>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div className="text-[11px]">
                <p className="font-bold text-slate-900">7 Days Easy Return</p>
                <p className="text-slate-400">Hassle-free refunds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon Vouchers */}
        <div className="space-y-6">
          
          {/* Coupon Code Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                <Tag className="w-4 h-4 text-blue-600" />
                <span>Apply Coupon Code</span>
              </div>
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>

            {promoCode ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-2xl text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </div>
                  <div>
                    <span className="font-mono font-black text-sm">{promoCode}</span>
                    <p className="text-[10px] text-emerald-700">Coupon applied! You saved {formatINR(discount)}</p>
                  </div>
                </div>
                <button
                  onClick={removePromoCode}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleApplyCoupon();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Enter code (e.g. FIRST20)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 text-xs uppercase bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white font-mono transition"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !inputCoupon.trim()}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-black disabled:opacity-40 text-white text-xs font-bold rounded-xl transition"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </form>
            )}

            {couponFeedback && (
              <p className={`text-xs font-medium ${couponFeedback.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                {couponFeedback.message}
              </p>
            )}

            {/* Clickable Available Coupons */}
            {availableCoupons && availableCoupons.length > 0 && !promoCode && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Available Offers</p>
                <div className="space-y-2">
                  {availableCoupons.map((c) => (
                    <div
                      key={c.code}
                      onClick={() => handleApplyCoupon(c.code)}
                      className="p-2.5 border border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50 rounded-xl cursor-pointer transition flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-100 shadow-2xs">
                          {c.code}
                        </span>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">{c.description}</p>
                      </div>
                      <span className="text-[11px] font-bold text-blue-600 hover:underline flex-shrink-0">
                        Apply
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Bill Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900">Price Details</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Price ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-semibold text-slate-900">{formatINR(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Coupon Discount
                  </span>
                  <span className="font-bold">-{formatINR(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                <span className="font-bold">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 uppercase">FREE</span>
                  ) : (
                    formatINR(shippingFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <div>
                  <span className="text-base font-black text-slate-900 block">Total Payable</span>
                  <span className="text-[10px] text-slate-400">Inclusive of all Indian taxes (GST)</span>
                </div>
                <span className="text-xl font-black text-blue-600">{formatINR(totalAmount)}</span>
              </div>

              {discount > 0 && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-center text-xs font-bold">
                  🎉 You are saving {formatINR(discount)} on this order!
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-sm font-bold rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe & Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
