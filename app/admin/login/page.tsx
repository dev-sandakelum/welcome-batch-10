'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth token in sessionStorage
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

      <div className="bg-canvas"></div>

      <div style={{position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px'}}>
        <div style={{maxWidth: '450px', width: '100%'}}>
          {/* Header */}
          <div style={{textAlign: 'center', marginBottom: '32px'}}>
            <div style={{fontSize: '3rem', marginBottom: '16px'}}>🔐</div>
            <h1 style={{fontFamily: "'Cinzel Decorative', serif", fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '8px'}}>
              Admin Login
            </h1>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>
              Enter your credentials to access the admin panel
            </p>
          </div>

          {/* Login Form */}
          <div className="card" style={{padding: '32px'}}>
            <form onSubmit={handleLogin}>
              {error && (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(255,107,107,0.15)',
                  border: '1px solid rgba(255,107,107,0.4)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ff6b6b',
                  fontSize: '0.85rem',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
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
                className="btn-gold"
                style={{width: '100%', justifyContent: 'center', marginTop: '8px'}}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login →'}
              </button>
            </form>

            <div className="gold-line" style={{margin: '24px 0'}}></div>

            <div style={{textAlign: 'center'}}>
              <Link href="/" style={{color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.85rem', transition: 'all 0.3s'}}>
                ← Back to Home
              </Link>
            </div>
          </div>

          {/* Security Note */}
          <div style={{textAlign: 'center', marginTop: '24px', padding: '16px', background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 'var(--radius-sm)'}}>
            <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6}}>
              🔒 This is a secure admin area. Only authorized personnel should access this page.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
