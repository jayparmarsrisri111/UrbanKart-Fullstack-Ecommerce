import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  AlertCircle,
  Printer,
  Copy,
  Check
} from 'lucide-react';
import { trackOrder } from '../services/api';
import { Order } from '../types';
import { formatINR } from '../utils/formatCurrency';
import { TaxInvoiceModal } from '../components/TaxInvoiceModal';

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [copiedAWB, setCopiedAWB] = useState(false);

  const fetchTrack = async (num: string) => {
    if (!num.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const data = await trackOrder(num.trim());
      setOrder(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || 'Order not found. Please verify your Tracking ID.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryOrder = searchParams.get('order');
    if (queryOrder) {
      setOrderNumber(queryOrder);
      fetchTrack(queryOrder);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrack(orderNumber);
  };

  const handleCopyAWB = (awb: string) => {
    navigator.clipboard.writeText(awb);
    setCopiedAWB(true);
    setTimeout(() => setCopiedAWB(false), 2000);
  };

  const getStepStatus = (step: number) => {
    if (!order) return 'upcoming';
    const status = order.order_status.toLowerCase();
    
    if (status === 'cancelled') return 'cancelled';
    if (status === 'delivered') return 'completed';
    if (status === 'shipped') {
      return step <= 3 ? 'completed' : 'upcoming';
    }
    if (status === 'processing') {
      return step <= 2 ? 'completed' : 'upcoming';
    }
    return step === 1 ? 'completed' : 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
          Live Shipment Status
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Track Your Shipment</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Enter your UrbanKart Order Tracking ID (e.g. UK-261113-1001) or check sample orders
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm max-w-xl mx-auto space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. UK-261113-1001"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm uppercase font-mono bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={loading || !orderNumber.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition active:scale-95 whitespace-nowrap cursor-pointer"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {/* Demo order pill shortcut */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
          <span>Quick Samples:</span>
          <button
            type="button"
            onClick={() => {
              setOrderNumber('UK-261113-1001');
              fetchTrack('UK-261113-1001');
            }}
            className="font-mono text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg font-bold text-[11px] transition"
          >
            UK-261113-1001 (Shipped)
          </button>
          <button
            type="button"
            onClick={() => {
              setOrderNumber('UK-261113-1002');
              fetchTrack('UK-261113-1002');
            }}
            className="font-mono text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg font-bold text-[11px] transition"
          >
            UK-261113-1002 (Delivered)
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-xl mx-auto p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-xl space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs text-slate-400 font-medium">Tracking Order ID</span>
              <h2 className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-0.5">{order.order_number}</h2>
              <p className="text-xs text-slate-500 mt-1">Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                order.order_status === 'Delivered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.order_status === 'Shipped'
                  ? 'bg-blue-100 text-blue-800'
                  : order.order_status === 'Cancelled'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                ● {order.order_status}
              </span>

              <button
                onClick={() => setIsInvoiceOpen(true)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>GST Tax Invoice</span>
              </button>
            </div>
          </div>

          {/* Courier & AWB Strip */}
          <div className="bg-slate-50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-blue-600">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="text-slate-400">Logistics Partner</p>
                <p className="font-bold text-slate-900">{order.courier || 'Delhivery Express'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right text-xs">
                <p className="text-slate-400">AWB Tracking #</p>
                <p className="font-mono font-bold text-blue-700">{order.awb_number || 'DEL-99281920'}</p>
              </div>
              <button
                onClick={() => handleCopyAWB(order.awb_number || 'DEL-99281920')}
                className="p-2 text-slate-500 hover:text-slate-900 bg-white rounded-lg border border-slate-200 transition"
                title="Copy AWB Number"
              >
                {copiedAWB ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 4-Step Visual Timeline */}
          <div className="py-4">
            <div className="grid grid-cols-4 gap-2 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Order Placed</span>
                <span className="text-[10px] text-slate-400">Confirmed</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                  getStepStatus(2) === 'completed'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Processing</span>
                <span className="text-[10px] text-slate-400">Packed in Hub</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                  getStepStatus(3) === 'completed'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900">In Transit</span>
                <span className="text-[10px] text-slate-400">Out for Delivery</span>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                  getStepStatus(4) === 'completed'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Delivered</span>
                <span className="text-[10px] text-slate-400">Doorstep Handover</span>
              </div>
            </div>
          </div>

          {/* Details & Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100 text-xs">
            {/* Delivery address & Customer */}
            <div className="space-y-3 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Delivery Address (India)</span>
              </h3>
              <p className="font-semibold text-slate-900">{order.customer_name}</p>
              <p className="text-slate-600">{order.shipping_address}, {order.city} - {order.postal_code}</p>
              <p className="text-slate-500">Phone: {order.customer_phone}</p>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400">Payment: </span>
                <span className="font-bold text-slate-900 uppercase">{order.payment_method} ({order.payment_status})</span>
              </div>
            </div>

            {/* Items Purchased */}
            <div className="space-y-3 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Items ({order.items.length})
              </h3>
              <div className="divide-y divide-slate-200 space-y-2">
                {order.items.map((it) => (
                  <div key={it.id} className="pt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0 pr-2">
                      {it.product_image && (
                        <img src={it.product_image} alt="" className="w-8 h-8 object-cover rounded-md flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate">{it.product_name}</p>
                        <p className="text-slate-400 text-[10px]">Qty: {it.quantity} × {formatINR(it.price)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 whitespace-nowrap">{formatINR(it.total)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                <span>Total Amount:</span>
                <span className="text-blue-600">{formatINR(order.total_amount)}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tax Invoice Modal */}
      {isInvoiceOpen && order && (
        <TaxInvoiceModal order={order} onClose={() => setIsInvoiceOpen(false)} />
      )}

    </div>
  );
};
