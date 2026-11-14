import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { sendInquiry } from '../services/api';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order & Product Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await sendInquiry(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Order & Product Inquiry',
        message: '',
      });
    } catch (err: any) {
      console.error(err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
          24/7 Dedicated Support
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">How Can We Help You?</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Have questions about your order, product specifications, bulk pricing, or returns? Reach out anytime!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Support Channels & Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900">Direct Contact</h3>

            <div className="space-y-3.5 text-xs">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-3 p-3 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition"
              >
                <div className="p-2 bg-emerald-500 text-white rounded-xl">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">WhatsApp Concierge</p>
                  <p className="text-emerald-600 text-[11px]">+91 98765 43210 (Instant reply)</p>
                </div>
              </a>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-blue-50 text-blue-800">
                <div className="p-2 bg-blue-600 text-white rounded-xl">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Toll-Free Phone</p>
                  <p className="text-blue-600 text-[11px]">+91 98765 43210 (9am - 9pm)</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-purple-50 text-purple-800">
                <div className="p-2 bg-purple-600 text-white rounded-xl">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Customer Email</p>
                  <p className="text-purple-600 text-[11px]">support@urbankart.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-gray-50 text-gray-800">
                <div className="p-2 bg-gray-700 text-white rounded-xl">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">Headquarters</p>
                  <p className="text-gray-500 text-[11px]">UrbanKart Tower, SG Highway, Ahmedabad, Gujarat</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ Box */}
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Quick Answers</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <p><strong>Q: When will my order ship?</strong><br />A: Orders placed before 4 PM are dispatched the same day.</p>
              <p><strong>Q: What is the return policy?</strong><br />A: We offer a 7-day hassle-free return or replacement guarantee on all eligible products.</p>
            </div>
          </div>
        </div>

        {/* Support Message Form */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Send Us a Message</h2>
            <p className="text-xs text-gray-500 mt-1">Our support specialists typically respond within 15 minutes</p>
          </div>

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Thank you! Your inquiry has been submitted. Our team will contact you shortly.</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Mehta"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="vikram@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Mobile Phone</label>
                <input
                  type="tel"
                  placeholder="+91 97234 11223"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Inquiry Subject</label>
                <input
                  type="text"
                  placeholder="Order Inquiry, Return, Bulk Discount"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Your Message *</label>
              <textarea
                required
                rows={4}
                placeholder="How can we assist you with our products or your recent order?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending Message...' : 'Submit Inquiry'}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
