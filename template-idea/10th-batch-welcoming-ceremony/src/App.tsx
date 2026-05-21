import React, { useState, useEffect } from 'react';
import { DBProvider } from './components/DBContext';
import { HomeView } from './components/HomeView';
import { QuizView } from './components/QuizView';
import { LeaderboardView } from './components/LeaderboardView';
import { AskQuestionView } from './components/AskQuestionView';
import { FeedbackView } from './components/FeedbackView';
import { QAView } from './components/QAView';
import { AdminPanel } from './components/AdminPanel';

export function CoreApp() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.hash || '#/';
  });

  // Monitor URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = route;
  };

  const renderView = () => {
    const route = currentRoute;
    
    if (route.startsWith('#/admin')) {
      const parts = route.split('/');
      const subRoute = parts[2];
      return <AdminPanel onNavigate={navigateTo} initialSubRoute={subRoute} />;
    }

    switch (route) {
      case '#/':
        return <HomeView onNavigate={navigateTo} />;
      case '#/quiz':
        return <QuizView onNavigate={navigateTo} />;
      case '#/leaderboard':
        return <LeaderboardView onNavigate={navigateTo} />;
      case '#/ask-question':
        return <AskQuestionView onNavigate={navigateTo} />;
      case '#/feedback':
        return <FeedbackView onNavigate={navigateTo} />;
      case '#/qa':
        return <QAView onNavigate={navigateTo} />;
      default:
        return <HomeView onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans relative flex flex-col text-slate-800">
      
      {/* Playful Neobrutalist background grid style */}
      <div className="absolute inset-0 opacity-4 bg-[#000000] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" 
        style={{
          backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)',
          backgroundSize: '24px_24px',
          pointerEvents: 'none',
          zIndex: 0
        }} 
      />

      {/* COMPACT BRAND HEADER (NO NAVIGATION INTERFACES) */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-black shadow-[0_2px_0px_0px_rgba(0,0,0,1)] max-w-7xl w-[95%] sm:w-full mx-auto sm:rounded-b-[20px] sm:border-x-2 transition-all mt-0 sm:mt-1">
        <div className="px-4 sm:px-8 py-3.5 flex items-center justify-between">
          
          {/* Logo container */}
          <button 
            onClick={() => navigateTo('#/')}
            className="flex items-center gap-2 focus:outline-none cursor-pointer group"
          >
            <span className="text-2xl group-hover:rotate-12 transition-transform select-none">🎓</span>
            <div className="text-left">
              <span className="text-[10px] tracking-widest text-[#b45309] font-bold block font-mono">10TH BATCH</span>
              <span className="text-base font-serif font-bold text-slate-950 group-hover:text-amber-600 transition-colors">
                Welcoming Ceremony
              </span>
            </div>
          </button>

          {/* Simple Clean Indicator */}
          <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
            CS Department
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER FRAME */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8 relative z-10">
        {renderView()}
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-white border-t-2 border-black py-6 text-center text-xs font-mono font-bold text-slate-500 z-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span>🎓 Computer Science 10th Batch Welcoming Committee</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="p-pulse" /> Live Visitor Count: <strong className="text-slate-700">124</strong>
            </span>
            <span>&bull;</span>
            <span>Est. May 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <DBProvider>
      <CoreApp />
    </DBProvider>
  );
}
