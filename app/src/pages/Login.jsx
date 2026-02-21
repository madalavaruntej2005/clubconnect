// pages/Login.jsx — Firebase Email + Google Sign In
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import './Auth.css';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, form.email, form.password);
            navigate('/');
        } catch (err) {
            setError(err.code === 'auth/invalid-credential'
                ? 'Invalid email or password.'
                : err.message);
        }
        setLoading(false);
    };

    const handleGoogle = async () => {
        try {
            await signInWithPopup(auth, provider);
            navigate('/');
        } catch (err) { setError(err.message); }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">ClubConnect</div>
                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-sub">Sign in to your account</p>

                {error && <p className="auth-error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input className="form-input" type="email" required
                            placeholder="you@college.edu"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input className="form-input" type="password" required
                            placeholder="••••••••"
                            value={form.password}
                            onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                    </div>
                    <button type="submit" className="btn-primary auth-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-divider"><span>or</span></div>

                <button className="auth-google-btn" onClick={handleGoogle}>
                    <svg width="18" height="18" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.5 0 6.3 1.4 8.4 3.5l6.3-6.3C34.7 3.2 29.7 1 24 1 14.8 1 7 6.7 3.7 14.7l7.3 5.7C12.8 14.5 17.9 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.9 24.5c0-1.5-.1-2.9-.4-4.3H24v8.2h12.9c-.6 3.2-2.4 5.8-5 7.4l7.7 6C43.5 37.7 46.9 31.6 46.9 24.5z" />
                        <path fill="#FBBC05" d="M10.9 28.6C10.3 27 10 25.3 10 23.5c0-1.8.3-3.5.9-5.1L3.6 12.7C1.3 17 0 21.6 0 26.5c0 4.9 1.3 9.5 3.6 13.5L10.9 28.6z" />
                        <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.7l-7.7-6c-2.1 1.4-4.8 2.3-8.3 2.3-6.1 0-11.2-4.1-13-9.6l-7.2 5.6C7 43.3 14.8 48 24 48z" />
                    </svg>
                    Continue with Google
                </button>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
