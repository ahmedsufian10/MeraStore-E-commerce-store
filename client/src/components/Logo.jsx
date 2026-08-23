import { Link } from 'react-router-dom';

export default function Logo() {
  return <Link className="brand" to="/" aria-label="Mera Store home"><span className="brand-mark"><img src="/mera-store-mark.svg" alt="" /></span><span className="brand-name"><strong>Mera Store</strong><small>Modern essentials</small></span></Link>;
}
