import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Icon from './Icon';
import Logo from './Logo';

export default function Layout() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const submitSearch = (event) => { event.preventDefault(); navigate(`/products${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ''}`); setOpen(false); };
  const navClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;
  return <div className="site-shell"><div className="topline">Free shipping over $75 <span aria-hidden="true">&nbsp;|&nbsp;</span> thoughtful technology, delivered with care</div><header className="site-header"><div className="nav-wrap"><Logo /><nav className={`main-nav ${open ? 'open' : ''}`} aria-label="Main navigation"><NavLink className={navClass} to="/" end onClick={() => setOpen(false)}>Home</NavLink><NavLink className={navClass} to="/products" onClick={() => setOpen(false)}>Shop all</NavLink><NavLink className={navClass} to="/products?category=audio" onClick={() => setOpen(false)}>Audio</NavLink><NavLink className={navClass} to="/products?category=workspace" onClick={() => setOpen(false)}>Workspace</NavLink>{user?.role === 'admin' && <NavLink className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`} to="/admin" onClick={() => setOpen(false)}>Admin studio</NavLink>}</nav><div className="header-actions"><form className="search-box header-search" onSubmit={submitSearch}><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search products" placeholder="Search" /><button aria-label="Submit search"><Icon name="search" /></button></form><Link className="icon-button" to={user ? '/profile' : '/login'} aria-label="Open account"><Icon name="user" /></Link><Link className="icon-button cart-button" to="/cart" aria-label="Open cart"><Icon name="bag" /><span className="cart-count">{itemCount}</span></Link><button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu"><Icon name={open ? 'x' : 'menu'} /></button></div></div></header><div className="page-shell"><Outlet /></div><footer className="site-footer"><div className="footer-wrap"><div className="footer-top"><div className="footer-brand"><Logo /><p>A considered edit of technology for work, travel, and the rituals in between.</p></div><div className="footer-links"><Link to="/products">Shop all</Link><Link to="/orders">Orders</Link><Link to="/profile">Account</Link>{user?.role === 'admin' && <Link to="/admin">Admin</Link>}</div></div><div className="footer-bottom"><span>© 2026 Mera Store</span><span>Built for the Weeks 7-8 capstone</span></div></div></footer></div>;
}
