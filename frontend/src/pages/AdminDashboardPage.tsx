import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  Clock, 
  Plus, 
  Trash2, 
  Search, 
  Layers, 
  MessageSquare,
  X,
  Printer,
  Tag,
  Edit2,
  TrendingUp,
  Percent,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  getDashboardStats, 
  getOrders, 
  updateOrderStatus, 
  getProducts, 
  createProduct, 
  updateProduct,
  deleteProduct, 
  getInquiries,
  updateInquiryStatus,
  getCoupons,
  createCoupon,
  deleteCoupon
} from '../services/api';
import { DashboardStats, Order, Product, Inquiry, Coupon } from '../types';
import { formatINR } from '../utils/formatCurrency';
import { TaxInvoiceModal } from '../components/TaxInvoiceModal';

export const AdminDashboardPage: React.FC = () => {
  const location = useLocation();

  // Determine active tab from URL path
  const getTabFromPath = () => {
    if (location.pathname.includes('/orders')) return 'orders';
    if (location.pathname.includes('/products')) return 'products';
    if (location.pathname.includes('/coupons')) return 'coupons';
    if (location.pathname.includes('/messages')) return 'inquiries';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons' | 'inquiries'>(getTabFromPath());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [productSearch, setProductSearch] = useState('');

  // Selected Order for Invoice Print
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Add Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Electronics',
    brand: 'UrbanKart',
    price: 4999,
    original_price: 6999,
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    description: '',
    features: 'High performance\n1-Year Brand Warranty',
    is_featured: true,
    is_trending: false,
  });

  // Edit Product Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Coupon Form
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'flat',
    discount_value: 15,
    min_order_value: 1499,
    max_discount: 500,
    description: 'Flat discount across store',
  });
  const [couponSubmitting, setCouponSubmitting] = useState(false);

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [statsData, ordersData, prodsData, inqsData, couponsData] = await Promise.all([
        getDashboardStats(),
        getOrders(),
        getProducts(),
        getInquiries(),
        getCoupons(),
      ]);
      setStats(statsData);
      setOrders(ordersData);
      setProducts(prodsData);
      setInquiries(inqsData);
      setCoupons(couponsData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, { order_status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
      );
      const newStats = await getDashboardStats();
      setStats(newStats);
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update status');
    }
  };

  const handleInquiryStatus = async (inqId: number, status: string) => {
    try {
      await updateInquiryStatus(inqId, status);
      setInquiries((prev) =>
        prev.map((i) => (i.id === inqId ? { ...i, status } : i))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product from UrbanKart?')) return;
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      const newStats = await getDashboardStats();
      setStats(newStats);
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createProduct(newProduct);
      setProducts((prev) => [created, ...prev]);
      setIsAddModalOpen(false);
      setNewProduct({
        name: '',
        category: 'Electronics',
        brand: 'UrbanKart',
        price: 4999,
        original_price: 6999,
        stock: 50,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        description: '',
        features: 'High performance\n1-Year Brand Warranty',
        is_featured: true,
        is_trending: false,
      });
      const newStats = await getDashboardStats();
      setStats(newStats);
    } catch (err) {
      console.error(err);
      alert('Failed to create product');
    }
  };

  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const updated = await updateProduct(editingProduct.id, editingProduct);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditingProduct(null);
      const newStats = await getDashboardStats();
      setStats(newStats);
    } catch (err) {
      console.error(err);
      alert('Failed to update product');
    }
  };

  const handleCreateCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;
    try {
      setCouponSubmitting(true);
      const created = await createCoupon({
        ...newCoupon,
        code: newCoupon.code.trim().toUpperCase(),
      });
      setCoupons((prev) => [created, ...prev]);
      setNewCoupon({
        code: '',
        discount_type: 'percentage',
        discount_value: 15,
        min_order_value: 1499,
        max_discount: 500,
        description: 'Flat discount across store',
      });
    } catch (err) {
      console.error('Failed to create coupon:', err);
      alert('Failed to create coupon');
    } finally {
      setCouponSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!window.confirm(`Deactivate coupon ${code}?`)) return;
    try {
      await deleteCoupon(code);
      setCoupons((prev) => prev.filter((c) => c.code !== code));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === 'All' ? true : o.order_status.toLowerCase() === orderStatusFilter.toLowerCase()
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  // SVG Chart Calculation
  const chartData = stats?.salesChart || [
    { month: 'Jun', sales: 45000, orders: 12 },
    { month: 'Jul', sales: 68000, orders: 18 },
    { month: 'Aug', sales: 92000, orders: 24 },
    { month: 'Sep', sales: 115000, orders: 31 },
    { month: 'Oct', sales: 184000, orders: 48 },
    { month: 'Nov', sales: stats?.total_revenue || 240000, orders: stats?.total_orders || 65 },
  ];

  const maxSales = Math.max(...chartData.map((d) => d.sales), 10000);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Independent Admin Management Portal</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">UrbanKart Control Center</h1>
          <p className="text-xs text-slate-400">Live order fulfillment, inventory syncing, discount vouchers & Indian Rupee (₹) revenue</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center space-x-1.5 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
              <span className="text-2xl font-black">₹</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Gross Revenue</p>
              <h3 className="text-xl sm:text-2xl font-black text-white">{formatINR(stats.total_revenue)}</h3>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Customer Orders</p>
              <h3 className="text-xl sm:text-2xl font-black text-white">{stats.total_orders}</h3>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Catalog Products</p>
              <h3 className="text-xl sm:text-2xl font-black text-white">{stats.total_products}</h3>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Pending Delivery</p>
              <h3 className="text-xl sm:text-2xl font-black text-white">{stats.pending_orders}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Internal Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-xs sm:text-sm font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'overview'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Analytics & Sales Trend
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 flex items-center space-x-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'orders'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders & Invoicing ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 border-b-2 flex items-center space-x-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'products'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Catalog Inventory ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`pb-3 border-b-2 flex items-center space-x-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'coupons'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Coupons & Offers ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 border-b-2 flex items-center space-x-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'inquiries'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Customer Help ({inquiries.length})</span>
        </button>
      </div>

      {/* TAB: Overview (Analytics Chart + Quick Orders) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Revenue Chart Card */}
          <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Monthly Sales Trend (INR ₹)
                </span>
                <h2 className="text-lg font-black text-white mt-1">Store Performance Analytics</h2>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                FY 2026-27
              </span>
            </div>

            {/* SVG Visual Bar/Line Chart */}
            <div className="space-y-3 pt-2">
              <div className="h-56 sm:h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-800">
                {chartData.map((d, idx) => {
                  const heightPercent = Math.max(12, Math.round((d.sales / maxSales) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-slate-200 text-[10px] font-mono py-1 px-2 rounded-lg shadow-xl -translate-y-1 pointer-events-none whitespace-nowrap">
                        {formatINR(d.sales)} ({d.orders} orders)
                      </div>
                      <div className="w-full bg-slate-900/60 rounded-xl overflow-hidden p-1 flex items-end justify-center h-full max-w-[56px]">
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 via-indigo-500 to-emerald-400 rounded-lg transition-all duration-700 group-hover:brightness-110"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 group-hover:text-white transition">
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Monthly revenue performance graph</span>
                <span className="font-bold text-emerald-400">Peak Volume: {formatINR(maxSales)}</span>
              </div>
            </div>
          </div>

          {/* Recent Orders Snippet */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white">Latest Orders</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-blue-400 hover:text-blue-300"
              >
                View All Orders →
              </button>
            </div>

            <div className="divide-y divide-slate-800/80">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-blue-400 mr-2">{o.order_number}</span>
                    <span className="text-white font-medium">{o.customer_name}</span>
                    <span className="text-slate-500 ml-2">({o.city})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-emerald-400">{formatINR(o.total_amount)}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      o.order_status === 'Delivered'
                        ? 'bg-emerald-950 text-emerald-400'
                        : o.order_status === 'Shipped'
                        ? 'bg-blue-950 text-blue-400'
                        : 'bg-amber-950 text-amber-400'
                    }`}>
                      {o.order_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB: Orders & Tax Invoicing */}
      {activeTab === 'orders' && (
        <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-base font-extrabold text-white">Order Management & GST Invoicing</h2>
              <p className="text-xs text-slate-400">Change shipment stages, view AWB tracking & generate official Tax Invoices</p>
            </div>
            
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Filter:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
              >
                <option value="All">All Statuses</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-800">
              <thead>
                <tr className="text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Order ID / Invoice</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Address & Phone</th>
                  <th className="py-3 px-3">Courier / AWB</th>
                  <th className="py-3 px-3">Total (₹)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No customer orders found matching this filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-900/60 transition">
                      <td className="py-3 px-3">
                        <p className="font-mono font-bold text-blue-400">{o.order_number}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{o.invoice_number || `INV-${o.order_number}`}</p>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-white">{o.customer_name}</p>
                        <p className="text-[10px] text-slate-400">{o.customer_email}</p>
                      </td>
                      <td className="py-3 px-3">
                        <p>{o.city} ({o.postal_code})</p>
                        <p className="text-slate-400 text-[10px]">{o.customer_phone}</p>
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-slate-200 font-medium">{o.courier || 'Delhivery'}</p>
                        <p className="text-[10px] font-mono text-slate-400">{o.awb_number || 'N/A'}</p>
                      </td>
                      <td className="py-3 px-3 font-extrabold text-emerald-400">
                        {formatINR(o.total_amount)}
                        <span className="block text-[9px] uppercase font-normal text-slate-400">{o.payment_method}</span>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={o.order_status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            o.order_status === 'Delivered'
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                              : o.order_status === 'Shipped'
                              ? 'bg-blue-950/80 text-blue-400 border-blue-800'
                              : o.order_status === 'Cancelled'
                              ? 'bg-rose-950/80 text-rose-400 border-rose-800'
                              : 'bg-amber-950/80 text-amber-400 border-amber-800'
                          }`}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedInvoiceOrder(o)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-800 flex items-center gap-1.5 ml-auto text-xs font-bold transition cursor-pointer"
                          title="View & Print Official GST Tax Invoice"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Print</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Products Management */}
      {activeTab === 'products' && (
        <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-base font-extrabold text-white">Product Inventory Catalog</h2>
              <p className="text-xs text-slate-400">Manage pricing in INR (₹), stock inventory & product attributes</p>
            </div>
            
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 text-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-800">
              <thead>
                <tr className="text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price (INR ₹)</th>
                  <th className="py-3 px-3">Stock Units</th>
                  <th className="py-3 px-3">Badges</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/60 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-3">
                        <img src={p.image_url} alt="" className="w-10 h-10 object-cover rounded-lg border border-slate-800 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-white line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">{p.category}</td>
                    <td className="py-3 px-3 font-extrabold text-emerald-400">
                      {formatINR(p.price)}
                      {p.original_price > p.price && (
                        <span className="block text-[10px] text-slate-500 line-through">
                          {formatINR(p.original_price)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-bold">
                      <span className={p.stock <= 10 ? 'text-rose-400' : 'text-slate-200'}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-3 space-x-1">
                      {p.is_featured && <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded">Featured</span>}
                      {p.is_trending && <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded">Trending 🔥</span>}
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 text-slate-400 hover:text-blue-400 transition cursor-pointer"
                        title="Edit product details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Coupons Management */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Coupon Card */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Create New Promo Coupon</span>
            </div>

            <form onSubmit={handleCreateCouponSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Coupon Promo Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE25"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-white font-mono uppercase rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Type</label>
                  <select
                    value={newCoupon.discount_type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-white rounded-xl"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Cash (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discount_value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-white rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Min Cart (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.min_order_value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, min_order_value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-white rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.max_discount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, max_discount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-white rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Public Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20% off on all items above ₹999"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-white rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={couponSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl transition cursor-pointer"
              >
                {couponSubmitting ? 'Creating...' : 'Launch Coupon Offer'}
              </button>
            </form>
          </div>

          {/* Active Coupons List */}
          <div className="lg:col-span-2 bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white">Live Store Coupons ({coupons.length})</h3>
              <span className="text-xs text-slate-400">Available to customers in cart & checkout</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map((c) => (
                <div key={c.code} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
                      {c.code}
                    </span>
                    <button
                      onClick={() => handleDeleteCoupon(c.code)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-white font-medium">{c.description}</p>
                  <div className="text-[11px] text-slate-400 space-y-0.5 pt-1 border-t border-slate-800/80">
                    <p>
                      Discount: <span className="font-bold text-slate-200">{c.discount_type === 'percentage' ? `${c.discount_value}%` : formatINR(c.discount_value)}</span>
                    </p>
                    <p>
                      Min Order: <span className="font-bold text-slate-200">{formatINR(c.min_order_value || c.min_order || 0)}</span>
                      {c.max_discount && ` • Cap: ${formatINR(c.max_discount)}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB: Customer Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-sm overflow-hidden p-6 space-y-4">
          <h2 className="text-base font-extrabold text-white">Customer Support Inquiries</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-800">
              <thead>
                <tr className="text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Message</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No customer inquiries received yet.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-900/60 transition">
                      <td className="py-3 px-3 font-semibold text-white">{inq.name}</td>
                      <td className="py-3 px-3">
                        <p>{inq.email}</p>
                        <p className="text-slate-400 text-[10px]">{inq.phone || 'No phone'}</p>
                      </td>
                      <td className="py-3 px-3 font-bold text-blue-300">{inq.subject}</td>
                      <td className="py-3 px-3 max-w-xs">{inq.message}</td>
                      <td className="py-3 px-3">
                        <select
                          value={inq.status}
                          onChange={(e) => handleInquiryStatus(inq.id, e.target.value)}
                          className="bg-slate-900 border border-slate-800 text-xs font-bold rounded-lg px-2 py-1 text-slate-200 cursor-pointer"
                        >
                          <option value="Unread">Unread</option>
                          <option value="Replied">Replied</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-950 border border-slate-800 text-slate-200 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>Edit Product Details</span>
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold text-emerald-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={editingProduct.image_url}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center space-x-6 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_trending}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_trending: e.target.checked })}
                  />
                  <span>Trending Deal 🔥</span>
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-950 border border-slate-800 text-slate-200 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add New Product to Store (INR ₹)</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Boat Rockerz Wireless Headphones"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Home & Living">Home & Living</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={newProduct.original_price}
                    onChange={(e) => setNewProduct({ ...newProduct, original_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Product Description</label>
                <textarea
                  rows={2}
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.is_featured}
                    onChange={(e) => setNewProduct({ ...newProduct, is_featured: e.target.checked })}
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.is_trending}
                    onChange={(e) => setNewProduct({ ...newProduct, is_trending: e.target.checked })}
                  />
                  <span>Trending Deal 🔥</span>
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  Publish Product
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GST Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <TaxInvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

    </div>
  );
};
