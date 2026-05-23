'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function QuestionsPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !question.trim()) {
      alert('Please fill in all required fields!');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('questions')
        .insert([
          {
            name: name.trim(),
            email: email.trim() || null,
            question: question.trim(),
            answered: false
          }
        ]);

      if (error) throw error;

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Failed to submit question. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel+Decorative:wght@700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/assets/styles.css" />

      <div className="bg-canvas"></div>

      <div style={{position: 'relative', zIndex: 1, maxWidth: '700px', width: '100%', margin: '0 auto', padding: '40px 20px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: '100%'}}>
          <Link href="/" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '20px', transition: 'all 0.3s'}}>
            ← Back to Home
          </Link>
          
          <div className="card">
            <div style={{fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-teal-light)', opacity: 0.8}}>Need Help?</div>
            <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '10px'}}>Ask Your Question</div>
            <p style={{color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '12px', lineHeight: 1.7}}>
              Have a question that's not in our FAQ? Ask away! Our seniors and admin team will get back to you soon.
            </p>
            <div className="gold-line"></div>

            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email (Optional)</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Question</label>
                  <textarea
                    className="form-input"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type your question here..."
                    required
                  />
                </div>

                <button type="submit" className="btn-gold" style={{width: '100%', justifyContent: 'center'}} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Question ✉️'}
                </button>
              </form>
            ) : (
              <div style={{textAlign: 'center', padding: '24px'}}>
                <div style={{fontSize: '3rem', marginBottom: '12px'}}>✓</div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '10px'}}>Question Submitted!</div>
                <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px'}}>
                  Thank you! We'll get back to you soon.
                </p>
                <Link href="/" className="btn-gold" style={{width: '100%', justifyContent: 'center'}}>
                  Back to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
