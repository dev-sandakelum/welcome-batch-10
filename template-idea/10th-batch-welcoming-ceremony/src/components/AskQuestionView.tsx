import React, { useState } from 'react';
import { useDB } from './DBContext';
import { ArrowLeft, MessageSquare, Send, CheckCircle2, HelpCircle } from 'lucide-react';

interface AskQuestionViewProps {
  onNavigate: (route: string) => void;
}

export const AskQuestionView: React.FC<AskQuestionViewProps> = ({ onNavigate }) => {
  const { userQuestions, addUserQuestion } = useDB();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [questionText, setQuestionText] = useState('');

  // UI feedback states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Filter answered questions to show in previously answered section
  const answeredQuestions = userQuestions.filter(q => q.isAnswered);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please provide your name.');
      return;
    }
    if (!questionText.trim() || questionText.length < 10) {
      setErrorMessage('Your question must be at least 10 characters long.');
      return;
    }

    // Submit via DB Context
    addUserQuestion({
      askerName: name,
      askerEmail: email || undefined,
      questionText: questionText
    });

    setIsSubmitted(true);
    setName('');
    setEmail('');
    setQuestionText('');

    // Clear alert briefly
    setTimeout(() => {
      setIsSubmitted(false);
    }, 6000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in text-slate-800">
      
      {/* Back Button and Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('#/')}
          className="p-3 bg-white border-1.5 border-black rounded-full text-slate-800 hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
          title="Return back home"
        >
          <ArrowLeft className="w-5 h-5 font-bold" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] tracking-widest font-mono text-slate-500 uppercase font-bold">COMMUNITY TALK</span>
          </div>
          <h1 className="text-3xl font-serif text-slate-950 font-bold tracking-tight">Ask a Question</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Card */}
        <div className="lg:col-span-7 bg-white border-1.5 border-black rounded-[24px] p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Send className="w-4 h-4 text-amber-500" />
            <span>Send your question to the 9th Batch</span>
          </h3>

          {isSubmitted && (
            <div className="p-4 bg-emerald-50 border-1.5 border-emerald-500 rounded-2xl mb-6 flex items-start gap-3 animate-fade-in text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Question Submitted!</h4>
                <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                  Your question has been saved and queued for our seniors. Check back in the **Q&amp;A Archive** to see when they reply!
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <p className="text-xs font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl mb-4">
              ⚠️ {errorMessage}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-slate-600 font-bold block mb-1">
                  Your Name (Required)
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border-1.5 border-black text-sm text-slate-800 placeholder-slate-400 bg-white"
                  placeholder="e.g. Liam Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
                  Your Email (Optional)
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 rounded-xl border-1.5 border-black text-sm text-slate-800 placeholder-slate-400 bg-white"
                  placeholder="e.g. liam@student.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-600 font-bold block mb-1">
                Your Question Detail
              </label>
              <textarea
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border-1.5 border-black text-sm text-slate-800 placeholder-slate-400 leading-relaxed resize-none bg-white font-sans"
                placeholder="Ask about academic life, transition challenges, social meetups, or 9th batch secrets!"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#d97706] hover:bg-[#b45309] border-1.5 border-black text-white font-bold text-xs uppercase tracking-widest cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all"
            >
              Submit Question 💭
            </button>
          </form>
        </div>

        {/* Right Column: Mini Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#fffdf5] border-1.5 border-black rounded-[24px] p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative">
            <h4 className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-3 font-mono">How does it work?</h4>
            <div className="space-y-4 text-xs leading-relaxed text-slate-600">
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-800 shrink-0">1</span>
                <p>Fill out the simple form on the left. You can ask anything about campus transition!</p>
              </div>
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-800 shrink-0">2</span>
                <p>Your question enters the 9th Batch's secure database. A senior from the committee reviews it.</p>
              </div>
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-800 shrink-0">3</span>
                <p>Once answered, it will be published live in the **Q&amp;A Archive** for everyone to learn from!</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-1.5 border-black rounded-2xl p-5 flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 block font-mono">Moderation Quality</span>
              <span className="text-xs font-bold text-slate-800">100% Peer Verified</span>
            </div>
            <span className="px-3.5 py-1 bg-amber-100 border border-amber-300 text-amber-800 rounded-full text-[10px] font-bold font-mono">
              Anonymous Optional
            </span>
          </div>
        </div>
      </div>

      {/* Answered Questions Feeds Grid */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Recently Resolved Questions</span>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
            Archive Highlights
          </span>
        </h3>
        
        {answeredQuestions.length === 0 ? (
          <div className="p-8 bg-white border-1.5 border-black rounded-[24px] text-center text-slate-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
            <HelpCircle className="w-8 h-8 mx-auto text-amber-300 mb-2" />
            <p className="text-xs font-medium">No questions have been replied to yet. Be the first to ask!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {answeredQuestions.slice(0, 4).map((uq) => (
              <div 
                key={uq.id} 
                className="bg-white border-1.5 border-black rounded-[20px] p-6 space-y-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
              >
                {/* Meta details */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pb-2 border-b border-slate-100">
                  <span className="flex items-center gap-1">
                    👥 Asked by <strong>{uq.askerName}</strong>
                  </span>
                  <span className="text-emerald-600 font-bold">
                    RESOLVED
                  </span>
                </div>

                {/* Question */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">Question Asked:</span>
                  <p className="text-sm font-bold text-slate-800 leading-relaxed italic">
                    "{uq.questionText}"
                  </p>
                </div>

                {/* Answer */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-orange-600 font-bold font-mono">
                    Senior's Reply:
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {uq.answerText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
