'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, Feedback } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import '../../styles/admin-common.css';
import '../../styles/admin-feedback.css';
import PageShell from '@/app/components/PageShell';

export default function AdminFeedbackPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    loadFeedback();
  }, [router]);

  const loadFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    try {
      const { error } = await supabase.from('feedback').delete().eq('id', id);
      if (error) throw error;
      await loadFeedback();
      alert('Feedback deleted successfully!');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback');
    }
  };

  const filteredFeedback = ratingFilter === 'all'
    ? feedback
    : feedback.filter(f => f.rating === ratingFilter);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`admin-star ${i < rating ? 'filled' : 'empty'}`}>★</span>
    ));

  const averageRating = feedback.length > 0
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : '0.0';

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedback.filter(f => f.rating === rating).length
  }));

  return (
    <>
      <link rel="stylesheet" href="/assets/styles.css" />
      <link rel="stylesheet" href="/assets/styles-tablet.css" />
      <link rel="stylesheet" href="/assets/styles-mobile.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-small.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-extra-small.css" />

      <PageShell>

      <div className="admin-page-wrapper">
        <div className="admin-page-container">

          {/* Header */}
          <div className="admin-header">
            <Link href="/admin" className="admin-back-link">← Back to Dashboard</Link>
            <h1 className="admin-page-title">Feedback & Ratings</h1>
            <p className="admin-page-description">View and manage user feedback</p>
          </div>

          {/* Stats */}
          <div className="card admin-feedback-stats-card">
            <div className="admin-feedback-stats-grid">
              <div className="admin-feedback-avg">
                <div className="admin-feedback-avg-value">{averageRating}</div>
                <div className="admin-feedback-avg-stars">
                  {renderStars(Math.round(parseFloat(averageRating)))}
                </div>
                <div className="admin-feedback-avg-label">Average Rating</div>
              </div>

              <div>
                {ratingCounts.map(({ rating, count }) => (
                  <div key={rating} className="admin-feedback-breakdown-row">
                    <span className="admin-feedback-breakdown-label">{rating} stars</span>
                    <div className="admin-feedback-bar-track">
                      <div
                        className="admin-feedback-bar-fill"
                        style={{ width: `${feedback.length > 0 ? (count / feedback.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="admin-feedback-breakdown-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card admin-filter-bar">
            <div className="admin-filter-tabs">
              <button
                onClick={() => setRatingFilter('all')}
                className={`btn-outline admin-filter-btn${ratingFilter === 'all' ? ' active' : ''}`}
              >
                All ({feedback.length})
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setRatingFilter(rating)}
                  className={`btn-outline admin-filter-btn${ratingFilter === rating ? ' active' : ''}`}
                >
                  {rating} ★ ({feedback.filter(f => f.rating === rating).length})
                </button>
              ))}
            </div>
          </div>

          {/* Feedback List */}
          {loading ? (
            <div className="card admin-state-card">
              <div className="admin-state-text">Loading feedback...</div>
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="card admin-state-card">
              <div className="admin-state-icon">💌</div>
              <div className="admin-state-text">No feedback found</div>
            </div>
          ) : (
            <div className="admin-item-list">
              {filteredFeedback.map((item) => (
                <div key={item.id} className="card admin-feedback-item-card">
                  <div className="admin-item-header">
                    <div>
                      <div className="admin-item-author">{item.name}</div>
                      <div className="admin-item-date">
                        {formatDate(item.created_at)}
                        {item.email && ` • ${item.email}`}
                      </div>
                    </div>
                    <div>{renderStars(item.rating)}</div>
                  </div>

                  <div className="admin-feedback-item-text">{item.feedback_text}</div>

                  <div className="gold-line admin-feedback-divider"></div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn-outline admin-feedback-delete-btn"
                  >
                    Delete Feedback
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      </PageShell>
    </>
  );
}
