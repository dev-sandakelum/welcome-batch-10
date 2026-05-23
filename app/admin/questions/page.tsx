'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, Question } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export default function AdminQuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'answered' | 'pending'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAnswer, setEditAnswer] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Check authentication
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
    if (!editAnswer.trim()) {
      alert('Please enter an answer');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('questions')
        .update({
          answer: editAnswer.trim(),
          answered: true,
          updated_at: new Date().toISOString()
        })
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
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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

      <div style={{position: 'relative', zIndex: 1, minHeight: '100vh', padding: '40px 20px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          {/* Header */}
          <div style={{marginBottom: '32px'}}>
            <Link href="/admin" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '20px', transition: 'all 0.3s'}}>
              ← Back to Dashboard
            </Link>
            
            <h1 style={{fontFamily: "'Cinzel Decorative', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '12px'}}>
              Manage Questions
            </h1>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>
              Answer student questions and manage Q&A content
            </p>
          </div>

          {/* Filters */}
          <div className="card" style={{padding: '20px', marginBottom: '24px'}}>
            <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
              {(['all', 'answered', 'pending'] as const).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className="btn-outline"
                  style={{
                    padding: '10px 24px',
                    background: filter === filterOption ? 'rgba(201,162,39,0.2)' : 'transparent',
                    borderColor: filter === filterOption ? 'var(--accent-gold)' : 'rgba(245,240,232,0.35)',
                    color: filter === filterOption ? 'var(--accent-gold-light)' : 'var(--text-primary)'
                  }}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)} ({
                    filterOption === 'all' ? questions.length :
                    filterOption === 'answered' ? questions.filter(q => q.answered).length :
                    questions.filter(q => !q.answered).length
                  })
                </button>
              ))}
            </div>
          </div>

          {/* Questions List */}
          {loading ? (
            <div className="card" style={{padding: '60px', textAlign: 'center'}}>
              <div style={{color: 'var(--text-muted)'}}>Loading questions...</div>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="card" style={{padding: '60px', textAlign: 'center'}}>
              <div style={{fontSize: '3rem', marginBottom: '16px'}}>📭</div>
              <div style={{color: 'var(--text-muted)'}}>No questions found</div>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              {filteredQuestions.map((question) => (
                <div key={question.id} className="card" style={{padding: '24px'}}>
                  {/* Question Header */}
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px'}}>
                    <div>
                      <div style={{fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '4px'}}>
                        {question.name}
                      </div>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>
                        {formatDate(question.created_at)}
                        {question.email && ` • ${question.email}`}
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '50px',
                      fontSize: '0.7rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      background: question.answered ? 'rgba(61,220,132,0.15)' : 'rgba(255,193,7,0.15)',
                      border: `1px solid ${question.answered ? 'rgba(61,220,132,0.4)' : 'rgba(255,193,7,0.4)'}`,
                      color: question.answered ? '#3ddc84' : '#ffc107'
                    }}>
                      {question.answered ? '✓ Answered' : '⏳ Pending'}
                    </span>
                  </div>

                  {/* Question Text */}
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.5}}>
                    {question.question}
                  </div>

                  <div className="gold-line" style={{margin: '16px 0'}}></div>

                  {/* Answer Section */}
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
                      <div style={{display: 'flex', gap: '12px', marginTop: '12px'}}>
                        <button
                          onClick={() => handleSaveAnswer(question.id)}
                          className="btn-gold"
                          disabled={saving}
                          style={{flex: 1}}
                        >
                          {saving ? 'Saving...' : 'Save Answer'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditAnswer('');
                          }}
                          className="btn-outline"
                          style={{flex: 1}}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {question.answered && question.answer ? (
                        <div style={{background: 'rgba(0,180,216,0.08)', borderLeft: '3px solid var(--accent-teal)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '12px'}}>
                          <div style={{fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-teal-light)', marginBottom: '8px', fontWeight: 600}}>
                            Current Answer
                          </div>
                          <div style={{color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.7}}>
                            {question.answer}
                          </div>
                        </div>
                      ) : (
                        <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '12px'}}>
                          No answer yet
                        </div>
                      )}
                      
                      <div style={{display: 'flex', gap: '12px'}}>
                        <button
                          onClick={() => handleEdit(question)}
                          className="btn-gold"
                          style={{flex: 1}}
                        >
                          {question.answered ? 'Edit Answer' : 'Add Answer'}
                        </button>
                        <button
                          onClick={() => handleDelete(question.id)}
                          className="btn-outline"
                          style={{flex: 1, borderColor: '#ff6b6b', color: '#ff6b6b'}}
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
