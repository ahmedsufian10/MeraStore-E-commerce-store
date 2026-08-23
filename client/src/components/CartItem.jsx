import { useCart } from '../context/CartContext';
import Icon from './Icon';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  return <article className="cart-row"><img src={item.image} alt={item.name} /><div><span className="product-category">Mera Store</span><h3>{item.name}</h3><button className="remove-link" onClick={() => removeFromCart(item.product)}>Remove</button></div><div className="quantity-control"><button onClick={() => updateQuantity(item.product, item.quantity - 1)} aria-label="Decrease quantity"><Icon name="minus" /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.product, item.quantity + 1)} aria-label="Increase quantity"><Icon name="plus" /></button></div><span className="price">${(item.price * item.quantity).toLocaleString()}</span></article>;
}
