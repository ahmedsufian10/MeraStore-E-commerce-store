import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Icon from './Icon';
import StarRating from './StarRating';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const salePrice = product.discountPrice ?? product.price;
  const hasCompare = product.discountPrice !== undefined && product.discountPrice !== null;
  return <article className="product-card">
    <div className="product-image-wrap">
      <Link className="product-image-button" to={`/products/${product._id}`}><img className="product-image" src={product.images?.[0]} alt={product.name} loading="lazy" /></Link>
      {product.isFeatured && <span className="product-badge">Featured</span>}
      <button className="wishlist-button" aria-label={`Save ${product.name}`}><Icon name="heart" size={15} /></button>
    </div>
    <div className="product-meta"><span className="product-category">{product.category?.name || 'Mera Store'}</span><h3 className="product-name"><Link to={`/products/${product._id}`}>{product.name}</Link></h3><div className="product-bottom"><span className="price">${salePrice.toLocaleString()} {hasCompare && <span className="compare-price">${product.price.toLocaleString()}</span>}</span><StarRating rating={product.ratings || 0} count={product.numReviews || 0} /></div><div className="card-action"><button className="button button-secondary button-small button-block" disabled={!product.stock} onClick={() => addToCart(product)}>{product.stock ? 'Add to bag' : 'Out of stock'}</button></div></div>
  </article>;
}
