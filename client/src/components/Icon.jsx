import React from 'react';

const paths = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.3 4.3" /></>,
  bag: <><path d="M5 8.5h14l-1 11H6l-1-11Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
  user: <><circle cx="12" cy="8" r="3.3" /><path d="M5.7 20c.7-3.2 2.8-5 6.3-5s5.6 1.8 6.3 5" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  x: <><path d="m6 6 12 12M18 6 6 18" /></>,
  arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
  check: <path d="m5 12 4.2 4.2L19 6.5" />,
  truck: <><path d="M3 6h11v10H3zM14 10h3l3 3v3h-6z" /><circle cx="7" cy="18" r="1.7" /><circle cx="17" cy="18" r="1.7" /></>,
  sparkles: <><path d="m12 3 1.3 4.7L18 9l-4.7 1.3L12 15l-1.3-4.7L6 9l4.7-1.3L12 3ZM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" /></>,
  lock: <><rect x="5" y="10" width="14" height="10" rx="1.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  heart: <path d="M20.7 8.6c0 5.1-8.7 10-8.7 10s-8.7-4.9-8.7-10A4.6 4.6 0 0 1 12 6.3a4.6 4.6 0 0 1 8.7 2.3Z" />,
  chart: <><path d="M4 19V5M4 19h16" /><path d="m7 15 3-4 3 2 5-7" /></>,
  users: <><circle cx="9" cy="9" r="3" /><path d="M3 19c.4-3 2.4-4.7 6-4.7s5.6 1.7 6 4.7M16 7.5c2.4.2 3.7 1.6 4 3.8M16 14.4c2.1.2 3.6 1.6 4 3.6" /></>,
  box: <><path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z" /><path d="m4 7 8 4 8-4M12 11v10" /></>,
  logout: <><path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" /></>
};

export default function Icon({ name, size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}
