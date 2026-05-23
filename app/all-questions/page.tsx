'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, Question } from '@/lib/supabase';

export default function AllQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'answered' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [questions, filter, searchTerm]);

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setQuestions(data || []);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...questions];

    // Apply status filter
    if (filter === 'answered') {
      filtered = filtered.filter(q => q.answered);
    } else if (filter === 'pending') {
      filtered = filtered.filter(q => !q.answered);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(q =>
        q.question.toLowerCase().includes(term) ||
        q.name.toLowerCase().includes(term) ||
        (q.answer && q.answer.toLowerCase().includes(term))
      );
    }

    setFilteredQuestions(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel+Decorative:wght@700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/assets/styles.css" />

      <div className="bg-canvas"></div>

      <div style={{position: 'relative', zIndex: 1, maxWidth: '900px', width: '100%', margin: '0 auto', padding: '40px 20px', minHeight: '100vh'}}>
        <Link href="/" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '20px', transition: 'all 0.3s'}}>
          ← Back to Home
        </Link>
        
        <div className="card">
          <div style={{fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-teal-light)', opacity: 0.8}}>Community Q&A</div>
          <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '10px'}}>All Questions & Answers</div>
          <p style={{color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '12px', lineHeight: 1.7}}>
            Browse through questions asked by fellow students and see the answers from our team.
          </p>
          <div className="gold-line"></div>

          {/* Search Bar */}
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(20,8,60,0.7)', border: '1px solid rgba(201,162,39,0.25)', borderRadius: '50px', padding: '12px 24px', marginBottom: '20px'}}>
            <span style={{color: 'var(--accent-gold)', fontSize: '1.1rem'}}>🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions..."
              style={{flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.9rem'}}
            />
          </div>

          {/* Filter Tabs */}
          <div style={{display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap'}}>
            {(['all', 'answered', 'pending'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                style={{
                  padding: '10px 20px',
                  background: filter === filterOption ? 'rgba(201,162,39,0.2)' : 'rgba(20,8,60,0.65)',
                  border: `1px solid ${filter === filterOption ? 'var(--accent-gold)' : 'rgba(201,162,39,0.25)'}`,
                  borderRadius: '50px',
                  color: filter === filterOption ? 'var(--accent-gold-light)' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>

          {/* Questions List */}
          <div>
            {loading ? (
              <div style={{textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)'}}>
                <div style={{fontSize: '4rem', marginBottom: '16px', opacity: 0.5}}>💬</div>
                <p>Loading questions...</p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div style={{textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)'}}>
                <div style={{fontSize: '4rem', marginBottom: '16px', opacity: 0.5}}>💬</div>
                <p style={{fontSize: '1.1rem', marginBottom: '8px'}}>No questions found</p>
                <p style={{fontSize: '0.85rem'}}>Be the first to ask a question!</p>
              </div>
            ) : (
              filteredQuestions.map((q) => (
                <div
                  key={q.id}
                  style={{
                    background: 'rgba(20,8,60,0.4)',
                    border: '1px solid rgba(201,162,39,0.2)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '24px',
                    marginBottom: '16px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-gold)';
                    e.currentTarget.style.background = 'rgba(201,162,39,0.06)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201,162,39,0.2)';
                    e.currentTarget.style.background = 'rgba(20,8,60,0.4)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px', flexWrap: 'wrap'}}>
                    <div style={{display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap'}}>
                      <span style={{fontWeight: 600, color: 'var(--accent-gold-light)', fontSize: '0.9rem'}}>
                        {q.name}
                      </span>
                      <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>
                        {formatDate(q.created_at)}
                      </span>
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '50px',
                        fontSize: '0.7rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        background: q.answered ? 'rgba(61,220,132,0.15)' : 'rgba(255,193,7,0.15)',
                        border: `1px solid ${q.answered ? 'rgba(61,220,132,0.4)' : 'rgba(255,193,7,0.4)'}`,
                        color: q.answered ? '#3ddc84' : '#ffc107'
                      }}
                    >
                      {q.answered ? '✓ Answered' : '⏳ Pending'}
                    </span>
                  </div>

                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1.5}}>
                    {q.question}
                  </div>

                  {q.answered && q.answer && (
                    <div style={{background: 'rgba(0,180,216,0.08)', borderLeft: '3px solid var(--accent-teal)', padding: '16px', borderRadius: 'var(--radius-sm)', marginTop: '12px'}}>
                      <div style={{fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-teal-light)', marginBottom: '8px', fontWeight: 600}}>
                        Answer from Admin
                      </div>
                      <div style={{color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.7}}>
                        {q.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="gold-line"></div>
          <div style={{textAlign: 'center'}}>
            <Link href="/questions" className="btn-gold" style={{width: '100%', justifyContent: 'center'}}>
              Ask Your Question →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
