import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { demoOrders } from '../../data/demoData';
import Loader from '../../components/Loader';
import OrderStatusBadge from '../../components/OrderStatusBadge';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [message, setMessage] = useState('');
  useEffect(() => { api.get('/orders').then(({ data }) => setOrders(data)).catch(() => setOrders(demoOrders)).finally(() => setLoading(false)); }, []);
  const update = async (id, status) => { try { const { data } = await api.put(`/orders/${id}/status`, { status }); setOrders(orders.map((order) => order._id === id ? data : order)); setMessage(`${id} moved to ${status}.`); } catch (error) { setMessage(error.response?.data?.message || 'Order status could not be updated.'); } };
  if (loading) return <Loader label="Loading all orders" />;
  return <main className="page page-tight"><section className="admin-layout"><aside className="admin-sidebar"><h2>Studio desk</h2><p>Manage the store with a clear view of the essentials.</p><Link className="admin-tab" to="/admin">Overview</Link><Link className="admin-tab" to="/admin/products">Products</Link><Link className="admin-tab active" to="/admin/orders">Orders</Link><Link className="admin-tab" to="/admin/users">Customers</Link></aside><div className="admin-content"><p className="eyebrow">Order management</p><h1>Orders.</h1><p className="subtle">Keep every order moving with one clear status story.</p>{message && <p className="field-error" style={{ color: 'var(--success)' }}>{message}</p>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order._id}><td><strong>{order._id}</strong></td><td>{order.user?.name || 'Customer'}</td><td>{new Date(order.createdAt).toLocaleDateString()}</td><td>${order.totalPrice.toLocaleString()}</td><td><select value={order.status} onChange={(event) => update(order._id, event.target.value)} aria-label={`Status for ${order._id}`}>{['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => <option key={status}>{status}</option>)}</select> <OrderStatusBadge status={order.status} /></td></tr>)}</tbody></table></div></div></section></main>;
}
