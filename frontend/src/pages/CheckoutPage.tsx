import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  Banknote, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { formatINR } from '../utils/formatCurrency';

const INDIAN_STATES = [
  'Gujarat',
  'Maharashtra',
  'Delhi NCR',
  'Karnataka',
  'Tamil Nadu',
  'Rajasthan',
  'Uttar Pradesh',
  'Telangana',
  'West Bengal',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Kerala',
  'Andhra Pradesh',
  'Other State / UT'
];

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, discount, shippingFee, totalAmount, promoCode, clearCart, deliveryPincode } = useCart();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: '',
    state: 'Gujarat',
    postal_code: deliveryPincode || '380015',
    payment_method: 'UPI',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-xs text-slate-500">Add products to your cart before proceeding to checkout.</p>
        <Link to="/products" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone || !formData.shipping_address || !formData.city || !formData.postal_code) {
      setError('Please fill in all required shipping address fields.');
      return;
    }

    if (formData.postal_code.length !== 6 || isNaN(Number(formData.postal_code))) {
      setError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        shipping_address: `${formData.shipping_address}, ${formData.city}, ${formData.state}`,
        city: formData.city,
        postal_code: formData.postal_code,
        payment_method: formData.payment_method,
        promo_code: promoCode || undefined,
        notes: formData.notes || undefined,
        items: cart.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_image: item.product.image_url,
          price: item.product.price,
          quantity: item.quantity,
        })),
      };

      const response = await createOrder(orderPayload);

      // Trigger Celebration Confetti!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Clear the cart
      clearCart();

      // Navigate to order success screen
      navigate(`/order-success/${response.order_number}`, { state: { order: response } });
    } catch (err: any) {
      console.error('Order creation failed:', err);
      setError(err?.response?.data?.detail || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Express Checkout</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Provide your delivery address across India and choose payment method</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2.5 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Shipping & Payment details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Customer & Address Form */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>1. Customer & Delivery Address (India)</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" /> Delivery in 2-4 Days
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  name="customer_name"
                  placeholder="e.g. Aarav Patel"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address (for GST Invoice) *</label>
                <input
                  type="email"
                  required
                  name="customer_email"
                  placeholder="aarav@example.com"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  name="customer_phone"
                  placeholder="+91 98765 43210"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Street Address / Flat / Building / Society *</label>
                <textarea
                  required
                  rows={2}
                  name="shipping_address"
                  placeholder="Flat 402, Shivalik Residency, Near SG Highway"
                  value={formData.shipping_address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">City / District *</label>
                <input
                  type="text"
                  required
                  name="city"
                  placeholder="Ahmedabad, Surat, Rajkot, Mumbai..."
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">State *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">6-Digit PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  name="postal_code"
                  placeholder="380015"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  name="notes"
                  placeholder="Leave at security gate / Call before delivery"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>2. Select Payment Method (Indian Rupees ₹)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Instant UPI / QR */}
              <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start space-x-3 transition ${
                formData.payment_method === 'UPI'
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="UPI"
                  checked={formData.payment_method === 'UPI'}
                  onChange={handleInputChange}
                  className="mt-1 text-blue-600"
                />
                <div>
                  <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <span>Instant UPI / QR Code</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Google Pay, PhonePe, Paytm, BHIM</p>
                </div>
              </label>

              {/* COD Option */}
              <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start space-x-3 transition ${
                formData.payment_method === 'COD'
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="COD"
                  checked={formData.payment_method === 'COD'}
                  onChange={handleInputChange}
                  className="mt-1 text-blue-600"
                />
                <div>
                  <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pay cash or UPI to delivery agent</p>
                </div>
              </label>

              {/* Card Option */}
              <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start space-x-3 transition ${
                formData.payment_method === 'CARD'
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="CARD"
                  checked={formData.payment_method === 'CARD'}
                  onChange={handleInputChange}
                  className="mt-1 text-blue-600"
                />
                <div>
                  <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span>RuPay / Credit / Debit Card</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">RuPay, Visa, Mastercard & Maestro</p>
                </div>
              </label>

              {/* NetBanking */}
              <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start space-x-3 transition ${
                formData.payment_method === 'NETBANKING'
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="payment_method"
                  value="NETBANKING"
                  checked={formData.payment_method === 'NETBANKING'}
                  onChange={handleInputChange}
                  className="mt-1 text-blue-600"
                />
                <div>
                  <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Net Banking</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">SBI, HDFC, ICICI, Axis & 50+ Banks</p>
                </div>
              </label>
            </div>

            {/* UPI Live Scanner Preview */}
            {formData.payment_method === 'UPI' && (
              <div className="bg-slate-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-900 to-blue-900 rounded-lg p-2 flex items-center justify-center text-white">
                    <QrCode className="w-16 h-16" />
                  </div>
                </div>
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                    Simulated UPI Gateway
                  </span>
                  <p className="text-xs font-bold text-slate-900">
                    VPA: <span className="font-mono text-blue-700">urbankart@icici</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Amount: <span className="font-bold text-slate-900">{formatINR(totalAmount)}</span>
                  </p>
                  <p className="text-[11px] text-emerald-600 font-medium">
                    ✓ Zero gateway surcharge • Instant auto-confirmation
                  </p>
                </div>
              </div>
            )}

            {/* Card Preview */}
            {formData.payment_method === 'CARD' && (
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-lg">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>RuPay / Platinum Card</span>
                  <span className="font-mono text-amber-400 font-bold">EMV CHIP</span>
                </div>
                <div className="font-mono text-lg tracking-widest py-1">•••• •••• •••• 8842</div>
                <div className="flex justify-between items-end text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Card Holder</span>
                    <span className="font-bold">{formData.customer_name || 'CUSTOMER NAME'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Expires</span>
                    <span className="font-mono font-bold">12/28</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Order Summary & Place Order Button */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900">Order Items ({cart.length})</h3>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{item.product.name}</p>
                      <p className="text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 whitespace-nowrap ml-2">
                    {formatINR(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Coupon Savings
                  </span>
                  <span className="font-bold">-{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Express Shipping</span>
                <span className="font-bold">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 uppercase">FREE</span>
                  ) : (
                    formatINR(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                <span>Total to Pay</span>
                <span className="text-blue-600 text-lg">{formatINR(totalAmount)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white text-sm font-black rounded-2xl shadow-xl shadow-emerald-600/25 flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              {loading ? (
                <span>Placing Your Order...</span>
              ) : (
                <>
                  <span>Place Order ({formatINR(totalAmount)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe & Secure Indian Banking Encryption</span>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
