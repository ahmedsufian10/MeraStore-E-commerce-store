export default function Loader({ label = 'Loading your view' }) {
  return <div className="page-loading" role="status" aria-label={label}><span className="spinner" /></div>;
}
