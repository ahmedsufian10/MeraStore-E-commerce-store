import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { demoProducts } from '../../data/demoData';
import Loader from '../../components/Loader';
import Icon from '../../components/Icon';

export default function AdminProducts() {
  const [products, setProducts] = useState([]); const [loading, setLoading] = useState(true); const [message, setMessage] = useState('');
  const load = () => api.get('/products?limit=48').then(({ data }) => { if (!Array.isArray(data?.data)) throw new Error('The API returned an invalid product collection.'); setProducts(data.data); }).catch(() => setProducts(demoProducts)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const remove = async (id) => { if (!window.confirm('Delete this product?')) return; try { await api.delete(`/products/${id}`); setProducts(products.filter((product) => product._id !== id)); } catch (error) { setMessage(error.response?.data?.message || 'Product could not be deleted.'); } };
  if (loading) return <Loader label="Loading products" />;
  return <main className="page page-tight"><section className="admin-layout"><aside className="admin-sidebar"><h2>Studio desk</h2><p>Manage the store with a clear view of the essentials.</p><Link className="admin-tab" to="/admin">Overview</Link><Link className="admin-tab active" to="/admin/products">Products</Link><Link className="admin-tab" to="/admin/orders">Orders</Link><Link className="admin-tab" to="/admin/users">Customers</Link></aside><div className="admin-content"><p className="eyebrow">Catalog management</p><h1>Products.</h1><p className="subtle">Create, update, and curate every product in the Mera Store catalog.</p><div className="hero-actions" style={{ marginTop: 0 }}><Link className="button" to="/admin/products/create">Add product <Icon name="plus" /></Link>{message && <span className="field-error">{message}</span>}</div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product._id}><td><div className="product-admin"><img src={product.images?.[0]} alt="" /><div><strong>{product.name}</strong><span>{product._id}</span></div></div></td><td>{product.category?.name || 'Uncategorized'}</td><td>${Number(product.discountPrice ?? product.price ?? 0).toLocaleString()}</td><td>{product.stock}</td><td><div className="product-admin-actions"><Link className="button button-secondary button-small" to={`/admin/products/${product._id}/edit`}>Edit</Link><button className="button button-secondary button-small" onClick={() => remove(product._id)}>Delete</button></div></td></tr>)}</tbody></table></div></div></section></main>;
}
