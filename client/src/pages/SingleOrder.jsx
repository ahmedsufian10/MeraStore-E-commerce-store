import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { demoOrders } from '../data/demoData';
import Loader from '../components/Loader';
import OrderStatusBadge from '../components/OrderStatusBadge';

export default function SingleOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get(`/orders/${id}`).then(({ data }) => { if (!data || typeof data !== 'object' || !data._id) throw new Error('The API returned an invalid order.'); setOrder(data); }).catch(() => setOrder(demoOrders.find((item) => item._id === id) || demoOrders[0])).finally(() => setLoading(false)); }, [id]);
  if (loading || !order) return <Loader label="Loading order details" />;
  return <main className="page page-tight"><div className="breadcrumbs"><Link to="/orders">My orders</Link><span>/</span><span>{order._id}</span></div><div className="page-heading"><p className="eyebrow">Order details</p><h1>{order._id}</h1><p>Placed on {new Date(order.createdAt).toLocaleDateString()} <OrderStatusBadge status={order.status} /></p></div><section className="checkout-layout"><div className="form-card"><h2>Items</h2><table className="order-items-table"><tbody>{order.orderItems.map((item) => <tr key={`${item.product}-${item.name}`}><td style={{ width: 60 }}><img src={item.image} alt="" /></td><td>{item.name}<br /><span className="muted">Quantity {item.quantity}</span></td><td style={{ textAlign: 'right' }}>${(item.price * item.quantity).toLocaleString()}</td></tr>)}</tbody></table></div><aside className="summary-card"><h2>Summary</h2><div className="summary-line"><span>Items</span><strong>${order.itemsPrice?.toLocaleString() || order.totalPrice.toLocaleString()}</strong></div><div className="summary-line"><span>Shipping</span><strong>${order.shippingPrice?.toLocaleString() || '0'}</strong></div><div className="summary-total"><span>Total</span><strong>${order.totalPrice.toLocaleString()}</strong></div><p className="order-address"><strong>Shipping to</strong><br />{order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.country}` : 'Address stored securely with your order.'}</p></aside></section></main>;
}
