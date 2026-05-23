'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, Question } from '@/lib/supabase';
import '../styles/all-questions.css';

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

    if (filter === 'answered') filtered = filtered.filter(q => q.answered);
    else if (filter === 'pending') filtered = filtered.filter(q => !q.answered);

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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel+Decorative:wght@700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/assets/styles.css" />
      <link rel="stylesheet" href="/assets/styles-tablet.css" />
      <link rel="stylesheet" href="/assets/styles-mobile.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-small.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-extra-small.css" />

      <div className="bg-canvas"></div>

      <div className="all-questions-wrapper">
        <Link href="/" className="all-questions-back-link">
          ← Back to Home
        </Link>

        <div className="card">
          <div className="all-questions-card-label">Community Q&A</div>
          <div className="all-questions-card-title">All Questions & Answers</div>
          <p className="all-questions-card-description">
            Browse through questions asked by fellow students and see the answers from our team.
          </p>
          <div className="gold-line"></div>

          {/* Search Bar */}
          <div className="all-questions-search">
            <span className="all-questions-search-icon">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions..."
              className="all-questions-search-input"
            />
          </div>

          {/* Filter Tabs */}
          <div className="all-questions-filters">
            {(['all', 'answered', 'pending'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`all-questions-filter-btn${filter === opt ? ' active' : ''}`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>

          {/* Questions List */}
          <div>
            {loading ? (
              <div className="all-questions-state">
                <div className="all-questions-state-icon">💬</div>
                <p>Loading questions...</p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="all-questions-state">
                <div className="all-questions-state-icon">💬</div>
                <p className="all-questions-state-title">No questions found</p>
                <p className="all-questions-state-message">Be the first to ask a question!</p>
              </div>
            ) : (
              filteredQuestions.map((q) => (
                <div key={q.id} className="all-questions-item">
                  <div className="all-questions-item-header">
                    <div className="all-questions-item-meta">
                      <span className="all-questions-item-author">{q.name}</span>
                      <span className="all-questions-item-date">{formatDate(q.created_at)}</span>
                    </div>
                    <span className={`all-questions-status-badge ${q.answered ? 'answered' : 'pending'}`}>
                      {q.answered ? '✓ Answered' : '⏳ Pending'}
                    </span>
                  </div>

                  <div className="all-questions-item-text">{q.question}</div>

                  {q.answered && q.answer && (
                    <div className="all-questions-answer-block">
                      <div className="all-questions-answer-label">Answer from Admin</div>
                      <div className="all-questions-answer-text">{q.answer}</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="gold-line"></div>
          <div className="all-questions-cta">
            <Link href="/questions" className="btn-gold all-questions-cta-btn">
              Ask Your Question →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
