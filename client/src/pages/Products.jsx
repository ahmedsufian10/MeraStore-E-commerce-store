import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { demoCategories, demoProducts } from '../data/demoData';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Icon from '../components/Icon';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(demoCategories);
  const [loading, setLoading] = useState(true);
  const query = params.get('search') || '';
  const category = params.get('category') || 'all';
  const sort = params.get('sort') || 'featured';
  useEffect(() => { setLoading(true); const fallbackProducts = demoProducts.filter((product) => { const matchesQuery = !query || `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase()); const matchesCategory = category === 'all' || product.category?.slug === category; return matchesQuery && matchesCategory; }); Promise.all([api.get('/products', { params: { search: query, category: category !== 'all' ? category : undefined, sort } }), api.get('/categories')]).then(([productsResponse, categoriesResponse]) => { const remoteProducts = productsResponse?.data?.data; const remoteCategories = categoriesResponse?.data; if (!Array.isArray(remoteProducts)) throw new Error('The API returned an invalid product collection.'); setProducts(remoteProducts); if (Array.isArray(remoteCategories)) setCategories(remoteCategories); }).catch(() => { setProducts(fallbackProducts); }).finally(() => setLoading(false)); }, [query, category, sort]);
  const categoryOptions = useMemo(() => [{ name: 'All', slug: 'all' }, ...categories], [categories]);
  const updateParam = (key, value) => { const next = new URLSearchParams(params); if (!value || value === 'all' || value === 'featured') next.delete(key); else next.set(key, value); setParams(next); };
  if (loading) return <Loader label="Loading the collection" />;
  return <main className="page page-tight"><section className="catalog-header"><div><p className="eyebrow">The collection</p><h1>Shop the edit.</h1></div><p>Every piece is selected for useful details, honest materials, and a little more ease in the day.</p></section><div className="filter-bar"><form className="search-box" onSubmit={(event) => { event.preventDefault(); updateParam('search', event.currentTarget.query.value.trim()); }}><input name="query" defaultValue={query} placeholder="Search by product, category, or use" aria-label="Search the catalog" /><button aria-label="Search catalog"><Icon name="search" /></button></form><select className="select-control" value={sort} onChange={(event) => updateParam('sort', event.target.value)} aria-label="Sort products"><option value="featured">Sort: Featured</option><option value="price-asc">Price: Low to high</option><option value="price-desc">Price: High to low</option><option value="top-rated">Top rated</option></select><span className="muted" style={{ fontSize: '.75rem' }}>{products.length} pieces</span></div><div className="filter-chips">{categoryOptions.map((option) => <button className={`chip ${category === option.slug ? 'active' : ''}`} key={option.slug} onClick={() => updateParam('category', option.slug)}>{option.name}</button>)}</div>{products.length ? <><p className="catalog-result">Showing {products.length} considered pieces{query ? ` for “${query}”` : ''}.</p><div className="product-grid">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div></> : <div className="empty-state"><h2>Nothing in this edit yet.</h2><p>Try clearing the search or choosing another category.</p><button className="button button-secondary" onClick={() => setParams({})}>Reset filters</button></div>}</main>;
}
