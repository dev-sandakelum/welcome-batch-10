import React, { useState } from 'react';
import { useDB } from './DBContext';
import { ArrowLeft, MessageSquare, ChevronDown, ChevronUp, Search, Calendar, User, CheckCircle2 } from 'lucide-react';

interface QAViewProps {
  onNavigate: (route: string) => void;
}

export const QAView: React.FC<QAViewProps> = ({ onNavigate }) => {
  const { userQuestions } = useDB();
  const [searchWord, setSearchWord] = useState('');
  
  // Track expanded question IDs in state
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'uq1': true // Expand first question by default
  });

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Only display answered questions on this public reading page
  const answeredList = userQuestions.filter(q => q.isAnswered);

  const filteredList = answeredList.filter(q => 
    q.questionText.toLowerCase().includes(searchWord.toLowerCase()) ||
    (q.answerText && q.answerText.toLowerCase().includes(searchWord.toLowerCase())) ||
    q.askerName.toLowerCase().includes(searchWord.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in text-slate-800">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
              <span className="text-[10px] tracking-widest font-mono text-slate-500 uppercase font-bold">INFO REPOSITORY</span>
            </div>
            <h1 className="text-3xl font-serif text-slate-950 font-bold tracking-tight">Q&amp;A Archive</h1>
          </div>
        </div>

        {/* Real-time search */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            className="px-4 py-2.5 pl-10 rounded-xl border-1.5 border-black text-xs text-slate-800 placeholder-slate-400 bg-white w-full"
            placeholder="Search questions or keywords..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Brief educational banner */}
      <div className="p-6 bg-[#fffdf5] border-1.5 border-black rounded-[24px] relative overflow-hidden flex flex-col md:flex-row items-center gap-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <span className="text-4xl text-left select-none">💡</span>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800">Knowledge is Collaborative!</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Here you can browse verified answers, tips, and cultural highlights curated exclusively by the **9th Batch** to ensure you excel in your incoming terms.
          </p>
        </div>
      </div>

      {/* Action Button to submit new Qs */}
      <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-xl">
        <span className="text-xs text-slate-600 font-medium">Have a different question first-year?</span>
        <button
          onClick={() => onNavigate('#/ask-question')}
          className="px-4 py-2 rounded-lg bg-white border border-black font-bold text-xs text-slate-800 hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
        >
          Submit Question 💭
        </button>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="p-16 bg-white border-1.5 border-black rounded-[24px] text-center text-slate-400 space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-medium">No archived Q&amp;As match your current search.</p>
            <button 
              onClick={() => setSearchWord('')}
              className="text-xs font-bold text-amber-600 hover:underline"
            >
              Clear Search Query &rarr;
            </button>
          </div>
        ) : (
          filteredList.map((uq) => {
            const isExpanded = !!expandedIds[uq.id];
            const formattedAsked = new Date(uq.askedAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div 
                key={uq.id} 
                className="bg-white border-1.5 border-black rounded-[20px] overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                {/* Accordion trigger header bar */}
                <button
                  onClick={() => toggleExpand(uq.id)}
                  className="w-full p-6 text-left hover:bg-slate-50/50 transition-colors flex justify-between items-start gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-slate-700 font-mono font-bold px-2.5 py-0.5 bg-slate-100 rounded-md border border-slate-200">
                        <User className="w-3 h-3 text-slate-400" /> {uq.askerName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-slate-400 font-mono">
                        <Calendar className="w-3 h-3" /> {formattedAsked}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-relaxed">
                      "{uq.questionText}"
                    </h3>
                  </div>

                  <span className="p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 shrink-0 mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {/* Accordion expandable text content */}
                {isExpanded && (
                  <div className="p-6 bg-slate-50 border-t border-slate-200 animate-fade-in space-y-3">
                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] tracking-widest font-mono font-bold text-emerald-700 uppercase">
                        <CheckCircle2 className="w-4 h-4" /> Senior Counsel Answer:
                      </span>
                      <p className="text-slate-700 leading-relaxed text-sm pl-4 border-l-2 border-emerald-500 font-sans">
                        {uq.answerText}
                      </p>
                    </div>

                    {uq.answeredAt && (
                      <div className="text-[9px] font-mono text-slate-400 text-right pt-2 border-t border-slate-100">
                        Last answered on {new Date(uq.answeredAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })} {uq.repliedBy ? `by ${uq.repliedBy}` : ''}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
