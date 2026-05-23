'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, Feedback } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export default function AdminFeedbackPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    // Check authentication
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
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{color: i < rating ? 'var(--accent-gold-light)' : 'rgba(201,162,39,0.25)', fontSize: '1.2rem'}}>
        ★
      </span>
    ));
  };

  const averageRating = feedback.length > 0
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : '0.0';

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedback.filter(f => f.rating === rating).length
  }));

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel+Decorative:wght@700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/assets/styles.css" />

      <div className="bg-canvas"></div>

      <div style={{position: 'relative', zIndex: 1, minHeight: '100vh', padding: '40px 20px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          {/* Header */}
          <div style={{marginBottom: '32px'}}>
            <Link href="/admin" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '20px', transition: 'all 0.3s'}}>
              ← Back to Dashboard
            </Link>
            
            <h1 style={{fontFamily: "'Cinzel Decorative', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '12px'}}>
              Feedback & Ratings
            </h1>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>
              View and manage user feedback
            </p>
          </div>

          {/* Stats */}
          <div className="card" style={{padding: '28px', marginBottom: '24px'}}>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', alignItems: 'center'}}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontFamily: "'Cinzel Decorative', serif", fontSize: '3rem', color: 'var(--accent-gold-light)', marginBottom: '8px'}}>
                  {averageRating}
                </div>
                <div style={{marginBottom: '8px'}}>{renderStars(Math.round(parseFloat(averageRating)))}</div>
                <div style={{fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)'}}>
                  Average Rating
                </div>
              </div>

              <div>
                {ratingCounts.map(({ rating, count }) => (
                  <div key={rating} style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                    <span style={{fontSize: '0.85rem', color: 'var(--text-primary)', minWidth: '60px'}}>
                      {rating} stars
                    </span>
                    <div style={{flex: 1, height: '8px', background: 'rgba(201,162,39,0.15)', borderRadius: '4px', overflow: 'hidden'}}>
                      <div style={{
                        height: '100%',
                        width: `${feedback.length > 0 ? (count / feedback.length) * 100 : 0}%`,
                        background: 'var(--accent-gold)',
                        transition: 'width 0.3s'
                      }}></div>
                    </div>
                    <span style={{fontSize: '0.85rem', color: 'var(--text-muted)', minWidth: '30px', textAlign: 'right'}}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card" style={{padding: '20px', marginBottom: '24px'}}>
            <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
              <button
                onClick={() => setRatingFilter('all')}
                className="btn-outline"
                style={{
                  padding: '10px 24px',
                  background: ratingFilter === 'all' ? 'rgba(201,162,39,0.2)' : 'transparent',
                  borderColor: ratingFilter === 'all' ? 'var(--accent-gold)' : 'rgba(245,240,232,0.35)',
                  color: ratingFilter === 'all' ? 'var(--accent-gold-light)' : 'var(--text-primary)'
                }}
              >
                All ({feedback.length})
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setRatingFilter(rating)}
                  className="btn-outline"
                  style={{
                    padding: '10px 24px',
                    background: ratingFilter === rating ? 'rgba(201,162,39,0.2)' : 'transparent',
                    borderColor: ratingFilter === rating ? 'var(--accent-gold)' : 'rgba(245,240,232,0.35)',
                    color: ratingFilter === rating ? 'var(--accent-gold-light)' : 'var(--text-primary)'
                  }}
                >
                  {rating} ★ ({feedback.filter(f => f.rating === rating).length})
                </button>
              ))}
            </div>
          </div>

          {/* Feedback List */}
          {loading ? (
            <div className="card" style={{padding: '60px', textAlign: 'center'}}>
              <div style={{color: 'var(--text-muted)'}}>Loading feedback...</div>
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="card" style={{padding: '60px', textAlign: 'center'}}>
              <div style={{fontSize: '3rem', marginBottom: '16px'}}>💌</div>
              <div style={{color: 'var(--text-muted)'}}>No feedback found</div>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              {filteredFeedback.map((item) => (
                <div key={item.id} className="card" style={{padding: '24px'}}>
                  {/* Header */}
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px'}}>
                    <div>
                      <div style={{fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '4px'}}>
                        {item.name}
                      </div>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>
                        {formatDate(item.created_at)}
                        {item.email && ` • ${item.email}`}
                      </div>
                    </div>
                    <div>{renderStars(item.rating)}</div>
                  </div>

                  {/* Feedback Text */}
                  <div style={{color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '16px'}}>
                    {item.feedback_text}
                  </div>

                  {/* Actions */}
                  <div className="gold-line" style={{margin: '16px 0'}}></div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn-outline"
                    style={{borderColor: '#ff6b6b', color: '#ff6b6b', width: '100%', justifyContent: 'center'}}
                  >
                    Delete Feedback
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
