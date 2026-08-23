export default function Pagination({ page = 1, pages = 1, onChange }) {
  if (pages <= 1) return null;
  return <div className="hero-actions" style={{ justifyContent: 'center' }}>{Array.from({ length: pages }, (_, index) => index + 1).map((number) => <button key={number} className={`button button-small ${number === page ? '' : 'button-secondary'}`} onClick={() => onChange(number)}>{number}</button>)}</div>;
}
