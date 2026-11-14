import React from 'react';
import { X, Printer, ShieldCheck, Download } from 'lucide-react';
import { Order } from '../types';
import { formatINR } from '../utils/formatCurrency';

interface TaxInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const TaxInvoiceModal: React.FC<TaxInvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const gstAmount = Math.round(order.total_amount * 0.18 / 1.18);
  const taxableValue = order.total_amount - gstAmount;
  const cgst = Math.round(gstAmount / 2);
  const sgst = Math.round(gstAmount / 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 p-8 space-y-6 my-auto text-gray-800 print:shadow-none print:border-none print:rounded-none print:w-full print:max-w-none">
        
        {/* Top Action Controls (hidden when printing) */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Official Tax Invoice
            </span>
            <span className="text-xs text-gray-400 font-mono">{order.invoice_number || `INV-${order.order_number}`}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div id="invoice-sheet" className="space-y-6 text-xs text-gray-700">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  ₹
                </div>
                <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                  Urban<span className="text-blue-600">Kart</span> Technologies
                </span>
              </div>
              <p className="mt-2 text-gray-500">UrbanKart Retail India Private Limited</p>
              <p className="text-gray-500">4th Floor, Tech Park, SG Highway, Ahmedabad, Gujarat - 380015</p>
              <p className="text-gray-500 font-mono">GSTIN: 24AABCU9012F1ZG • PAN: AABCU9012F</p>
              <p className="text-gray-500">Email: support@urbankart.com | Ph: +91 98765 43210</p>
            </div>

            <div className="text-right space-y-1">
              <h2 className="text-base font-black text-gray-900 uppercase tracking-wider">TAX INVOICE</h2>
              <p className="font-mono font-bold text-blue-600 text-sm">{order.invoice_number || `INV-${order.order_number}`}</p>
              <p className="text-gray-500">Order ID: <span className="font-mono font-semibold text-gray-800">{order.order_number}</span></p>
              <p className="text-gray-500">Invoice Date: <span className="font-semibold text-gray-800">{new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span></p>
              <p className="text-gray-500">Payment: <span className="font-bold text-gray-900 uppercase">{order.payment_method} ({order.payment_status})</span></p>
            </div>
          </div>

          {/* Billing & Shipping Address */}
          <div className="grid grid-cols-2 gap-6 bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Bill To / Ship To:</span>
              <p className="font-bold text-gray-900 text-sm mt-0.5">{order.customer_name}</p>
              <p className="text-gray-600 mt-0.5 leading-relaxed">{order.shipping_address}</p>
              <p className="text-gray-600">{order.city} - {order.postal_code}, India</p>
              <p className="text-gray-500 mt-1">Phone: <span className="font-semibold text-gray-800">{order.customer_phone}</span></p>
              <p className="text-gray-500">Email: {order.customer_email}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Dispatch & Logistic Details:</span>
              <p className="text-gray-700">Courier Partner: <span className="font-semibold text-gray-900">{order.courier || 'UrbanKart Express / BlueDart'}</span></p>
              <p className="text-gray-700">AWB Tracking No: <span className="font-mono font-semibold text-blue-600">{order.awb_number || 'UBK-984210'}</span></p>
              <p className="text-gray-700">Place of Supply: <span className="font-semibold text-gray-900">Gujarat (State Code: 24)</span></p>
              <p className="text-gray-700">Reverse Charge: <span className="font-semibold text-gray-900">No</span></p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-gray-200">
              <thead>
                <tr className="text-gray-500 uppercase text-[10px] tracking-wider bg-gray-100/70">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">HSN</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-3 text-gray-400">{index + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-gray-900">{item.product_name}</td>
                    <td className="py-2.5 px-3 font-mono text-gray-500">851830</td>
                    <td className="py-2.5 px-3 text-right text-gray-700">{formatINR(item.price)}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-gray-800">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-gray-900">{formatINR(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & Tax Breakdown */}
          <div className="flex justify-between items-start pt-4 border-t border-gray-200">
            <div className="max-w-xs space-y-1 text-gray-500 text-[11px]">
              <p><strong>Terms & Conditions:</strong></p>
              <p>1. Goods sold are covered under 7-day hassle-free replacement policy.</p>
              <p>2. Keep this invoice for official brand warranty claims across India.</p>
              <p>3. This is a computer-generated tax invoice and requires no physical signature.</p>
            </div>

            <div className="w-64 space-y-1.5 text-right">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal (Items):</span>
                <span className="font-semibold text-gray-800">{formatINR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>-{formatINR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Delivery Charges:</span>
                <span className="font-semibold text-gray-800">{order.shipping_fee === 0 ? 'FREE' : formatINR(order.shipping_fee)}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-[11px] pt-1 border-t border-gray-100">
                <span>Taxable Value:</span>
                <span>{formatINR(taxableValue)}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-[11px]">
                <span>CGST (9%):</span>
                <span>{formatINR(cgst)}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-[11px]">
                <span>SGST (9%):</span>
                <span>{formatINR(sgst)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>Grand Total (INR):</span>
                <span className="text-base text-blue-700">{formatINR(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Footer signature */}
          <div className="pt-8 border-t border-gray-200 flex justify-between items-end">
            <div className="flex items-center space-x-2 text-[11px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Certified GST Compliant E-Commerce Platform</span>
            </div>
            <div className="text-right">
              <div className="font-serif italic text-blue-900 text-sm font-bold">UrbanKart Authorized Signatory</div>
              <p className="text-[10px] text-gray-400 mt-0.5">Authorized Signatory for UrbanKart Retail India Pvt Ltd</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
