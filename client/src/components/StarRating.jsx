export default function StarRating({ rating = 0, count, interactive = false, value, onChange }) {
  const score = Number(rating) || 0;
  const selected = Number(value) || 0;
  return <span className={interactive ? 'star-picker' : 'rating'} aria-label={`${score} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => interactive ? <button type="button" key={star} className={star <= selected ? 'active' : ''} onClick={() => onChange(star)} aria-label={`${star} stars`}>★</button> : <span key={star} style={{ color: star <= Math.round(score) ? '#E2A45B' : '#C4CCD0' }}>★</span>)}{!interactive && <span className="rating-count">{score.toFixed(1)} {count !== undefined ? `(${count})` : ''}</span>}</span>;
}
