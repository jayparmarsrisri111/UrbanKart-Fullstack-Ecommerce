export interface ProductReview {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  brand: string;
  image_url: string;
  rating: number;
  reviews_count: number;
  stock: number;
  is_featured: boolean;
  is_trending: boolean;
  features?: string;
  specs?: Record<string, string>;
  reviews?: ProductReview[];
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: number;
  order_number: string;
  invoice_number?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total_amount: number;
  courier?: string;
  awb_number?: string;
  notes?: string;
  created_at: string;
  items: OrderItem[];
}

export interface Category {
  name: string;
  count: number;
  icon: string;
  image: string;
  description: string;
}

export interface Coupon {
  code: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  min_order?: number;
  min_order_value?: number;
  max_discount?: number;
  description: string;
  active?: boolean;
}

export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  pending_orders: number;
  delivered_orders: number;
  low_stock_count: number;
  avg_order_value: number;
  salesChart: { month: string; sales: number; orders: number }[];
  categoryCounts: Record<string, number>;
  recent_orders: Order[];
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}
