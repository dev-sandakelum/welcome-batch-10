'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface TestResult {
  operation: string;
  table: string;
  status: 'success' | 'error';
  message: string;
}

export default function TestDatabasePage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (operation: string, table: string, status: 'success' | 'error', message: string) => {
    setResults(prev => [...prev, { operation, table, status, message }]);
  };

  const runAllTests = async () => {
    setResults([]);
    setTesting(true);

    try {
      // Test Questions Table
      await testQuestionsTable();
      
      // Test Quiz Scores Table
      await testQuizScoresTable();
      
      // Test Feedback Table
      await testFeedbackTable();

      addResult('COMPLETE', 'ALL', 'success', 'All database tests completed!');
    } catch (error) {
      addResult('ERROR', 'ALL', 'error', `Test suite failed: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  const testQuestionsTable = async () => {
    const testId = `test-${Date.now()}`;
    
    try {
      // INSERT
      const { data: insertData, error: insertError } = await supabase
        .from('questions')
        .insert([{
          name: 'Test User',
          email: 'test@example.com',
          question: 'Test question?',
          answered: false
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      addResult('INSERT', 'questions', 'success', `Created question with ID: ${insertData.id}`);

      const questionId = insertData.id;

      // SELECT
      const { data: selectData, error: selectError } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();

      if (selectError) throw selectError;
      addResult('SELECT', 'questions', 'success', `Retrieved question: ${selectData.question}`);

      // UPDATE
      const { error: updateError } = await supabase
        .from('questions')
        .update({
          answer: 'Test answer',
          answered: true
        })
        .eq('id', questionId);

      if (updateError) throw updateError;
      addResult('UPDATE', 'questions', 'success', 'Updated question with answer');

      // DELETE
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (deleteError) throw deleteError;
      addResult('DELETE', 'questions', 'success', 'Deleted test question');

    } catch (error: any) {
      addResult('ERROR', 'questions', 'error', error.message);
    }
  };

  const testQuizScoresTable = async () => {
    try {
      // INSERT
      const { data: insertData, error: insertError } = await supabase
        .from('quiz_scores')
        .insert([{
          player_name: 'Test Player',
          score: 5,
          total_questions: 5
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      addResult('INSERT', 'quiz_scores', 'success', `Created score with ID: ${insertData.id}`);

      const scoreId = insertData.id;

      // SELECT
      const { data: selectData, error: selectError } = await supabase
        .from('quiz_scores')
        .select('*')
        .eq('id', scoreId)
        .single();

      if (selectError) throw selectError;
      addResult('SELECT', 'quiz_scores', 'success', `Retrieved score: ${selectData.score}/${selectData.total_questions}`);

      // DELETE
      const { error: deleteError } = await supabase
        .from('quiz_scores')
        .delete()
        .eq('id', scoreId);

      if (deleteError) throw deleteError;
      addResult('DELETE', 'quiz_scores', 'success', 'Deleted test score');

    } catch (error: any) {
      addResult('ERROR', 'quiz_scores', 'error', error.message);
    }
  };

  const testFeedbackTable = async () => {
    try {
      // INSERT
      const { data: insertData, error: insertError } = await supabase
        .from('feedback')
        .insert([{
          name: 'Test User',
          email: 'test@example.com',
          rating: 5,
          feedback_text: 'Test feedback'
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      addResult('INSERT', 'feedback', 'success', `Created feedback with ID: ${insertData.id}`);

      const feedbackId = insertData.id;

      // SELECT
      const { data: selectData, error: selectError } = await supabase
        .from('feedback')
        .select('*')
        .eq('id', feedbackId)
        .single();

      if (selectError) throw selectError;
      addResult('SELECT', 'feedback', 'success', `Retrieved feedback: ${selectData.rating} stars`);

      // DELETE
      const { error: deleteError } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId);

      if (deleteError) throw deleteError;
      addResult('DELETE', 'feedback', 'success', 'Deleted test feedback');

    } catch (error: any) {
      addResult('ERROR', 'feedback', 'error', error.message);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel+Decorative:wght@700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/assets/styles.css" />

      <div className="bg-canvas"></div>

      <div style={{position: 'relative', zIndex: 1, minHeight: '100vh', padding: '40px 20px'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto'}}>
          {/* Header */}
          <div style={{marginBottom: '32px'}}>
            <Link href="/admin" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '20px', transition: 'all 0.3s'}}>
              ← Back to Dashboard
            </Link>
            
            <h1 style={{fontFamily: "'Cinzel Decorative', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '12px'}}>
              Database Test Suite
            </h1>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>
              Test all database operations (SELECT, INSERT, UPDATE, DELETE)
            </p>
          </div>

          {/* Test Button */}
          <div className="card" style={{padding: '24px', marginBottom: '24px', textAlign: 'center'}}>
            <button
              onClick={runAllTests}
              className="btn-gold"
              disabled={testing}
              style={{fontSize: '1rem', padding: '16px 48px'}}
            >
              {testing ? '🔄 Running Tests...' : '▶️ Run All Tests'}
            </button>
            <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '12px'}}>
              This will test INSERT, SELECT, UPDATE, and DELETE operations on all tables
            </p>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="card" style={{padding: '24px'}}>
              <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '20px'}}>
                Test Results
              </h2>

              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {results.map((result, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '16px',
                      background: result.status === 'success' ? 'rgba(61,220,132,0.1)' : 'rgba(255,107,107,0.1)',
                      border: `1px solid ${result.status === 'success' ? 'rgba(61,220,132,0.3)' : 'rgba(255,107,107,0.3)'}`,
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    <div style={{fontSize: '1.5rem'}}>
                      {result.status === 'success' ? '✅' : '❌'}
                    </div>
                    <div style={{flex: 1}}>
                      <div style={{display: 'flex', gap: '12px', marginBottom: '4px', flexWrap: 'wrap'}}>
                        <span style={{
                          padding: '2px 8px',
                          background: 'rgba(201,162,39,0.2)',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--accent-gold-light)'
                        }}>
                          {result.operation}
                        </span>
                        <span style={{
                          padding: '2px 8px',
                          background: 'rgba(0,180,216,0.2)',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--accent-teal-light)'
                        }}>
                          {result.table}
                        </span>
                      </div>
                      <div style={{fontSize: '0.9rem', color: 'var(--text-primary)'}}>
                        {result.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="gold-line" style={{margin: '24px 0'}}></div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '1.2rem', marginBottom: '8px'}}>
                  <span style={{color: '#3ddc84', fontWeight: 600}}>
                    {results.filter(r => r.status === 'success').length}
                  </span>
                  {' / '}
                  <span style={{color: 'var(--text-muted)'}}>
                    {results.length}
                  </span>
                  {' tests passed'}
                </div>
                {results.every(r => r.status === 'success') && (
                  <div style={{color: '#3ddc84', fontSize: '0.9rem'}}>
                    🎉 All database operations are working correctly!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="card" style={{padding: '24px', marginTop: '24px', background: 'rgba(0,180,216,0.08)', border: '1px solid rgba(0,180,216,0.3)'}}>
            <h3 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 600, color: 'var(--accent-teal-light)', marginBottom: '12px'}}>
              ℹ️ Important Notes
            </h3>
            <ul style={{color: 'var(--text-primary)', fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '20px'}}>
              <li>If UPDATE or DELETE operations fail, run <code style={{background: 'rgba(201,162,39,0.2)', padding: '2px 6px', borderRadius: '4px'}}>sql/update-policies.sql</code> in Supabase</li>
              <li>All test data is automatically cleaned up after testing</li>
              <li>Tests are safe to run multiple times</li>
              <li>Make sure your Supabase credentials are correct in <code style={{background: 'rgba(201,162,39,0.2)', padding: '2px 6px', borderRadius: '4px'}}>.env.local</code></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
