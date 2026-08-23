import { useMemo, useState } from 'react';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import Icon from '../components/Icon';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) : null;

function PaymentFields({ stripeEnabled }) {
  if (stripeEnabled) return <div className="payment-preview"><span><CardElement options={{ style: { base: { fontSize: '15px', color: '#0e2f3c' } } }} /></span><span>Stripe</span></div>;
  return <><div className="payment-preview"><span>Stripe test card ending in 4242</span><span>Demo ready</span></div><div className="form-grid" style={{ marginTop: 15 }}><div className="field full"><label htmlFor="card">Card number</label><input id="card" defaultValue="4242 4242 4242 4242" required /></div><div className="field"><label htmlFor="expiry">Expiry</label><input id="expiry" placeholder="12 / 28" required /></div><div className="field"><label htmlFor="cvc">CVC</label><input id="cvc" placeholder="123" required /></div></div></>;
}

function CheckoutForm() {
  const { cart, subtotal, total, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    const data = new FormData(event.currentTarget);
    const shippingAddress = { street: data.get('street'), city: data.get('city'), province: data.get('province'), postalCode: data.get('postalCode'), country: data.get('country') };
    const orderItems = cart.map((item) => ({ product: item.product, quantity: item.quantity }));
    try {
      const { data: orderData } = await api.post('/orders', { orderItems, shippingAddress });
      if (stripe && elements && orderData.clientSecret && orderData.clientSecret !== 'demo_client_secret') { const result = await stripe.confirmCardPayment(orderData.clientSecret, { payment_method: { card: elements.getElement(CardElement) } }); if (result.error) throw new Error(result.error.message); }
      await api.post(`/orders/${orderData.order._id}/pay`);
      clearCart(); navigate(`/order-success/${orderData.order._id}`, { state: { order: orderData.order } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'We could not complete that payment.');
    } finally { setSaving(false); }
  };
  return <main className="page page-tight"><div className="page-heading"><p className="eyebrow">Almost yours</p><h1>Checkout.</h1><p>A secure payment flow using Stripe test mode. No real card is charged.</p></div><section className="checkout-layout"><form className="form-card" onSubmit={submit}><h2>Shipping address</h2><div className="form-grid"><div className="field full"><label htmlFor="name">Full name</label><input id="name" name="name" required placeholder="Alex Morgan" /></div><div className="field full"><label htmlFor="street">Street address</label><input id="street" name="street" required placeholder="12 Garden Street" /></div><div className="field"><label htmlFor="city">City</label><input id="city" name="city" required placeholder="Lahore" /></div><div className="field"><label htmlFor="province">Province</label><input id="province" name="province" required placeholder="Punjab" /></div><div className="field"><label htmlFor="postalCode">Postal code</label><input id="postalCode" name="postalCode" required placeholder="54000" /></div><div className="field"><label htmlFor="country">Country</label><select id="country" name="country"><option>Pakistan</option><option>United Arab Emirates</option><option>United Kingdom</option><option>United States</option></select></div></div><div className="form-section"><h3>Payment</h3><PaymentFields stripeEnabled={Boolean(stripePromise)} /></div>{error && <p className="field-error">{error}</p>}<div className="form-actions"><button className="button button-block" disabled={saving} type="submit">{saving ? 'Processing payment' : `Pay $${total.toLocaleString()}`} {!saving && <Icon name="arrow" />}</button><p className="checkout-demo">{!saving && <Icon name="lock" />} Stripe test card: 4242 4242 4242 4242</p></div></form><aside className="summary-card"><h2>Order summary</h2>{cart.map((item) => <div className="summary-line" key={item.product}><span>{item.name} × {item.quantity}</span><strong>${(item.price * item.quantity).toLocaleString()}</strong></div>)}<div className="summary-line"><span>Shipping</span><strong>Complimentary</strong></div><div className="summary-total"><span>Total</span><strong>${(subtotal + (subtotal >= 75 ? 0 : 8)).toLocaleString()}</strong></div></aside></section></main>;
}

export default function Checkout() { return <Elements stripe={stripePromise}><CheckoutForm /></Elements>; }
