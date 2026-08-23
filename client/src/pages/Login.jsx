import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const submit = async (event) => { event.preventDefault(); setSaving(true); setError(''); try { await login(Object.fromEntries(new FormData(event.currentTarget))); navigate(location.state?.from || '/'); } catch (requestError) { setError(requestError.response?.data?.message || 'Sign in is unavailable until the API is running.'); } finally { setSaving(false); } };
  return <main className="page page-tight auth-page"><div className="page-heading"><p className="eyebrow">The inner circle</p><h1>Welcome back.</h1><p>Sign in to see your orders and keep your edit close.</p></div><form className="form-card" onSubmit={submit}><div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required placeholder="you@example.com" /></div><div className="field" style={{ marginTop: 15 }}><label htmlFor="password">Password</label><input id="password" name="password" type="password" required placeholder="Your password" /></div>{error && <p className="field-error">{error}</p>}<button className="button button-block" style={{ marginTop: 22 }} disabled={saving}>{saving ? 'Signing in' : 'Sign in'}</button><p className="auth-switch">New here? <Link to="/register">Create an account</Link></p></form></main>;
}
