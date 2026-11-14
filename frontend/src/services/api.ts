import axios from 'axios';
import { Product, Order, Category, DashboardStats, Inquiry, Coupon, ProductReview } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('urbankart_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Product API
export const getProducts = async (params?: {
  category?: string;
  search?: string;
  is_featured?: boolean;
  is_trending?: boolean;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
}): Promise<Product[]> => {
  const res = await api.get<Product[]>('/products', { params });
  return res.data;
};

export const getProductByIdOrSlug = async (idOrSlug: string): Promise<Product> => {
  const res = await api.get<Product>(`/products/${idOrSlug}`);
  return res.data;
};

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  const res = await api.post<Product>('/products', productData);
  return res.data;
};

export const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product> => {
  const res = await api.put<Product>(`/products/${id}`, productData);
  return res.data;
};

export const deleteProduct = async (id: number): Promise<{ message: string; id: number }> => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const addProductReview = async (productId: number, review: { author: string; rating: number; comment: string }): Promise<Product> => {
  const res = await api.post<Product>(`/products/${productId}/reviews`, review);
  return res.data;
};

// Categories API
export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get<Category[]>('/categories');
  return res.data;
};

// Coupons API
export const getCoupons = async (): Promise<Coupon[]> => {
  const res = await api.get<Coupon[]>('/coupons');
  return res.data;
};

export const validateCoupon = async (code: string, subtotal: number): Promise<{ valid: boolean; discount?: number; message: string; code?: string }> => {
  const res = await api.post('/coupons/validate', { code, subtotal });
  return res.data;
};

export const createCoupon = async (couponData: Partial<Coupon>): Promise<Coupon> => {
  const res = await api.post<Coupon>('/coupons', couponData);
  return res.data;
};

export const deleteCoupon = async (code: string): Promise<{ success: boolean }> => {
  const res = await api.delete(`/coupons/${code}`);
  return res.data;
};

// Orders API
export const createOrder = async (orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  payment_method: string;
  promo_code?: string;
  notes?: string;
  items: {
    product_id: number;
    product_name: string;
    product_image?: string;
    price: number;
    quantity: number;
  }[];
}): Promise<Order> => {
  const res = await api.post<Order>('/orders', orderData);
  return res.data;
};

export const trackOrder = async (orderNumber: string): Promise<Order> => {
  const res = await api.get<Order>(`/orders/track/${orderNumber}`);
  return res.data;
};

export const getOrders = async (params?: { order_status?: string; search?: string }): Promise<Order[]> => {
  const res = await api.get<Order[]>('/orders', { params });
  return res.data;
};

export const updateOrderStatus = async (orderId: number, statusData: { order_status: string; payment_status?: string; courier?: string; awb_number?: string }): Promise<Order> => {
  const res = await api.patch<Order>(`/orders/${orderId}/status`, statusData);
  return res.data;
};

// Inquiries API
export const sendInquiry = async (inquiryData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<Inquiry> => {
  const res = await api.post<Inquiry>('/inquiries', inquiryData);
  return res.data;
};

export const getInquiries = async (): Promise<Inquiry[]> => {
  const res = await api.get<Inquiry[]>('/inquiries');
  return res.data;
};

export const updateInquiryStatus = async (inquiryId: number, status: string) => {
  const res = await api.patch(`/inquiries/${inquiryId}/status?status=${status}`);
  return res.data;
};

// Analytics API
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get<DashboardStats>('/analytics/stats');
  return res.data;
};

// Auth API
export const adminLogin = async (username_or_email: string, password: string) => {
  const res = await api.post('/auth/login', { username_or_email, password });
  return res.data;
};

export const getAdminProfile = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};
