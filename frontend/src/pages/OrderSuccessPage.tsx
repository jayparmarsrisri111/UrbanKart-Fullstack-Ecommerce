import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Truck, ShoppingBag, ShieldCheck, Printer, ArrowRight, Package } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatINR } from '../utils/formatCurrency';
import { TaxInvoiceModal } from '../components/TaxInvoiceModal';
import { trackOrder } from '../services/api';
import { Order } from '../types';

export const OrderSuccessPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(location.state?.order || null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    // Confetti celebration
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 }
    });

    if (!order && orderNumber) {
      trackOrder(orderNumber)
        .then((data) => setOrder(data))
        .catch((err) => console.error('Could not fetch order:', err));
    }
  }, [orderNumber]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      
      {/* Success Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-12 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            Order Placed Successfully!
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Thank you for shopping with UrbanKart!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Your order is confirmed and our warehouse is preparing your shipment with pan-India express courier.
          </p>
        </div>

        {/* Order Number Box */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 max-w-sm mx-auto space-y-1">
          <span className="text-xs text-slate-400 font-medium">Your Order Tracking ID</span>
          <p className="text-xl font-black font-mono text-blue-600 tracking-wider">
            {orderNumber || 'UK-CONFIRMED'}
          </p>
          {order?.awb_number && (
            <p className="text-[11px] font-mono text-slate-500">
              AWB: {order.awb_number} ({order.courier || 'Delhivery Express'})
            </p>
          )}
        </div>

        {/* Order Details Breakdown */}
        {order && (
          <div className="text-left bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-100 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Order Summary</h3>
              <span className="text-xs font-mono font-bold text-slate-600">
                GSTIN: 24AABCU9012F1ZG
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
              <div>
                <span className="font-semibold text-slate-900 block">Customer Name:</span>
                <span>{order.customer_name}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">Phone Number:</span>
                <span>{order.customer_phone}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="font-semibold text-slate-900 block">Delivery Address:</span>
                <span>{order.shipping_address}, {order.city} - {order.postal_code}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">Payment Method:</span>
                <span className="uppercase font-bold text-slate-800">{order.payment_method}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">Total Amount:</span>
                <span className="font-black text-blue-600 text-base">{formatINR(order.total_amount)}</span>
              </div>
            </div>

            {/* Items Mini List */}
            {order.items && order.items.length > 0 && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="font-semibold text-slate-900 block text-xs">Ordered Items:</span>
                <div className="space-y-1.5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-700">
                      <span className="truncate pr-2">
                        • {item.product_name} <span className="text-slate-400">× {item.quantity}</span>
                      </span>
                      <span className="font-bold whitespace-nowrap">{formatINR(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {order && (
            <button
              onClick={() => setIsInvoiceOpen(true)}
              className="px-6 py-3.5 bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print Tax Invoice (GST)</span>
            </button>
          )}

          <Link
            to={`/track-order?order=${orderNumber}`}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition"
          >
            <Truck className="w-4 h-4" />
            <span>Track Live Delivery</span>
          </Link>

          <Link
            to="/products"
            className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 pt-4 border-t border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Need help with this order? Chat with our WhatsApp concierge 24/7!</span>
        </div>
      </div>

      {/* Tax Invoice Modal */}
      {isInvoiceOpen && order && (
        <TaxInvoiceModal order={order} onClose={() => setIsInvoiceOpen(false)} />
      )}
    </div>
  );
};
