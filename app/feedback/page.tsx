'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  initAuroraParticles,
  initMagneticCards,
  initGlassShimmer,
} from '@/lib/gsap-animations';
import '../styles/feedback.css';

export default function FeedbackPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    initAuroraParticles();
    initMagneticCards();
    initGlassShimmer();
  }, []);

  const handleSetRating = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !feedbackText.trim() || rating === 0) {
      alert('Please fill in all required fields and rate your experience!');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            name: name.trim(),
            email: email.trim() || null,
            rating: rating,
            feedback_text: feedbackText.trim()
          }
        ]);

      if (error) throw error;

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Aurora particle canvas — sits above bg, below content */}
      {/* <canvas id="aurora-canvas" aria-hidden="true" /> */}

      {/* Background image layer */}
      <div className="bg-canvas">
        
      </div>

      <div className="feedback-page-wrapper">
        <div className="feedback-page-content">
          <Link href="/" className="feedback-back-link">
            ← Back to Home
          </Link>

          <div className="card">
            <div className="feedback-card-label">We Value Your Opinion</div>
            <div className="feedback-card-title">Share Your Feedback</div>
            <p className="feedback-card-description">
              Help us improve! Share your thoughts about the welcome experience.
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
                  <label className="form-label">Rate Your Experience</label>
                  <div className="star-rating-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star-rating-item${star <= rating ? ' active' : ''}`}
                        onClick={() => handleSetRating(star)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = star <= rating ? 'scale(1.15)' : 'scale(1)';
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Feedback</label>
                  <textarea
                    className="form-input"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what you think..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gold feedback-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback 💌'}
                </button>
              </form>
            ) : (
              <div className="feedback-success">
                <div className="feedback-success-icon">✓</div>
                <div className="feedback-success-title">Thank You!</div>
                <p className="feedback-success-message">
                  Your feedback has been submitted successfully.
                </p>
                <Link href="/" className="btn-gold feedback-success-btn">
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
