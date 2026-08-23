import StarRating from './StarRating';

export default function ReviewCard({ review }) {
  return <article className="review"><div className="review-head"><div><div className="review-author">{review.name} <StarRating rating={review.rating} /></div><span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span></div></div><p>{review.comment}</p></article>;
}
