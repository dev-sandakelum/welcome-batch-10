'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import '../../styles/admin-common.css';
import '../../styles/admin-test-db.css';
import PageShell from '@/app/components/PageShell';

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
      await testQuestionsTable();
      await testQuizScoresTable();
      await testFeedbackTable();
      addResult('COMPLETE', 'ALL', 'success', 'All database tests completed!');
    } catch (error) {
      addResult('ERROR', 'ALL', 'error', `Test suite failed: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  const testQuestionsTable = async () => {
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('questions')
        .insert([{ name: 'Test User', email: 'test@example.com', question: 'Test question?', answered: false }])
        .select().single();
      if (insertError) throw insertError;
      addResult('INSERT', 'questions', 'success', `Created question with ID: ${insertData.id}`);

      const { data: selectData, error: selectError } = await supabase
        .from('questions').select('*').eq('id', insertData.id).single();
      if (selectError) throw selectError;
      addResult('SELECT', 'questions', 'success', `Retrieved question: ${selectData.question}`);

      const { error: updateError } = await supabase
        .from('questions').update({ answer: 'Test answer', answered: true }).eq('id', insertData.id);
      if (updateError) throw updateError;
      addResult('UPDATE', 'questions', 'success', 'Updated question with answer');

      const { error: deleteError } = await supabase.from('questions').delete().eq('id', insertData.id);
      if (deleteError) throw deleteError;
      addResult('DELETE', 'questions', 'success', 'Deleted test question');
    } catch (error: any) {
      addResult('ERROR', 'questions', 'error', error.message);
    }
  };

  const testQuizScoresTable = async () => {
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('quiz_scores')
        .insert([{ player_name: 'Test Player', score: 5, total_questions: 5 }])
        .select().single();
      if (insertError) throw insertError;
      addResult('INSERT', 'quiz_scores', 'success', `Created score with ID: ${insertData.id}`);

      const { data: selectData, error: selectError } = await supabase
        .from('quiz_scores').select('*').eq('id', insertData.id).single();
      if (selectError) throw selectError;
      addResult('SELECT', 'quiz_scores', 'success', `Retrieved score: ${selectData.score}/${selectData.total_questions}`);

      const { error: deleteError } = await supabase.from('quiz_scores').delete().eq('id', insertData.id);
      if (deleteError) throw deleteError;
      addResult('DELETE', 'quiz_scores', 'success', 'Deleted test score');
    } catch (error: any) {
      addResult('ERROR', 'quiz_scores', 'error', error.message);
    }
  };

  const testFeedbackTable = async () => {
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('feedback')
        .insert([{ name: 'Test User', email: 'test@example.com', rating: 5, feedback_text: 'Test feedback' }])
        .select().single();
      if (insertError) throw insertError;
      addResult('INSERT', 'feedback', 'success', `Created feedback with ID: ${insertData.id}`);

      const { data: selectData, error: selectError } = await supabase
        .from('feedback').select('*').eq('id', insertData.id).single();
      if (selectError) throw selectError;
      addResult('SELECT', 'feedback', 'success', `Retrieved feedback: ${selectData.rating} stars`);

      const { error: deleteError } = await supabase.from('feedback').delete().eq('id', insertData.id);
      if (deleteError) throw deleteError;
      addResult('DELETE', 'feedback', 'success', 'Deleted test feedback');
    } catch (error: any) {
      addResult('ERROR', 'feedback', 'error', error.message);
    }
  };

  return (
    <>
      <link rel="stylesheet" href="/assets/styles.css" />
      <link rel="stylesheet" href="/assets/styles-tablet.css" />
      <link rel="stylesheet" href="/assets/styles-mobile.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-small.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-extra-small.css" />

      <PageShell>

      <div className="admin-page-wrapper">
        <div className="admin-page-container-sm">

          {/* Header */}
          <div className="admin-header">
            <Link href="/admin" className="admin-back-link">← Back to Dashboard</Link>
            <h1 className="admin-page-title">Database Test Suite</h1>
            <p className="admin-page-description">
              Test all database operations (SELECT, INSERT, UPDATE, DELETE)
            </p>
          </div>

          {/* Run Button */}
          <div className="card admin-test-run-card">
            <button
              onClick={runAllTests}
              className="btn-gold admin-test-run-btn"
              disabled={testing}
            >
              {testing ? '🔄 Running Tests...' : '▶️ Run All Tests'}
            </button>
            <p className="admin-test-run-description">
              This will test INSERT, SELECT, UPDATE, and DELETE operations on all tables
            </p>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="card admin-test-results-card">
              <h2 className="admin-test-results-title">Test Results</h2>

              <div className="admin-test-results-list">
                {results.map((result, index) => (
                  <div key={index} className={`admin-test-result-row ${result.status}`}>
                    <div className="admin-test-result-icon">
                      {result.status === 'success' ? '✅' : '❌'}
                    </div>
                    <div className="admin-test-result-body">
                      <div className="admin-test-result-badges">
                        <span className="admin-test-badge operation">{result.operation}</span>
                        <span className="admin-test-badge table">{result.table}</span>
                      </div>
                      <div className="admin-test-result-message">{result.message}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="gold-line admin-test-summary-divider"></div>
              <div className="admin-test-summary">
                <div className="admin-test-summary-line">
                  <span className="admin-test-summary-passed">
                    {results.filter(r => r.status === 'success').length}
                  </span>
                  {' / '}
                  <span className="admin-test-summary-total">{results.length}</span>
                  {' tests passed'}
                </div>
                {results.every(r => r.status === 'success') && (
                  <div className="admin-test-summary-all-pass">
                    🎉 All database operations are working correctly!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="card admin-test-instructions-card">
            <h3 className="admin-test-instructions-title">ℹ️ Important Notes</h3>
            <ul className="admin-test-instructions-list">
              <li>If UPDATE or DELETE operations fail, run <code className="admin-test-code">sql/update-policies.sql</code> in Supabase</li>
              <li>All test data is automatically cleaned up after testing</li>
              <li>Tests are safe to run multiple times</li>
              <li>Make sure your Supabase credentials are correct in <code className="admin-test-code">.env.local</code></li>
            </ul>
          </div>

        </div>
      </div>
      </PageShell>
    </>
  );
}
