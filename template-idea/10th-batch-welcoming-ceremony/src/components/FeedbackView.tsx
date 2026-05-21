import React, { useState } from 'react';
import { useDB } from './DBContext';
import { ArrowLeft, Star, Heart, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { Feedback } from '../types';

interface FeedbackViewProps {
  onNavigate: (route: string) => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({ onNavigate }) => {
  const { feedbacks, addFeedback } = useDB();

  // Form parameters
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [welcomeRating, setWelcomeRating] = useState<number>(5);
  const [websiteRating, setWebsiteRating] = useState<number>(5);
  const [eventRating, setEventRating] = useState<number>(5);
  const [category, setCategory] = useState<'Academic' | 'Social' | 'Facilities' | 'Other'>('Social');
  const [comments, setComments] = useState('');

  // UI state
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!name.trim()) {
      setErrorText('Please tell us your name.');
      return;
    }

    const avgRating = Math.round((welcomeRating + websiteRating + eventRating) / 3);

    addFeedback({
      participantName: name.trim(),
      participantEmail: email.trim() || undefined,
      ratingValue: avgRating,
      welcomeRating,
      websiteRating,
      eventRating,
      category,
      comments: comments.trim() || undefined
    });

    setIsSuccess(true);
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setWelcomeRating(5);
    setWebsiteRating(5);
    setEventRating(5);
    setCategory('Social');
    setComments('');
    setIsSuccess(false);
  };

  const StarSelector: React.FC<{
    label: string;
    value: number;
    onChange: (val: number) => void;
  }> = ({ label, value, onChange }) => {
    const [hoverVal, setHoverVal] = useState<number>(0);
    return (
      <div className="space-y-1">
        <span className="text-xs font-bold text-slate-700 block">{label}</span>
        <div className="flex items-center gap-1.5 py-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="text-xl transition-transform hover:scale-120 focus:outline-none cursor-pointer"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverVal(star)}
              onMouseLeave={() => setHoverVal(0)}
            >
              <Star 
                className={`w-6 h-6 ${(hoverVal || value) >= star ? 'fill-amber-400 text-amber-500' : 'text-slate-200'}`} 
              />
            </button>
          ))}
          <span className="text-[11px] font-mono font-bold text-slate-500 ml-3">
            {value} / 5
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-slate-800">
      
      {/* Header Panel */}
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
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] tracking-widest font-mono text-slate-500 uppercase font-bold">REVIEWSBOARD</span>
          </div>
          <h1 className="text-3xl font-serif text-slate-950 font-bold tracking-tight">Share your Feedback</h1>
        </div>
      </div>

      {!isSuccess ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main feedback form */}
          <div className="lg:col-span-8 bg-white border-1.5 border-black rounded-[24px] p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-base font-bold text-slate-950 mb-5 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <span>We value your voice! Tell us how we did</span>
            </h3>

            {errorText && (
              <p className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-mono mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorText}</span>
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Star Rating Matrix */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
                  1. Rate your Experience (1 to 5 Stars)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StarSelector 
                    label="Welcome Ceremony 🎓" 
                    value={welcomeRating} 
                    onChange={setWelcomeRating} 
                  />
                  <StarSelector 
                    label="Website Experience 💻" 
                    value={websiteRating} 
                    onChange={setWebsiteRating} 
                  />
                  <StarSelector 
                    label="Event Organization 🎪" 
                    value={eventRating} 
                    onChange={setEventRating} 
                  />
                </div>
              </div>

              {/* Category Tags selector */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1.5">
                  2. Select Feedback Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Academic', 'Social', 'Facilities', 'Other'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                        category === cat 
                          ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold shadow-sm' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Informative Grid inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-600 font-bold block mb-1">
                    Your Full Name (Required)
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 bg-white border-1.5 border-black text-sm text-slate-800 placeholder-slate-400 rounded-xl"
                    placeholder="e.g. Maya Lin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 bg-white border-1.5 border-black text-sm text-slate-800 placeholder-slate-400 rounded-xl"
                    placeholder="maya@student.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-slate-600 font-bold block mb-1">
                  What did you like most? (Add any suggestions)
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-white border-1.5 border-black text-sm text-slate-800 placeholder-slate-400 rounded-xl leading-relaxed resize-none font-sans"
                  placeholder="Tell us what you liked, or suggest features for upcoming ceremonies..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 border-1.5 border-black text-white font-bold text-xs uppercase tracking-widest cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                SUBMIT MY FEEDBACK ⭐️
              </button>
            </form>
          </div>

          {/* Right column: Star statistic box representation */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#fffdf5] border-1.5 border-black rounded-[24px] p-6 text-center space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="inline-flex p-3 bg-amber-50 border border-amber-200 rounded-full text-amber-500">
                <Heart className="w-6 h-6 fill-amber-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Your Opinion Counts!</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                By telling us what worked and how your welcoming experience was, you help the 9th Batch perfect the community structure for years to come.
              </p>
            </div>

            <div className="bg-white border-1.5 border-black rounded-2xl p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-center text-xs pb-2.5 border-b border-slate-100">
                <span className="text-slate-500 uppercase font-mono tracking-wider text-[9px]">Reviews Received</span>
                <span className="font-bold text-slate-800 text-sm">{feedbacks.length} submissions</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2.5">
                <span className="text-slate-500 uppercase font-mono tracking-wider text-[9px]">Overall Rating</span>
                <span className="font-bold text-amber-800 text-sm">
                  ⭐ {(feedbacks.reduce((acc, c) => acc + (c.ratingValue || 5), 0) / (feedbacks.length || 1)).toFixed(1)} / 5.0
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SUCCESS SCREEN */
        <div className="bg-white border-1.5 border-black rounded-[24px] p-8 max-w-xl mx-auto text-center space-y-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-fade-in relative overflow-hidden">
          <div className="inline-flex p-4.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-600 mb-2">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] tracking-widest font-mono text-emerald-600 uppercase font-bold">THANK YOU!</span>
            <h2 className="text-2xl font-serif text-slate-950 font-bold leading-tight">Feedback Saved Successfully!</h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              We received your submission, **{name || 'Friend'}**! Your insights on the welcome event and website helps us grow closer as a combined batch community.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 max-w-sm mx-auto">
            <button
              onClick={handleResetForm}
              className="py-2.5 rounded-lg border border-slate-200 font-bold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Write Another
            </button>
            <button
              onClick={() => onNavigate('#/')}
              className="py-2.5 rounded-lg bg-[#b45309] hover:bg-[#d97706] border border-black text-white font-bold text-xs cursor-pointer shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
            >
              Back Home
            </button>
          </div>
        </div>
      )}

      {/* RECENT FEEDBACKS REVIEW BOARD */}
      <div className="space-y-5 pt-4">
        <div>
          <h2 className="text-xl font-serif text-slate-950 font-bold tracking-tight">Recent Community Reviews</h2>
          <p className="text-xs text-slate-500">Read what fellow 10th Batch peers have said about our events</p>
        </div>

        {feedbacks.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-slate-400">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs">No reviews have been posted yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {feedbacks.slice(0, 6).map((fb: any) => (
              <div 
                key={fb.id} 
                className="bg-white border-1.5 border-black rounded-[20px] p-5 flex flex-col justify-between space-y-4 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-slate-900 text-sm">{fb.participantName}</span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      {fb.category || 'Opinion'}
                    </span>
                  </div>
                  {fb.participantEmail && (
                    <span className="text-[9px] font-mono text-slate-400 block mt-0.5">{fb.participantEmail}</span>
                  )}
                  
                  {/* Detailed Star Grid for display */}
                  <div className="grid grid-cols-3 gap-1 my-3 bg-slate-50 p-2 rounded-lg border border-slate-100 text-[8px] font-bold text-slate-500">
                    <div>
                      <span>Welcome</span>
                      <div className="flex text-amber-500">⭐ {fb.welcomeRating || fb.ratingValue || 5}</div>
                    </div>
                    <div>
                      <span>Website</span>
                      <div className="flex text-amber-500">⭐ {fb.websiteRating || fb.ratingValue || 5}</div>
                    </div>
                    <div>
                      <span>Organization</span>
                      <div className="flex text-amber-500">⭐ {fb.eventRating || fb.ratingValue || 5}</div>
                    </div>
                  </div>

                  {fb.comments && (
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed font-serif italic">
                      "{fb.comments}"
                    </p>
                  )}
                </div>

                <div className="text-[9px] font-mono text-slate-400 pt-2 border-t border-slate-100 text-right">
                  📅 {new Date(fb.submittedAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
