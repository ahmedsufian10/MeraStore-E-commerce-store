import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('mera-store-cart')) || []; } catch { return []; } });
  const persist = (next) => { setCart(next); localStorage.setItem('mera-store-cart', JSON.stringify(next)); };
  const addToCart = (product, quantity = 1) => { const existing = cart.find((item) => item.product === product._id); const next = existing ? cart.map((item) => item.product === product._id ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } : item) : [...cart, { product: product._id, name: product.name, image: product.images?.[0], price: product.discountPrice ?? product.price, stock: product.stock, quantity }]; persist(next); };
  const updateQuantity = (id, quantity) => persist(cart.map((item) => item.product === id ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) } : item));
  const removeFromCart = (id) => persist(cart.filter((item) => item.product !== id));
  const clearCart = () => persist([]);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 75 ? 0 : 8;
  const value = useMemo(() => ({ cart, addToCart, updateQuantity, removeFromCart, clearCart, itemCount, subtotal, shipping, total: subtotal + shipping }), [cart, itemCount, subtotal, shipping]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { return useContext(CartContext); }
