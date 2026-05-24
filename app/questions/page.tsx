'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import '../styles/questions.css';

export default function QuestionsPage() {
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
      <link rel="stylesheet" href="/assets/styles-tablet.css" />
      <link rel="stylesheet" href="/assets/styles-mobile.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-small.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-extra-small.css" />

      <div className="bg-canvas"></div>

      <div className="questions-page-wrapper">
        <div className="questions-page-content">
          <Link href="/" className="questions-back-link">
            ← Back to Home
          </Link>

          <div className="card">
            <div className="questions-card-label">Need Help?</div>
            <div className="questions-card-title">Ask Your Question</div>
            <p className="questions-card-description">
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

                <button
                  type="submit"
                  className="btn-gold questions-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Question ✉️'}
                </button>
              </form>
            ) : (
              <div className="questions-success">
                <div className="questions-success-icon">✓</div>
                <div className="questions-success-title">Question Submitted!</div>
                <p className="questions-success-message">
                  Thank you! We'll get back to you soon.
                </p>
                <Link href="/" className="btn-gold questions-success-btn">
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
