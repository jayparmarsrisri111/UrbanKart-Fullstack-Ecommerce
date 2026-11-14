import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Coupon } from '../types';
import { validateCoupon, getCoupons } from '../services/api';

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  promoCode: string;
  discount: number;
  availableCoupons: Coupon[];
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  totalItems: number;
  deliveryPincode: string;
  setDeliveryPincode: (pin: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('urbankart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('urbankart_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deliveryPincode, setDeliveryPincode] = useState<string>(() => {
    return localStorage.getItem('urbankart_pincode') || '380015';
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    localStorage.setItem('urbankart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('urbankart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('urbankart_pincode', deliveryPincode);
  }, [deliveryPincode]);

  useEffect(() => {
    const fetchCouponsList = async () => {
      try {
        const list = await getCoupons();
        setAvailableCoupons(list);
      } catch (e) {
        console.error('Failed to load coupons', e);
      }
    };
    fetchCouponsList();
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Math.round(cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
  const shippingFee = (subtotal - discount) >= 999 || cart.length === 0 ? 0 : 99;
  const totalAmount = Math.max(0, subtotal - discount + shippingFee);

  // Re-validate coupon when cart total changes
  useEffect(() => {
    if (promoCode && subtotal > 0) {
      validateCoupon(promoCode, subtotal).then(res => {
        if (res.valid && res.discount) {
          setDiscount(res.discount);
        } else {
          setPromoCode('');
          setDiscount(0);
        }
      }).catch(() => {
        setPromoCode('');
        setDiscount(0);
      });
    } else if (subtotal === 0) {
      setDiscount(0);
    }
  }, [subtotal, promoCode]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          return { ...item, quantity: Math.min(item.product.stock, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
    setDiscount(0);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((p) => p.id === productId);
  };

  const applyPromoCode = async (code: string) => {
    try {
      const res = await validateCoupon(code, subtotal);
      if (res.valid && res.discount !== undefined) {
        setPromoCode(code.trim().toUpperCase());
        setDiscount(res.discount);
        return { success: true, message: res.message };
      } else {
        return { success: false, message: res.message || 'Invalid coupon code' };
      }
    } catch (err: any) {
      return { success: false, message: 'Failed to apply coupon' };
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        promoCode,
        discount,
        availableCoupons,
        applyPromoCode,
        removePromoCode,
        subtotal,
        shippingFee,
        totalAmount,
        totalItems,
        deliveryPincode,
        setDeliveryPincode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
