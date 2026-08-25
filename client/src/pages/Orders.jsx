import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { demoOrders } from '../data/demoData';
import Loader from '../components/Loader';
import OrderStatusBadge from '../components/OrderStatusBadge';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/orders/my').then(({ data }) => { if (!Array.isArray(data)) throw new Error('The API returned an invalid order collection.'); setOrders(data); }).catch(() => setOrders(demoOrders)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loader label="Loading your orders" />;
  return <main className="page page-tight"><div className="page-heading"><p className="eyebrow">Your account</p><h1>My orders.</h1><p>Keep an eye on the pieces making their way to you.</p></div><section className="orders-grid">{orders.map((order) => <article className="order-card" key={order._id}><div className="order-card-head"><div><h3>Order {order._id}</h3><p>{new Date(order.createdAt).toLocaleDateString()} · {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} items</p></div><OrderStatusBadge status={order.status} /></div><div className="order-items-preview">{order.orderItems.map((item) => <img key={`${order._id}-${item.product}`} src={item.image} alt={item.name} title={item.name} />)}</div><div className="order-card-foot"><span className="order-total">${order.totalPrice.toLocaleString()}</span><Link className="button button-secondary button-small" to={`/orders/${order._id}`}>View details</Link></div></article>)}</section></main>;
}
