import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { demoProducts } from '../data/demoData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Icon from '../components/Icon';
import StarRating from '../components/StarRating';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [message, setMessage] = useState('');
  useEffect(() => { setLoading(true); setImageIndex(0); setQuantity(1); api.get(`/products/${id}`).then(({ data }) => { if (!data || typeof data !== 'object' || !data._id) throw new Error('The API returned an invalid product.'); setProduct(data); }).catch(() => setProduct(demoProducts.find((item) => item._id === id) || demoProducts[0])).finally(() => setLoading(false)); }, [id]);
  if (loading || !product) return <Loader label="Loading product details" />;
  const images = (Array.isArray(product.images) ? product.images : [product.image]).filter(Boolean);
  const displayImages = images.length ? images : [demoProducts[0].images[0]];
  const salePrice = Number(product.discountPrice ?? product.price ?? 0);
  const submitReview = async (event) => { event.preventDefault(); if (!user) return navigate('/login'); try { const { data } = await api.post(`/products/${product._id}/review`, review); setProduct(data); setReview({ rating: 5, comment: '' }); setMessage('Thank you for sharing your view.'); } catch (error) { setMessage(error.response?.data?.message || 'Reviews need the connected API.'); } };
  return <main className="page page-tight"><div className="breadcrumbs"><Link to="/products">Shop all</Link><span>/</span><span>{product.category?.name || 'Collection'}</span><span>/</span><span>{product.name}</span></div><section className="detail-layout"><div className="detail-gallery"><div className="thumbnail-stack">{displayImages.map((image, index) => <button className={`thumbnail ${imageIndex === index ? 'active' : ''}`} key={`${image}-${index}`} onClick={() => setImageIndex(index)}><img src={image} alt={`${product.name} view ${index + 1}`} /></button>)}</div><img className="detail-image" src={displayImages[Math.min(imageIndex, displayImages.length - 1)]} alt={product.name} /></div><div className="detail-copy"><p className="eyebrow">{product.category?.name || 'Mera Store'}</p><h1>{product.name}</h1><StarRating rating={product.ratings || 0} count={product.numReviews || 0} /><div className="detail-price">${salePrice.toLocaleString()}{product.discountPrice !== undefined && product.discountPrice !== null && <span className="compare-price">${Number(product.price || 0).toLocaleString()}</span>}</div><p className="detail-description">{product.description}</p><div className={`stock-line ${product.stock ? '' : 'out'}`}>{product.stock ? `In stock, ready to ship · ${product.stock} available` : 'Currently out of stock'}</div><div className="detail-buy"><div className="quantity-control"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Icon name="minus" /></button><span>{quantity}</span><button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} aria-label="Increase quantity"><Icon name="plus" /></button></div><button className="button" disabled={!product.stock} onClick={() => { addToCart(product, quantity); setMessage('Added to your bag.'); }}>{product.stock ? 'Add to bag' : 'Out of stock'} <Icon name="bag" /></button></div><div className="detail-info"><div className="info-block"><strong>Ready to ship</strong><span>Leaves our studio in 1-2 days</span></div><div className="info-block"><strong>Easy returns</strong><span>30 days, simple and human</span></div><div className="info-block"><strong>Secure payment</strong><span>Protected with Stripe test mode</span></div></div>{message && <p className="field-error" style={{ color: 'var(--success)' }}>{message}</p>}</div></section><section className="reviews"><div className="section-heading"><div><p className="eyebrow">Notes from customers</p><h2 className="section-title">Reviews</h2></div><span className="subtle" style={{ fontSize: '.75rem' }}>{product.numReviews || 0} verified notes</span></div>{user && <form className="review-form" onSubmit={submitReview}><strong>Leave a review</strong><StarRating interactive value={review.rating} onChange={(rating) => setReview({ ...review, rating })} /><div className="field"><label htmlFor="review-comment">Your note</label><textarea id="review-comment" value={review.comment} onChange={(event) => setReview({ ...review, comment: event.target.value })} required minLength={3} placeholder="What stood out to you?" /></div><button className="button button-small" type="submit">Publish review</button></form>}<div className="review-list">{(Array.isArray(product.reviews) ? product.reviews : []).length ? product.reviews.map((item) => <article className="review" key={item._id}><div className="review-head"><div><div className="review-author">{item.name} <span className="rating">{'★'.repeat(item.rating)}</span></div><span className="review-date">{new Date(item.createdAt).toLocaleDateString()}</span></div></div><p>{item.comment}</p></article>) : <div className="no-data">The first note is waiting to be written.</div>}</div></section></main>;
}
