import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return <footer className="site-footer"><div className="footer-wrap"><div className="footer-top"><div className="footer-brand"><Logo /><p>A considered edit of technology for work, travel, and the rituals in between.</p></div><div className="footer-links"><Link to="/products">Shop all</Link><Link to="/orders">Orders</Link><Link to="/profile">Account</Link></div></div></div></footer>;
}
