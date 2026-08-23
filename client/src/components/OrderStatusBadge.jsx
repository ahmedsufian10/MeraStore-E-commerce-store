export default function OrderStatusBadge({ status }) {
  return <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>;
}
