'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, Question } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import '../../styles/admin-common.css';
import '../../styles/admin-questions.css';

export default function AdminQuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'answered' | 'pending'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAnswer, setEditAnswer] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    loadQuestions();
  }, [router]);

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

  const handleSaveAnswer = async (id: string) => {
    if (!editAnswer.trim()) { alert('Please enter an answer'); return; }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('questions')
        .update({ answer: editAnswer.trim(), answered: true, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await loadQuestions();
      setEditingId(null);
      setEditAnswer('');
      alert('Answer saved successfully!');
    } catch (error) {
      console.error('Error saving answer:', error);
      alert('Failed to save answer');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingId(question.id);
    setEditAnswer(question.answer || '');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const { error } = await supabase.from('questions').delete().eq('id', id);
      if (error) throw error;
      await loadQuestions();
      alert('Question deleted successfully!');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question');
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (filter === 'answered') return q.answered;
    if (filter === 'pending') return !q.answered;
    return true;
  });

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

      <div className="admin-page-wrapper">
        <div className="admin-page-container">

          {/* Header */}
          <div className="admin-header">
            <Link href="/admin" className="admin-back-link">← Back to Dashboard</Link>
            <h1 className="admin-page-title">Manage Questions</h1>
            <p className="admin-page-description">Answer student questions and manage Q&A content</p>
          </div>

          {/* Filters */}
          <div className="card admin-filter-bar">
            <div className="admin-filter-tabs">
              {(['all', 'answered', 'pending'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`btn-outline admin-filter-btn${filter === opt ? ' active' : ''}`}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)} ({
                    opt === 'all' ? questions.length :
                    opt === 'answered' ? questions.filter(q => q.answered).length :
                    questions.filter(q => !q.answered).length
                  })
                </button>
              ))}
            </div>
          </div>

          {/* Questions List */}
          {loading ? (
            <div className="card admin-state-card">
              <div className="admin-state-text">Loading questions...</div>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="card admin-state-card">
              <div className="admin-state-icon">📭</div>
              <div className="admin-state-text">No questions found</div>
            </div>
          ) : (
            <div className="admin-item-list">
              {filteredQuestions.map((question) => (
                <div key={question.id} className="card">
                  <div className="admin-item-header">
                    <div>
                      <div className="admin-item-author">{question.name}</div>
                      <div className="admin-item-date">
                        {formatDate(question.created_at)}
                        {question.email && ` • ${question.email}`}
                      </div>
                    </div>
                    <span className={`admin-status-badge ${question.answered ? 'answered' : 'pending'}`}>
                      {question.answered ? '✓ Answered' : '⏳ Pending'}
                    </span>
                  </div>

                  <div className="admin-question-text">{question.question}</div>

                  <div className="gold-line admin-question-divider"></div>

                  {editingId === question.id ? (
                    <div>
                      <label className="form-label">Your Answer</label>
                      <textarea
                        className="form-input"
                        value={editAnswer}
                        onChange={(e) => setEditAnswer(e.target.value)}
                        rows={4}
                        placeholder="Type your answer here..."
                      />
                      <div className="admin-edit-actions">
                        <button
                          onClick={() => handleSaveAnswer(question.id)}
                          className="btn-gold"
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Save Answer'}
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setEditAnswer(''); }}
                          className="btn-outline"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {question.answered && question.answer ? (
                        <div className="admin-answer-block">
                          <div className="admin-answer-block-label">Current Answer</div>
                          <div className="admin-answer-block-text">{question.answer}</div>
                        </div>
                      ) : (
                        <div className="admin-no-answer">No answer yet</div>
                      )}
                      <div className="admin-action-row">
                        <button onClick={() => handleEdit(question)} className="btn-gold">
                          {question.answered ? 'Edit Answer' : 'Add Answer'}
                        </button>
                        <button
                          onClick={() => handleDelete(question.id)}
                          className="btn-outline admin-delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
