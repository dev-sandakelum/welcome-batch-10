import React, { useState } from 'react';
import { useDB } from './DBContext';
import { Trophy, ArrowLeft, Clock, Medal, Users, User, ArrowRight, Sparkles } from 'lucide-react';

interface LeaderboardViewProps {
  onNavigate: (route: string) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onNavigate }) => {
  const { scores } = useDB();
  const [searchTerm, setSearchTerm] = useState('');

  // Sort scores desc by credit/accuracy first, then by timeTaken (shorter is better), then by submittedAt timestamp
  const sortedScores = [...scores].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (a.timeTaken !== b.timeTaken) {
      return a.timeTaken - b.timeTaken; // smaller time taken is higher rank
    }
    return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
  });

  const filteredScores = sortedScores.filter(s => 
    s.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankBadgeAndStyle = (index: number) => {
    switch (index) {
      case 0:
        return {
          icon: <span className="text-xl">🥇</span>,
          bgColor: 'bg-amber-100 border-amber-400',
          textColor: 'text-amber-800',
          badgeText: '1st Place'
        };
      case 1:
        return {
          icon: <span className="text-xl">🥈</span>,
          bgColor: 'bg-slate-100 border-slate-400',
          textColor: 'text-slate-800',
          badgeText: '2nd Place'
        };
      case 2:
        return {
          icon: <span className="text-xl">🥉</span>,
          bgColor: 'bg-amber-50 border-amber-600',
          textColor: 'text-amber-900',
          badgeText: '3rd Place'
        };
      default:
        return {
          icon: <User className="w-4 h-4 text-slate-400" />,
          bgColor: 'bg-slate-50 border-slate-200',
          textColor: 'text-slate-600',
          badgeText: `#${index + 1}`
        };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 max-w-5xl mx-auto">
      
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
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] tracking-widest font-mono text-slate-500 uppercase font-bold">CEREMONY HALL</span>
            </div>
            <h1 className="text-3xl font-serif text-slate-950 font-bold tracking-tight">Public Leaderboard</h1>
          </div>
        </div>

        {/* Search filter input */}
        <input
          type="text"
          className="px-4 py-2.5 rounded-xl border-1.5 border-black text-xs w-full md:max-w-xs text-slate-800 bg-white"
          placeholder="Search by participant name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Aggregate Statistics banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-1.5 border-black rounded-[20px] p-6 flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <span className="text-[10px] tracking-widest font-mono text-slate-500 uppercase block">Total Challengers</span>
            <span className="text-4xl font-bold text-slate-950 mt-1 block">{scores.length}</span>
          </div>
          <div className="p-3 bg-indigo-50 border border-slate-200 rounded-full text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border-1.5 border-black rounded-[20px] p-6 flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <span className="text-[10px] tracking-widest font-mono text-slate-500 uppercase block">Average Accuracy</span>
            <span className="text-4xl font-bold text-slate-950 mt-1 block">
              {(scores.reduce((acc, curr) => acc + curr.percentage, 0) / (scores.length || 1)).toFixed(1)}%
            </span>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-full text-amber-600">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border-1.5 border-black rounded-[20px] p-6 flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[#fffdf5]">
          <span className="text-[10px] tracking-widest font-mono text-slate-500 uppercase block font-bold">WANT TO BE ON TOP?</span>
          <p className="text-xs text-slate-600 mt-1">Take the 10-question challenge and show off your speed!</p>
          <button 
            onClick={() => onNavigate('#/quiz')}
            className="mt-3 text-xs font-bold text-amber-600 hover:underline inline-flex items-center gap-1 cursor-pointer self-start"
          >
            Start Quiz Challenge <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="bg-white border-1.5 border-black rounded-[24px] overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-6 bg-slate-50 border-b border-black flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Score Standings</h3>
            <p className="text-xs text-slate-500">Rankings based on highest correctness then fastest submission time</p>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
            🟢 Live Updates Enabled
          </span>
        </div>

        <div className="overflow-x-auto">
          {filteredScores.length === 0 ? (
            <div className="p-16 text-center text-slate-400 space-y-4">
              <span className="text-5xl block">🔍</span>
              <p className="text-sm font-medium">No scores match the participant name you searched.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-500 font-mono text-[10px] uppercase tracking-widest border-b border-black">
                  <th className="py-4 px-2 sm:px-6 font-bold">Rank</th>
                  <th className="py-4 px-2 sm:px-6 font-bold">Full Name</th>
                  <th className="py-4 px-2 sm:px-6 font-bold text-center">Score</th>
                  <th className="py-4 px-2 sm:px-6 font-bold text-center hidden sm:table-cell">Time Taken</th>
                  <th className="py-4 px-2 sm:px-6 font-bold text-center hidden sm:table-cell">Ratio</th>
                  <th className="py-4 px-2 sm:px-6 font-bold text-right hidden md:table-cell">Date Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredScores.map((score, index) => {
                  const medalAttr = getRankBadgeAndStyle(index);
                  const isTopOne = index === 0;
                  const isTopThree = index < 3;
                  const formattedDate = new Date(score.submittedAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr 
                      key={score.id} 
                      className={`hover:bg-slate-50/50 transition-colors ${isTopOne ? 'bg-amber-50/30' : ''} ${isTopThree && !isTopOne ? 'bg-slate-50/20' : ''}`}
                    >
                      {/* Rank Column */}
                      <td className="py-4 px-2 sm:px-6">
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-black ${medalAttr.bgColor} ${medalAttr.textColor} font-bold text-xs`}>
                          {medalAttr.icon}
                          <span className="hidden sm:inline">{medalAttr.badgeText}</span>
                        </div>
                      </td>

                      {/* Participant Name Column */}
                      <td className="py-4 px-2 sm:px-6">
                        <div>
                          <div className={`font-bold ${isTopThree ? 'text-slate-900 text-sm sm:text-base' : 'text-slate-800 text-xs sm:text-sm'}`}>
                            {score.participantName}
                          </div>
                          {score.participantEmail && (
                            <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 font-mono truncate max-w-[120px] sm:max-w-none">
                              {score.participantEmail}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Raw Score count Column */}
                      <td className="py-4 px-2 sm:px-6 text-center">
                        <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs">
                          <span className="font-mono text-slate-800 font-bold block">{score.score}</span>
                          <span className="text-slate-400 text-[10px]">/ {score.totalQuestions}</span>
                        </div>
                      </td>

                      {/* Time taken Column */}
                      <td className="py-4 px-2 sm:px-6 text-center font-mono text-xs text-slate-600 font-bold hidden sm:table-cell">
                        <div className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{score.timeTaken || 0}s</span>
                        </div>
                      </td>

                      {/* Percentage score Column */}
                      <td className="py-4 px-2 sm:px-6 text-center hidden sm:table-cell">
                        <span className={`font-mono font-bold text-sm ${
                          score.percentage >= 80 ? 'text-emerald-600' :
                          score.percentage >= 60 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {score.percentage}%
                        </span>
                      </td>

                      {/* Timestamp Column */}
                      <td className="py-4 px-2 sm:px-6 text-right text-slate-500 font-mono text-[11px] hidden md:table-cell">
                        <span>{formattedDate}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
