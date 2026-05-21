import React, { useState } from 'react';
import { useDB } from './DBContext';
import { Question } from '../types';
import { 
  Lock, LayoutDashboard, ListPlus, 
  Trash2, Edit3, CircleDot,
  Trophy, MessageSquare, Star, LogOut, ArrowLeft,
  RefreshCw, Layers
} from 'lucide-react';

interface AdminPanelProps {
  onNavigate: (route: string) => void;
  initialSubRoute?: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate, initialSubRoute }) => {
  const { 
    questions, scores, feedbacks, userQuestions,
    addQuestion, updateQuestion, deleteQuestion,
    deleteScore, deleteFeedback, answerUserQuestion, deleteUserQuestion
  } = useDB();

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('peacock_admin_logged') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active workspace tabs
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (initialSubRoute === 'questions') return 'questions';
    if (initialSubRoute === 'scores') return 'scores';
    if (initialSubRoute === 'feedback') return 'feedback';
    if (initialSubRoute === 'user-questions') return 'user-questions';
    return 'dashboard';
  });

  // State managers for CRUD Questions
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [qText, setQText] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrect, setQCorrect] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [qCategory, setQCategory] = useState('');
  const [qOrder, setQOrder] = useState<number>(1);
  const [questionError, setQuestionError] = useState('');

  // State managers for Answering questions
  const [activeAnswerId, setActiveAnswerId] = useState<string | null>(null);
  const [adminAnswerText, setAdminAnswerText] = useState('');
  const [answerError, setAnswerError] = useState('');

  // Handle Login Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (username === 'Admin_1234' && password === 'admin3') {
      setIsAuthenticated(true);
      localStorage.setItem('peacock_admin_logged', 'true');
    } else {
      setLoginError('Invalid Username or Password. Please check the credentials and try again.');
    }
  };

  // Handle Logout flow
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('peacock_admin_logged');
    setUsername('');
    setPassword('');
  };

  // CRUD Question Submission or Edit
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setQuestionError('');

    if (!qText.trim() || !qOptA.trim() || !qOptB.trim() || !qOptC.trim() || !qOptD.trim()) {
      setQuestionError('All question text and multiple-choice options are required.');
      return;
    }

    const questionPayload = {
      text: qText,
      optionA: qOptA,
      optionB: qOptB,
      optionC: qOptC,
      optionD: qOptD,
      correctAnswer: qCorrect,
      category: qCategory || 'General',
      displayOrder: qOrder || 1
    };

    if (editingQuestionId) {
      updateQuestion(editingQuestionId, {
        id: editingQuestionId,
        ...questionPayload
      });
    } else {
      addQuestion(questionPayload);
    }

    resetQuestionForm();
  };

  const resetQuestionForm = () => {
    setIsEditingQuestion(false);
    setEditingQuestionId(null);
    setQText('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQCorrect('A');
    setQCategory('');
    setQOrder(questions.length + 1);
    setQuestionError('');
  };

  const triggerEditQuestion = (q: Question) => {
    setEditingQuestionId(q.id);
    setQText(q.text);
    setQOptA(q.optionA);
    setQOptB(q.optionB);
    setQOptC(q.optionC);
    setQOptD(q.optionD);
    setQCorrect(q.correctAnswer);
    setQCategory(q.category);
    setQOrder(q.displayOrder);
    setIsEditingQuestion(true);
  };

  // Answer Submission flow
  const handleSaveAnswer = (uqId: string) => {
    setAnswerError('');
    if (!adminAnswerText.trim() || adminAnswerText.length < 5) {
      setAnswerError('Official senior answer must be at least 5 characters.');
      return;
    }

    answerUserQuestion(uqId, adminAnswerText);
    setAdminAnswerText('');
    setActiveAnswerId(null);
  };

  // Stats aggregate calculations
  const totalSubmissions = scores.length;
  const averageScorePercent = Math.round(
    scores.reduce((acc, curr) => acc + curr.percentage, 0) / (scores.length || 1)
  );
  const highestScoreObj = scores.reduce((max, curr) => curr.percentage > max ? curr.percentage : max, 0);

  // Filter lists
  const sortedQuestions = [...questions].sort((a, b) => a.displayOrder - b.displayOrder);

  /* LOGIN VIEW (IF NOT AUTHENTICATED) */
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 animate-fade-in text-slate-800">
        <div className="flex justify-start mb-6">
          <button 
            onClick={() => onNavigate('#/')}
            className="flex items-center gap-1.5 text-xs text-amber-600 font-bold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>
        </div>

        <div className="bg-white border-1.5 border-black rounded-[24px] p-8 relative overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex p-3.5 bg-slate-50 border border-slate-200 rounded-full text-slate-800">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif text-slate-950 font-bold leading-tight">Admin Portal Access</h2>
            <p className="text-xs text-slate-500">Provide admin credentials below to manage questions &amp; review feedback.</p>
          </div>

          {loginError && (
            <p className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-mono mb-4">
              ⚠️ {loginError}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-[10px] uppercase tracking-widest text-slate-600 font-bold block mb-1">
                Username
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-white border-1.5 border-black text-sm text-slate-800 placeholder-slate-400 font-medium rounded-xl focus:ring-0"
                placeholder="e.g. Admin_1234"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[10px] uppercase tracking-widest text-slate-600 font-bold block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 bg-white border-1.5 border-black text-sm text-slate-800 placeholder-slate-400 font-medium rounded-xl focus:ring-0"
                placeholder="Secret administration password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="p-4 bg-[#fffdf5] border-1.5 border-amber-200 rounded-xl text-xs text-slate-600 leading-relaxed text-left">
              💡 <strong>Development Credentials:</strong> <br />
              Username: <span className="text-slate-800 font-bold select-all font-mono">Admin_1234</span> <br />
              Password: <span className="text-slate-800 font-bold select-all font-mono">admin3</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 border-1.5 border-black text-white font-bold text-xs uppercase tracking-widest cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
            >
              SIGN IN ADMIN &rarr;
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* MAIN AUTHENTICATED ADMINISTRATOR WORKSPACE */
  return (
    <div className="space-y-8 animate-fade-in text-slate-800 max-w-5xl mx-auto">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] uppercase tracking-widest text-emerald-600 font-mono font-bold">COMMITTEE ADMINISTRATOR</span>
          </div>
          <h1 className="text-2xl font-serif text-slate-950 font-bold tracking-tight">University Control Center</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('#/')}
            className="px-5 py-2.5 bg-white border border-black hover:-translate-y-0.5 text-xs text-slate-800 rounded-xl flex items-center gap-1.5 font-bold uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go to Homepage</span>
          </button>

          <button 
            onClick={handleLogout}
            className="px-5 py-2.5 bg-rose-50 border border-rose-300 hover:bg-rose-100 text-xs text-rose-700 rounded-xl flex items-center gap-1.5 font-bold uppercase tracking-wider cursor-pointer transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Workspace Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-0.5">
        {[
          { key: 'dashboard', label: 'Monitor Dashboard', icon: LayoutDashboard },
          { key: 'questions', label: 'Question Bank', icon: ListPlus },
          { key: 'scores', label: 'Score Logbook', icon: Trophy },
          { key: 'feedback', label: 'Feedback Reviews', icon: Star },
          { key: 'user-questions', label: 'Public Q&A Moderation', icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                resetQuestionForm();
              }}
              className={`px-4 py-2.5 rounded-t-xl font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                isSelected 
                  ? 'bg-slate-50 text-amber-700 border-amber-600 font-bold' 
                  : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SYSTEM CONTROLS DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div 
              onClick={() => setActiveTab('questions')} 
              className="bg-white border-1.5 border-black rounded-[20px] p-6 cursor-pointer hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-[9px] tracking-widest font-mono text-slate-500 uppercase block">Trivia Questions</span>
                <span className="text-3xl font-bold text-slate-950 mt-1 block">{questions.length} Items</span>
                <span className="text-[10px] text-amber-600 font-bold mt-2 block hover:underline">Manage bank &rarr;</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-full text-slate-700">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('scores')}
              className="bg-white border-1.5 border-black rounded-[20px] p-6 cursor-pointer hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-[9px] tracking-widest font-mono text-slate-500 uppercase block">Quiz Completions</span>
                <span className="text-3xl font-bold text-slate-950 mt-1 block">{totalSubmissions} Logged</span>
                <span className="text-[10px] text-amber-600 font-bold mt-2 block hover:underline">Vew score roll &rarr;</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-full text-slate-700">
                <Trophy className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border-1.5 border-black rounded-[20px] p-6 flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div>
                <span className="text-[9px] tracking-widest font-mono text-slate-500 uppercase block">Average Accuracy</span>
                <span className="text-3xl font-bold text-slate-950 mt-1 block">{averageScorePercent}% Score</span>
                <span className="text-[10px] text-slate-400 mt-2 block">General cohort standard</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-600">
                <CircleDot className="w-5 h-5" />
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('feedback')}
              className="bg-white border-1.5 border-black rounded-[20px] p-6 cursor-pointer hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-[9px] tracking-widest font-mono text-slate-500 uppercase block">Feedbacks Filed</span>
                <span className="text-3xl font-bold text-slate-950 mt-1 block">{feedbacks.length} Sheets</span>
                <span className="text-[10px] text-amber-600 font-bold mt-2 block hover:underline">Monitor star metrics &rarr;</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-full text-slate-700">
                <Star className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-[#fffdf5] border-1.5 border-black rounded-[24px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-1 flex-1 text-left">
              <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-500 animate-spin-slow" />
                <span>Pending Community Communication Queue</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                There are questions submitted anonymously or voluntarily by incoming first-years. Moderate them, draft constructive replies, and decide which ones should be indexed into the public Q&amp;A directory!
              </p>
            </div>

            <button 
              onClick={() => setActiveTab('user-questions')}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white border border-black rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Answer Questions ({userQuestions.filter(q => !q.isAnswered).length}) &rarr;
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE QUESTIONS (CRUD) */}
      {activeTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          {/* Left Side: Form */}
          <div className="lg:col-span-5 bg-white border-1.5 border-black rounded-[20px] p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-sm font-bold text-slate-950 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>{editingQuestionId ? 'Modify MCQ Item' : 'Create New Q&A Item'}</span>
              {editingQuestionId && (
                <button 
                  onClick={resetQuestionForm}
                  className="text-[10px] text-red-600 font-bold uppercase tracking-wider hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </h3>

            {questionError && (
              <p className="p-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-mono mb-4 text-left">
                ⚠️ {questionError}
              </p>
            )}

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-left text-xs">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-slate-600 font-bold block mb-1">Question Description (Required)</label>
                <textarea
                  required
                  rows={2}
                  className="w-full px-3 py-2 border border-black rounded-lg bg-white"
                  placeholder="Draft question query text..."
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Option A</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                    value={qOptA}
                    onChange={(e) => setQOptA(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Option B</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                    value={qOptB}
                    onChange={(e) => setQOptB(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Option C</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                    value={qOptC}
                    onChange={(e) => setQOptC(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Option D</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                    value={qOptD}
                    onChange={(e) => setQOptD(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-slate-600 font-bold block mb-1">Correct Key</label>
                  <select
                    className="w-full p-2 bg-white border border-black rounded-md text-xs"
                    value={qCorrect}
                    onChange={(e) => setQCorrect(e.target.value as 'A' | 'B' | 'C' | 'D')}
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block mb-1">Subject Category</label>
                  <input
                    type="text"
                    className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs"
                    placeholder="e.g. Science"
                    value={qCategory}
                    onChange={(e) => setQCategory(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block mb-1">Order Index</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs"
                    value={qOrder}
                    onChange={(e) => setQOrder(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase rounded-lg cursor-pointer transition-colors mt-2"
              >
                {editingQuestionId ? 'Apply Database Update' : 'Insert into Question Bank'}
              </button>
            </form>
          </div>

          {/* Right Side: Questions Review */}
          <div className="lg:col-span-7 bg-white border-1.5 border-black rounded-[20px] overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="p-4 bg-slate-50 border-b border-black flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-900">Active Database Question Index ({questions.length})</h3>
            </div>

            <div className="overflow-x-auto max-h-[450px]">
              {sortedQuestions.length === 0 ? (
                <p className="p-8 text-center text-slate-400">Database has zero questions actively indexed.</p>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-500 font-bold uppercase text-[9px] tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">Order</th>
                      <th className="py-3 px-4">Question Text</th>
                      <th className="py-3 px-4 text-center">Correct Option</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedQuestions.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-700">{q.displayOrder}</td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-800 leading-relaxed line-clamp-2">{q.text}</p>
                          <span className="text-[9px] text-slate-400 font-mono block mt-0.5">Section: {q.category}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md font-mono font-bold">
                            {q.correctAnswer}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex gap-1.5">
                            <button
                              onClick={() => triggerEditQuestion(q)}
                              className="p-1.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 rounded-md transition-all cursor-pointer"
                              title="Modify question details"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-700" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you would like to delete this database question? This action affects stats.')) {
                                  deleteQuestion(q.id);
                                  resetQuestionForm();
                                }
                              }}
                              className="p-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-md transition-all cursor-pointer"
                              title="Delete database item"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUIZ SCORE LISTS */}
      {activeTab === 'scores' && (
        <div className="bg-white border-1.5 border-black rounded-[20px] overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-fade-in">
          <div className="p-5 bg-slate-50 border-b border-black flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Incoming Participant Performance Audit Roll</h3>
              <p className="text-[10px] text-slate-500">Chronological history log of submissions received from the trivia</p>
            </div>
            
            <div className="flex items-center gap-4 font-mono text-[10px] text-slate-500">
              <span>Highest Recorded: <strong className="text-amber-700">{highestScoreObj}%</strong></span>
              <span>Submissions: <strong className="text-slate-900">{scores.length} times</strong></span>
            </div>
          </div>

          <div className="overflow-x-auto text-left">
            {scores.length === 0 ? (
              <div className="p-16 text-center text-slate-400 space-y-2">
                <span className="text-4xl block">🏆</span>
                <p className="text-sm font-medium">No quiz participant records are filed in the database yet.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-500 font-mono text-[9px] uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-6">Participant Identity</th>
                    <th className="py-3.5 px-6">Email Address</th>
                    <th className="py-3.5 px-6 text-center">Score Count</th>
                    <th className="py-3.5 px-6 text-center">Time Taken</th>
                    <th className="py-3.5 px-6 text-center">Percentage Score</th>
                    <th className="py-3.5 px-6">Timestamp Filed</th>
                    <th className="py-3.5 px-6 text-right">Delete Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...scores].sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).map((sc) => {
                    return (
                      <tr key={sc.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-6 font-bold text-slate-900">{sc.participantName}</td>
                        <td className="py-3.5 px-6 font-mono text-slate-500">{sc.participantEmail || 'Not declared'}</td>
                        <td className="py-3.5 px-6 text-center font-mono font-bold text-slate-700">{sc.score} / {sc.totalQuestions}</td>
                        <td className="py-3.5 px-6 text-center font-mono font-bold text-slate-600">{sc.timeTaken || 0}s</td>
                        <td className="py-3.5 px-6 text-center">
                          <span className={`font-mono font-bold ${sc.percentage >= 80 ? 'text-emerald-600' : 'text-slate-800'}`}>
                            {sc.percentage}%
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-slate-400 font-mono text-[10px]">
                          {new Date(sc.submittedAt).toLocaleString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin membatalkan/menghapus skor dari peserta "${sc.participantName}"?`)) {
                                deleteScore(sc.id);
                              }
                            }}
                            className="p-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 rounded-md transition-all cursor-pointer"
                            title="Purge participant record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: REVIEW FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="space-y-6 animate-fade-in text-left">
          <div className="bg-white border-1.5 border-black rounded-[20px] p-5 flex justify-between items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Student Reviews &amp; Star Metrics Board</h3>
            </div>
            
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-mono">Mean Rating</span>
              <span className="text-xl font-bold text-amber-800 font-mono">
                ⭐ {(feedbacks.reduce((acc, c) => acc + (c.ratingValue || 5), 0) / (feedbacks.length || 1)).toFixed(2)} / 5.0
              </span>
            </div>
          </div>

          {feedbacks.length === 0 ? (
            <p className="p-12 text-center bg-white border border-slate-200 rounded-[24px] text-slate-400">No review ratings received yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feedbacks.map((fb) => (
                <div 
                  key={fb.id} 
                  className="bg-white border-1.5 border-black rounded-[20px] p-5 flex flex-col justify-between space-y-4 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{fb.participantName}</h4>
                        {fb.participantEmail && <span className="text-[9px] font-mono text-slate-400 block mt-0.5">{fb.participantEmail}</span>}
                      </div>

                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        {fb.category || 'Opinion'}
                      </span>
                    </div>

                    {/* Detailed Rating Matrix Display */}
                    <div className="grid grid-cols-3 gap-1 bg-slate-50 p-2 rounded-lg border border-slate-150 text-[9px] font-bold text-slate-500">
                      <div>
                        <span>Welcome:</span>
                        <div className="text-amber-500">⭐ {fb.welcomeRating || fb.ratingValue || 5}</div>
                      </div>
                      <div>
                        <span>Website:</span>
                        <div className="text-amber-500">⭐ {fb.websiteRating || fb.ratingValue || 5}</div>
                      </div>
                      <div>
                        <span>Event Org:</span>
                        <div className="text-amber-500">⭐ {fb.eventRating || fb.ratingValue || 5}</div>
                      </div>
                    </div>

                    {fb.comments ? (
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed italic">
                        "{fb.comments}"
                      </p>
                    ) : (
                      <span className="text-[10px] text-slate-300 block italic">No written comments provided.</span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                    <span>
                      📅 {new Date(fb.submittedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete feedback sheet filed by "${fb.participantName}"?`)) {
                          deleteFeedback(fb.id);
                        }
                      }}
                      className="text-red-600 hover:underline font-bold text-[10px] uppercase font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Purge Feedback</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ANSWERING USER QUESTIONS */}
      {activeTab === 'user-questions' && (
        <div className="space-y-6 animate-fade-in text-left">
          <div className="bg-white border-1.5 border-black rounded-[20px] p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Verified Q&amp;A Moderation Pipeline</h3>
              <p className="text-[10px] text-slate-500">Reply to student questions here to index them live globally in the public Q&amp;A Archive view.</p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full font-bold">
                Unanswered: {userQuestions.filter(q => !q.isAnswered).length} items
              </span>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full font-bold">
                Answered: {userQuestions.filter(q => q.isAnswered).length} items
              </span>
            </div>
          </div>

          {answerError && (
            <p className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-mono animate-fade-in">
              ⚠️ {answerError}
            </p>
          )}

          <div className="space-y-6 animate-fade-in">
            {userQuestions.length === 0 ? (
              <p className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-[24px]">No submitted questions archived yet.</p>
            ) : (
              userQuestions.map((uq) => {
                const isAnswering = activeAnswerId === uq.id;
                
                return (
                  <div 
                    key={uq.id} 
                    className="bg-white border-1.5 border-black rounded-[20px] p-6 space-y-4 relative overflow-hidden shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="flex justify-between items-start pb-2.5 border-b border-slate-150">
                      <div>
                        <span className="text-[10px] font-mono text-slate-700">👥 SUBMITTER: <strong>{uq.askerName}</strong></span>
                        {uq.askerEmail && <span className="text-[9px] font-mono text-slate-400 block mt-0.5">{uq.askerEmail}</span>}
                      </div>

                      <span className={`text-[9px] font-mono font-bold px-3 py-0.5 rounded-full ${
                        uq.isAnswered ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-amber-50 border border-amber-200 text-amber-800'
                      }`}>
                        {uq.isAnswered ? '✅ Answered & Public' : '⏳ Pending Response'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">First-Year Question:</span>
                      <p className="text-base font-bold text-slate-900 leading-relaxed italic">
                        "{uq.questionText}"
                      </p>
                    </div>

                    {uq.isAnswered && !isAnswering && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-emerald-700 block">Published Answer Text:</span>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans pr-5">
                          {uq.answerText}
                        </p>
                      </div>
                    )}

                    {isAnswering && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-black space-y-3 animate-fade-in text-left">
                        <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-slate-700 block">Formulate Senior Answer &amp; Resources:</span>
                        <textarea
                          rows={4}
                          className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 leading-relaxed font-sans focus:outline-none"
                          placeholder="Provide verified advice, instructions, links, or batch stories..."
                          value={adminAnswerText}
                          onChange={(e) => setAdminAnswerText(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setActiveAnswerId(null);
                              setAdminAnswerText('');
                            }}
                            className="px-4 py-2 border border-slate-300 bg-white text-slate-600 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveAnswer(uq.id)}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-sm"
                          >
                            Save &amp; Index Publicly &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                      <span>Asked at {new Date(uq.askedAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        {!isAnswering && (
                          <button
                            onClick={() => {
                              setActiveAnswerId(uq.id);
                              setAdminAnswerText(uq.answerText || '');
                            }}
                            className="px-4 py-1 bg-slate-50 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-[9px] uppercase tracking-wider font-bold cursor-pointer"
                          >
                            {uq.isAnswered ? 'Edit Answer' : 'Draft Response'}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Delete question query thread from index?')) {
                              deleteUserQuestion(uq.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-rose-500 rounded-md transition-all cursor-pointer"
                          title="Purge question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
