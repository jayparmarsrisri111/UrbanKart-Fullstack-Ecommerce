import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Tag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatCurrency';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shippingFee,
    totalAmount,
    totalItems,
    promoCode,
    applyPromoCode,
    removePromoCode,
    availableCoupons,
    deliveryPincode,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApply = async (codeToApply: string) => {
    if (!codeToApply.trim()) return;
    setIsApplying(true);
    const res = await applyPromoCode(codeToApply.trim());
    setCouponFeedback(res);
    setIsApplying(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-extrabold text-gray-900">Your Shopping Cart ({totalItems})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-blue-50 px-5 py-3 border-b border-blue-100">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-900 mb-1.5">
              <span>
                {amountNeededForFreeShipping === 0 ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    You unlocked FREE Express Delivery across India!
                  </span>
                ) : (
                  `Add ${formatINR(amountNeededForFreeShipping)} more for FREE Delivery`
                )}
              </span>
              <span>{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-800">Your cart is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  Explore our top gadgets, footwear, and trending collections across India!
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/products');
                  }}
                  className="mt-2 px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.product.id} className="py-4 flex gap-3.5 items-center">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-2xl bg-gray-50 border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-xs font-bold text-gray-900 hover:text-blue-600 line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.product.category}</p>
                      <p className="text-xs font-black text-gray-900 mt-1">
                        {formatINR(item.product.price)}
                      </p>

                      {/* Quantity Stepper */}
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50/50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-black text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-rose-500 text-xs transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Available Clickable Coupons */}
                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span className="flex items-center space-x-1">
                      <Tag className="w-3.5 h-3.5 text-blue-600" />
                      <span>Available Indian Offers:</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {availableCoupons.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleApply(c.code)}
                        className={`p-2 rounded-xl border text-left transition ${
                          promoCode === c.code
                            ? 'border-emerald-500 bg-emerald-50/60'
                            : 'border-gray-200 hover:border-blue-400 bg-gray-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-blue-700">{c.code}</span>
                          {promoCode === c.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                        <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{c.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-gray-50/80 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Savings ({promoCode}):</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Delivery to {deliveryPincode}:</span>
                  <span className="font-semibold text-gray-800">
                    {shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-base text-blue-600">{formatINR(totalAmount)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2 transition"
                >
                  <span>Proceed to Express Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full py-2.5 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition"
                >
                  View Full Cart Details
                </button>
              </div>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-gray-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>UPI, COD & 256-Bit Encrypted Secure Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
