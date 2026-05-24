'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  initAuroraParticles,
  initMagneticCards,
  initGlassShimmer,
} from '@/lib/gsap-animations';
import PageShell from '@/app/components/PageShell';
import '../styles/questions.css';

export default function QuestionsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    initAuroraParticles();
    initMagneticCards();
    initGlassShimmer();
  }, []);

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
      <PageShell>
      <div className="questions-page-wrapper">
        <div className="questions-page-content">
          <Link href="/" className="questions-back-link">
            ← Back to Home
          </Link>

          <div className="card">
            <div className="questions-card-label">Ask From Seniors</div>
            <div className="questions-card-title">Got a Question for the Seniors?</div>
            <p className="questions-card-description">
              Curious about college life, academics, or anything in between? Drop your question here and our seniors will share their experience and advice with you.
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
                    placeholder="Enter your full name"
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
                  <label className="form-label">Your Question for the Seniors</label>
                  <textarea
                    className="form-input"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What would you like to ask the seniors? (e.g. tips for first year, how to manage studies, club recommendations...)"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gold questions-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Ask the Seniors ✉️'}
                </button>
              </form>
            ) : (
              <div className="questions-success">
                <div className="questions-success-icon">✓</div>
                <div className="questions-success-title">Question Sent to Seniors!</div>
                <p className="questions-success-message">
                  Thanks for reaching out! A senior will answer your question soon.
                </p>
                <Link href="/" className="btn-gold questions-success-btn">
                  Back to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      </PageShell>
    </>
  );
}
