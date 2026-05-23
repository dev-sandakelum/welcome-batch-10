'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../styles/admin-login.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('adminAuth', data.token);
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel+Decorative:wght@700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/assets/styles.css" />
      <link rel="stylesheet" href="/assets/styles-tablet.css" />
      <link rel="stylesheet" href="/assets/styles-mobile.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-small.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-extra-small.css" />

      <div className="bg-canvas"></div>

      <div className="admin-login-wrapper">
        <div className="admin-login-container">
          <div className="admin-login-header">
            <div className="admin-login-icon">🔐</div>
            <h1 className="admin-login-title">Admin Login</h1>
            <p className="admin-login-description">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <div className="card admin-login-card">
            <form onSubmit={handleLogin}>
              {error && (
                <div className="admin-login-error">{error}</div>
              )}

              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn-gold admin-login-submit-btn"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login →'}
              </button>
            </form>

            <div className="gold-line admin-login-divider"></div>

            <div className="admin-login-back">
              <Link href="/" className="admin-login-back-link">
                ← Back to Home
              </Link>
            </div>
          </div>

          <div className="admin-login-security">
            <div className="admin-login-security-text">
              🔒 This is a secure admin area. Only authorized personnel should access this page.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
