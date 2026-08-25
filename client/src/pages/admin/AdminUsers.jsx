import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const demoUsers = [{ _id: '1', name: 'Alex Morgan', email: 'alex@example.com', createdAt: '2026-06-02' }, { _id: '2', name: 'Samira Khan', email: 'samira@example.com', createdAt: '2026-05-24' }, { _id: '3', name: 'Mina Karim', email: 'mina@example.com', createdAt: '2026-05-17' }];

export default function AdminUsers() {
  const [users, setUsers] = useState([]); const [loading, setLoading] = useState(true); const [message, setMessage] = useState('');
  useEffect(() => { api.get('/admin/users').then(({ data }) => { if (!Array.isArray(data)) throw new Error('The API returned an invalid customer collection.'); setUsers(data); }).catch(() => setUsers(demoUsers)).finally(() => setLoading(false)); }, []);
  const remove = async (id) => { if (!window.confirm('Delete this customer account?')) return; try { await api.delete(`/admin/users/${id}`); setUsers(users.filter((user) => user._id !== id)); } catch (error) { setMessage(error.response?.data?.message || 'Customer could not be deleted.'); } };
  if (loading) return <Loader label="Loading customers" />;
  return <main className="page page-tight"><section className="admin-layout"><aside className="admin-sidebar"><h2>Studio desk</h2><p>Manage the store with a clear view of the essentials.</p><Link className="admin-tab" to="/admin">Overview</Link><Link className="admin-tab" to="/admin/products">Products</Link><Link className="admin-tab" to="/admin/orders">Orders</Link><Link className="admin-tab active" to="/admin/users">Customers</Link></aside><div className="admin-content"><p className="eyebrow">Customer management</p><h1>Customers.</h1><p className="subtle">A respectful view of the people who keep Mera Store moving.</p>{message && <p className="field-error">{message}</p>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Customer</th><th>Email</th><th>Joined</th><th>Action</th></tr></thead><tbody>{users.map((user) => <tr key={user._id}><td><strong>{user.name}</strong></td><td>{user.email}</td><td>{new Date(user.createdAt).toLocaleDateString()}</td><td><button className="button button-secondary button-small" onClick={() => remove(user._id)}>Delete</button></td></tr>)}</tbody></table></div></div></section></main>;
}
