import React from 'react';
import { useDB } from './DBContext';
import { Sparkles, MessageSquare, Gamepad2, Trophy, Star } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (route: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { visitorCount, userQuestions, scores } = useDB();
  const answeredCount = userQuestions.filter((q) => q.isAnswered).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 text-center animate-fade-in">
      
      {/* Mini Header Details */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="flex items-center gap-1.5 px-4 py-1 bg-white border-1.5 border-black rounded-full text-xs font-semibold tracking-wide shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
          <span className="p-pulse">
            <span className="p-pulse-ring"></span>
          </span>
          <span className="text-slate-800 font-medium">Live — {visitorCount} people here</span>
        </div>
      </div>

      {/* Big Friendly Title Centered */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-slate-900 select-none">
          You're in!
        </h1>
        <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed">
          Join us for an interactive welcome ceremony. Ask questions, test your knowledge, and share your feedback!
        </p>
      </div>

      {/* Playful Interactive Pill Button Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 max-w-3xl mx-auto pt-2">
        <button
          id="btn-ask-question"
          onClick={() => onNavigate('#/qa')}
          className="px-6 py-2.5 rounded-full border-1.5 border-black font-semibold text-sm bg-white text-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Ask a Question</span>
          <span className="text-base">💭</span>
        </button>

        <button
          id="btn-take-quiz"
          onClick={() => onNavigate('#/quiz')}
          className="px-6 py-2.5 rounded-full border-1.5 border-black font-semibold text-sm bg-white text-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Take the Quiz</span>
          <span className="text-base">🧠</span>
        </button>

        <button
          id="btn-leaderboard"
          onClick={() => onNavigate('#/leaderboard')}
          className="px-6 py-2.5 rounded-full border-1.5 border-black font-semibold text-sm bg-white text-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Leaderboard</span>
          <span className="text-base">🏆</span>
        </button>

        <button
          id="btn-give-feedback"
          onClick={() => onNavigate('#/feedback')}
          className="px-6 py-2.5 rounded-full border-1.5 border-black font-bold text-sm bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Give Feedback</span>
          <span className="text-base">⭐️</span>
        </button>
      </div>

      {/* Giant Interactive Three Card Layout Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        
        {/* Card 1: Interactive Q&A */}
        <div
          id="card-qa"
          onClick={() => onNavigate('#/qa')}
          className="bg-white border-1.5 border-black rounded-[24px] p-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 group"
        >
          <div className="w-16 h-16 bg-indigo-50 border border-slate-100 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
            💭
          </div>
          <div className="space-y-1 text-center">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Interactive Q&A</h3>
            <p className="text-xs font-semibold text-slate-400">Real-time polling and questions</p>
          </div>
          {userQuestions.length > 0 && (
            <div className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] px-2.5 py-1 rounded-full font-bold">
              {answeredCount} answered questions
            </div>
          )}
        </div>

        {/* Card 2: Knowledge Quiz */}
        <div
          id="card-quiz"
          onClick={() => onNavigate('#/quiz')}
          className="bg-white border-1.5 border-black rounded-[24px] p-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 group"
        >
          <div className="w-16 h-16 bg-pink-50 border border-pink-100 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
            🧠
          </div>
          <div className="space-y-1 text-center">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Knowledge Quiz</h3>
            <p className="text-xs font-semibold text-slate-400">30-second timed challenges</p>
          </div>
          <div className="bg-amber-100 border border-amber-200 text-amber-800 text-[10px] px-2.5 py-1 rounded-full font-bold">
            10 questions &amp; reward
          </div>
        </div>

        {/* Card 3: Leaderboard */}
        <div
          id="card-leaderboard"
          onClick={() => onNavigate('#/leaderboard')}
          className="bg-white border-1.5 border-black rounded-[24px] p-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 group"
        >
          <div className="w-16 h-16 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
            🏆
          </div>
          <div className="space-y-1 text-center">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Leaderboard</h3>
            <p className="text-xs font-semibold text-slate-400">Compete and see rankings</p>
          </div>
          {scores.length > 0 && (
            <div className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] px-2.5 py-1 rounded-full font-bold">
              Top score: {scores[0]?.participantName || 'N/A'} - {scores[0]?.score}/10
            </div>
          )}
        </div>

      </div>

      {/* Beautiful friendly informative message */}
      <div className="bg-[#fffdf5] border-1.5 border-amber-200 rounded-2xl p-5 max-w-2xl mx-auto flex items-center gap-3.5 text-left shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
        <span className="text-2xl">🎓</span>
        <div className="text-sm">
          <p className="font-bold text-slate-800">Welcome Day Special — Built by the 9th Batch</p>
          <p className="text-slate-600 mt-0.5">
            This cozy welcome hub is created specifically for the **10th Batch** to have fun, seek answers, and test their university smarts! Check out every tab!
          </p>
        </div>
      </div>

      {/* Share feedback reminder at the end */}
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-4 select-none">
        Share your feedback at the end to help us improve!
      </div>
    </div>
  );
};
