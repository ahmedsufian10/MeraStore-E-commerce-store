import { Link } from 'react-router-dom';
export default function NotFound() { return <main className="page page-tight"><div className="empty-state"><p className="eyebrow">404</p><h2>This page took a different route.</h2><p>Let us get you back to the considered edit.</p><Link className="button" to="/">Back to Mera Store</Link></div></main>; }
