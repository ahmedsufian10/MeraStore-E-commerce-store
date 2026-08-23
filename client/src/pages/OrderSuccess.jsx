import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';

export default function OrderSuccess() {
  const { id } = useParams();
  const { state } = useLocation();
  const { user } = useAuth();
  return <main className="page page-tight"><section className="success-panel"><div className="success-mark"><Icon name="check" size={28} /></div><p className="eyebrow">Payment confirmed</p><h1>That is a good choice.</h1><p>Thank you, {user?.name || 'there'}. Your order is being prepared with care. Your confirmation email is part of the Nodemailer flow.</p><span className="order-id">ORDER {id}</span><div className="status-timeline"><div className="timeline-step done">Placed</div><div className="timeline-step done">Paid</div><div className="timeline-step">Packed</div><div className="timeline-step">Delivered</div></div><div className="hero-actions" style={{ justifyContent: 'center' }}><Link className="button" to="/orders">View my orders <Icon name="arrow" /></Link><Link className="button button-secondary" to="/products">Keep browsing</Link></div>{state?.order?.demoMode && <p className="muted" style={{ marginTop: 18, fontSize: '.72rem' }}>Stripe demo mode is active until a test secret key is configured.</p>}</section></main>;
}
