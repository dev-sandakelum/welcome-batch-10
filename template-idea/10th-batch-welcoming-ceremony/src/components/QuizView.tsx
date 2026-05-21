import React, { useState, useEffect, useRef } from 'react';
import { useDB } from './DBContext';
import { Gamepad2, Timer, Award, RotateCcw, Home, ChevronRight, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface QuizViewProps {
  onNavigate: (route: string) => void;
}

// Simple internal physics-particle custom confetti component to avoid dependency risks
const CustomConfetti: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; speedY: number; speedX: number; rotation: number; rotSpeed: number }>>([]);

  useEffect(() => {
    const colors = ['#f59e0b', '#d97706', '#3b82f6', '#10b981', '#ec4899', '#f43f5e', '#84cc16'];
    const initialParticles = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 50,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12
    }));

    setParticles(initialParticles);

    let animationFrameId: number;
    const update = () => {
      setParticles(prev => prev.map(p => {
        let nextY = p.y + p.speedY;
        let nextX = p.x + p.speedX;
        if (nextY > window.innerHeight) {
          nextY = -20;
          nextX = Math.random() * window.innerWidth;
        }
        return {
          ...p,
          y: nextY,
          x: nextX,
          rotation: p.rotation + p.rotSpeed
        };
      }));
      animationFrameId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            transform: `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg)`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.size % 2 === 0 ? '50%' : '2px',
            opacity: 0.85
          }}
        />
      ))}
    </div>
  );
};

export const QuizView: React.FC<QuizViewProps> = ({ onNavigate }) => {
  const { questions, addScore } = useDB();

  // Quiz Phases
  const [phase, setPhase] = useState<'info' | 'taking' | 'results'>('info');

  // Input Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Active quiz playing states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isAnswerEvaluated, setIsAnswerEvaluated] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // Results analytics
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [finalTimeTaken, setFinalTimeTaken] = useState<number>(0);
  const [finalScoreSummary, setFinalScoreSummary] = useState({ score: 0, total: 0, percentage: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle timer ticks
  useEffect(() => {
    if (phase !== 'taking') return;

    if (timeLeft <= 0) {
      // Auto register a false option on timeout
      handleAnswer('A'); // default select option on timeout in evaluated state
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, phase]);

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Reset everything
    setCurrentIndex(0);
    setSelectedOption(null);
    setCorrectAnswersCount(0);
    setIsAnswerEvaluated(false);
    setTimeLeft(30);
    setQuizStartTime(Date.now());
    setPhase('taking');
  };

  const currentQ = questions[currentIndex];

  const handleAnswer = (option: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswerEvaluated) return;

    setSelectedOption(option);
    setIsAnswerEvaluated(true);

    if (timerRef.current) clearTimeout(timerRef.current);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      // Move to next question safely
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerEvaluated(false);
      setTimeLeft(30);
    } else {
      // Completed! Compute results
      const total = questions.length;
      const finalScore = correctAnswersCount;
      const percentage = Math.round((finalScore / total) * 100);
      const secondsTaken = Math.round((Date.now() - quizStartTime) / 1000);

      setFinalTimeTaken(secondsTaken);

      // Save to database
      addScore({
        participantName: name.trim(),
        participantEmail: email.trim() || undefined,
        score: finalScore,
        totalQuestions: total,
        percentage: percentage,
        timeTaken: secondsTaken
      });

      setFinalScoreSummary({
        score: finalScore,
        total,
        percentage
      });

      if (percentage >= 50) {
        setShowConfetti(true);
      }

      setPhase('results');
    }
  };

  const handleResetQuiz = () => {
    setPhase('info');
    setName('');
    setEmail('');
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerEvaluated(false);
    setShowConfetti(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-4 text-slate-800">
      {/* Confetti celebration for high scores */}
      {showConfetti && <CustomConfetti />}

      {/* STAGE 1: INFO / PARTICIPANT INTRO */}
      {phase === 'info' && (
        <div className="bg-white border-1.5 border-black rounded-[24px] p-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden animate-fade-in">
          
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex p-4.5 bg-amber-50 border border-amber-200 rounded-full text-amber-600 mb-2">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-serif text-slate-950 font-bold leading-tight">
              Knowledge Game Challenge
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Test your smarts in our 10-question Welcoming Trivia! Answer questions about your department, university stories, batch culture, and computer science general facts.
            </p>
          </div>

          <form onSubmit={handleStartQuiz} className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] uppercase tracking-widest text-slate-600 font-bold block mb-1">
                Your Full Name (Required)
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-white border-1.5 border-black text-sm text-slate-800 placeholder-slate-400 font-medium rounded-xl focus:ring-0"
                placeholder="Enter your name to start..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
                Your Email Address (Optional)
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-white border-1.5 border-black text-sm text-slate-800 placeholder-slate-400 font-medium rounded-xl focus:ring-0"
                placeholder="maya@student.edu (Used for score tracking)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Rules reminder banner */}
            <div className="p-4 bg-[#fffdf5] border-1.5 border-amber-200 rounded-2xl flex items-start gap-4">
              <span className="text-xl select-none">📢</span>
              <div className="text-xs text-slate-600 leading-relaxed text-left">
                Keep an eye on the clock! Each question has a strict <strong>30-second timer</strong>. Select your answer and then click Next. Compete with your peers for the fastest clean sheet!
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-widest cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-xl border-1.5 border-black"
            >
              Start Quiz Challenge 🧠
            </button>
          </form>
        </div>
      )}

      {/* STAGE 2: ACTIVE MCQ QUIZ GAMEPLAY */}
      {phase === 'taking' && currentQ && (
        <div className="bg-white border-1.5 border-black rounded-[24px] p-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden animate-fade-in">
          
          {/* Header Progress and Timer bar */}
          <div className="flex justify-between items-center pb-5 border-b border-slate-100 mb-6">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">ACTIVELY PLAYING</div>
              <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                Question {currentIndex + 1} of {questions.length}
              </h3>
            </div>

            {/* Glowing circular timer UI */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full">
              <Timer className={`w-4 h-4 ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-amber-600'}`} />
              <span className={`font-mono text-sm font-bold ${timeLeft < 10 ? 'text-red-600' : 'text-slate-800'}`}>
                {timeLeft}s remaining
              </span>
            </div>
          </div>

          {/* Progress bar container */}
          <div className="w-full h-2 bg-slate-100 border border-slate-200 rounded-full overflow-hidden mb-8">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text Box */}
          <div className="mb-8 text-left">
            <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] tracking-wider text-amber-800 font-mono font-bold mb-3">
              Section: {currentQ.category}
            </span>
            <h2 className="text-xl font-bold text-slate-950 leading-relaxed">
              {currentQ.text}
            </h2>
          </div>

          {/* Choices Buttons Grid A B C D */}
          <div className="space-y-4">
            {([
              { key: 'A', text: currentQ.optionA },
              { key: 'B', text: currentQ.optionB },
              { key: 'C', text: currentQ.optionC },
              { key: 'D', text: currentQ.optionD }
            ] as const).map(({ key, text }) => {
              const isSelected = selectedOption === key;
              const isCorrectAnswer = currentQ.correctAnswer === key;
              
              let btnClass = "w-full p-4.5 rounded-xl text-left border-1.5 flex items-center justify-between text-sm transition-all cursor-pointer ";
              let badgeClass = "w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs mr-3 transition-colors ";

              if (!isAnswerEvaluated) {
                // Interactive state before submission
                btnClass += "bg-white border-black hover:bg-slate-50 text-slate-800 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5";
                badgeClass += "bg-slate-100 text-slate-700 border border-slate-200";
              } else {
                // Evaluated styling
                if (isCorrectAnswer) {
                  btnClass += "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                  badgeClass += "bg-emerald-500 text-white";
                } else if (isSelected) {
                  btnClass += "bg-red-50 border-red-500 text-red-950 italic";
                  badgeClass += "bg-red-500 text-white";
                } else {
                  btnClass += "bg-white border-slate-200 text-slate-400";
                  badgeClass += "bg-slate-100 text-slate-300 border border-slate-200";
                }
              }

              return (
                <button
                  key={key}
                  onClick={() => handleAnswer(key)}
                  disabled={isAnswerEvaluated}
                  className={btnClass}
                >
                  <div className="flex items-center">
                    <span className={badgeClass}>{key}</span>
                    <span>{text}</span>
                  </div>

                  {isAnswerEvaluated && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-2" />
                  )}
                  {isAnswerEvaluated && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-red-600 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Lanjut controls */}
          {isAnswerEvaluated && (
            <div className="pt-8 border-t border-slate-100 mt-8 flex justify-end animate-fade-in">
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-[#b45309] hover:bg-[#d97706] text-white border-1.5 border-black rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <span>
                  {currentIndex === questions.length - 1 ? 'Show Final Score' : 'Next Question'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* STAGE 3: RESULTS SUMMARY */}
      {phase === 'results' && (
        <div className="bg-white border-1.5 border-black rounded-[24px] p-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden animate-fade-in">
          
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex p-4.5 bg-slate-50 border border-slate-200 rounded-full text-slate-800 mb-2">
              <Award className="w-10 h-10" />
            </div>
            
            <span className="text-[10px] tracking-widest font-mono text-emerald-700 bg-emerald-50 rounded-full border border-emerald-300 px-3.5 py-1 font-bold">
              CHALLENGE COMPLETED SUCCESSFULLY!
            </span>
            <h2 className="text-3xl font-serif text-slate-950 font-bold leading-tight">
              Your Performance Summary
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
              Awesome job, **{name}**! Your stats has been safely updated into the live public leaderboard grid.
            </p>
          </div>

          {/* Analytical summary card */}
          <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-around gap-8">
            
            {/* Visual accuracy ring */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-slate-200" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  className="stroke-amber-500 transition-all duration-1000" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - finalScoreSummary.percentage / 100)}`}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-slate-800">
                  {finalScoreSummary.percentage}%
                </span>
                <span className="text-[8px] uppercase tracking-widest text-slate-400 block font-bold font-mono mt-0.5">Accuracy</span>
              </div>
            </div>

            {/* Breakdown metrics */}
            <div className="space-y-4 flex-1 text-left w-full">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Correct Answers:</span>
                <span className="font-mono text-sm font-bold text-emerald-600">
                  {finalScoreSummary.score} / {finalScoreSummary.total} correct
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Time Taken:</span>
                <span className="font-mono text-sm font-bold text-slate-700 inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{finalTimeTaken} seconds</span>
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Knowledge Rank:</span>
                <span className="font-bold text-amber-700 text-xs">
                  {finalScoreSummary.percentage === 100 ? 'Supreme Master 👑' : 
                   finalScoreSummary.percentage >= 80 ? 'Highly Knowledgeable ⭐' : 
                   finalScoreSummary.percentage >= 50 ? 'Certified Passer' : 'Beginner Rookie'}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleResetQuiz}
              className="py-3 rounded-xl border border-slate-200 font-bold text-slate-600 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Challenge</span>
            </button>

            <button
              onClick={() => onNavigate('#/leaderboard')}
              className="py-3 bg-[#b45309] hover:bg-[#d97706] text-white border-1.5 border-black rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
            >
              <Home className="w-4 h-4" />
              <span>Go to Leaderboard</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
