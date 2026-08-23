import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const submit = async (event) => { event.preventDefault(); setSaving(true); setError(''); const values = Object.fromEntries(new FormData(event.currentTarget)); if (values.password !== values.confirmPassword) { setError('Passwords do not match.'); setSaving(false); return; } try { await register({ name: values.name, email: values.email, password: values.password }); navigate('/'); } catch (requestError) { setError(requestError.response?.data?.message || 'Registration is unavailable until the API is running.'); } finally { setSaving(false); } };
  return <main className="page page-tight auth-page"><div className="page-heading"><p className="eyebrow">Join the edit</p><h1>Make an account.</h1><p>Save your details and be first to hear about the next considered release.</p></div><form className="form-card" onSubmit={submit}><div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" required placeholder="Alex Morgan" /></div><div className="field" style={{ marginTop: 15 }}><label htmlFor="email">Email</label><input id="email" name="email" type="email" required placeholder="you@example.com" /></div><div className="field" style={{ marginTop: 15 }}><label htmlFor="password">Password</label><input id="password" name="password" type="password" minLength="6" required placeholder="At least 6 characters" /></div><div className="field" style={{ marginTop: 15 }}><label htmlFor="confirmPassword">Confirm password</label><input id="confirmPassword" name="confirmPassword" type="password" minLength="6" required placeholder="Repeat your password" /></div>{error && <p className="field-error">{error}</p>}<button className="button button-block" style={{ marginTop: 22 }} disabled={saving}>{saving ? 'Creating account' : 'Create account'}</button><p className="auth-switch">Already a member? <Link to="/login">Sign in instead</Link></p></form></main>;
}
