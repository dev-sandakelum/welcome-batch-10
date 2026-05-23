'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';

export default function Home() {
  useEffect(() => {
    // Initialize animations after component mounts
    if (typeof window !== 'undefined') {
      import('@/public/assets/animations.js').then((module) => {
        module.initPopupAnimations();
        module.initNavDots();
        module.initScrollSnap();
        
        const faqData = [
          {
            question: "When does orientation week begin?",
            answer: "Orientation week typically kicks off in the first week of your semester. Your official schedule will be shared via email and the student portal. Make sure to attend every session — it's where lifelong connections begin! You'll get to meet your peers, explore the campus, and learn about all the resources available to you. The week includes campus tours, meet-and-greet sessions with faculty, club fairs, and fun icebreaker activities designed to help you settle in comfortably."
          },
          {
            question: "How do I join clubs and societies?",
            answer: "Clubs and societies hold an annual fair during orientation week. You can browse, sign up, and even audition on the spot! There's something for every interest — sports, arts, tech, debate, and more! Each club has a booth where you can meet current members, learn about their activities, and sign up on the spot. Don't be shy to try multiple clubs — it's a great way to discover new passions and make friends who share your interests."
          },
          {
            question: "Where do I find my class schedule?",
            answer: "Your class schedule is accessible on the official student portal. You'll receive login credentials in your welcome email. If you have any trouble accessing the portal, the student services desk is always ready to help. The portal also includes information about your professors, classroom locations, and any required textbooks or materials. Make sure to check it regularly for updates and announcements."
          },
          {
            question: "What facilities are available on campus?",
            answer: "Our campus features modern libraries with extensive collections and study spaces, state-of-the-art sports complexes including gyms and courts, multiple cafeterias offering diverse cuisine options, comfortable study lounges with high-speed internet, recreational areas for relaxation, computer labs with the latest technology, and dedicated spaces for group projects and collaborative work. All facilities are designed with your comfort and academic success in mind."
          },
          {
            question: "How can I contact seniors for guidance?",
            answer: "We have a comprehensive mentorship program where you'll be paired with experienced seniors from your department. You can also reach out through our official student groups on social media, attend peer mentoring sessions held weekly, or visit the student support center where senior volunteers are available to answer questions. Many departments also have dedicated WhatsApp or Discord groups where you can connect with seniors and get advice on courses, campus life, and career planning."
          }
        ];
        
        module.initFaqModal(faqData);
      });
    }
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel+Decorative:wght@700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/assets/styles.css" />
      
      {/* Background */}
      <div className="bg-canvas">
        <svg className="feather-bg" viewBox="0 0 200 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position: 'fixed', top: 0, right: '-80px', width: '420px', opacity: 0.08, zIndex: 0, animation: 'featherSway 12s ease-in-out infinite alternate', pointerEvents: 'none'}}>
          <ellipse cx="100" cy="300" rx="12" ry="280" fill="url(#fg1)" opacity="0.7"/>
          <ellipse cx="100" cy="120" rx="60" ry="100" fill="url(#fg2)" opacity="0.6"/>
          <circle cx="100" cy="100" r="22" fill="#1b6b3a" opacity="0.8"/>
          <circle cx="100" cy="100" r="14" fill="#00b4d8" opacity="0.9"/>
          <circle cx="100" cy="100" r="7" fill="#241559" opacity="1"/>
          <defs>
            <radialGradient id="fg1" cx="50%" cy="50%"><stop offset="0%" stopColor="#1b6b3a"/><stop offset="100%" stopColor="#241559"/></radialGradient>
            <radialGradient id="fg2" cx="50%" cy="50%"><stop offset="0%" stopColor="#00b4d8"/><stop offset="100%" stopColor="#1b6b3a"/></radialGradient>
          </defs>
        </svg>
      </div>

      {/* Nav Dots */}
      <div id="nav-dots" style={{position: 'fixed', right: '20px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 100}}>
        <div className="nav-dot active" data-section="0" title="Home"></div>
        <div className="nav-dot" data-section="1" title="About University"></div>
        <div className="nav-dot" data-section="2" title="FAQ"></div>
        <div className="nav-dot" data-section="3" title="Leaderboard"></div>
        <div className="nav-dot" data-section="4" title="Feedback"></div>
      </div>

      <div className="page">
        {/* SECTION 1 — HERO WELCOME */}
        <section className="section" id="hero" data-idx="0" style={{height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', scrollSnapAlign: 'start', position: 'relative', overflow: 'hidden'}}>
          <div className="popup-animate" style={{textAlign: 'center', opacity: 0, transform: 'scale(0.9) translateY(40px)', transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'}}>
            <div style={{display: 'inline-block', padding: '6px 18px', background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.35)', borderRadius: '50px', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '20px'}}>🦚 9th Batch Presents</div>
            <div style={{fontFamily: "'Cinzel Decorative', serif", fontSize: 'clamp(2.4rem, 7vw, 4.8rem)', fontWeight: 700, color: 'var(--accent-gold-light)', lineHeight: 1.1, textShadow: '0 0 40px rgba(201,162,39,0.4)', letterSpacing: '0.04em'}}>WELCOME</div>
            <div style={{fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', color: 'var(--accent-gold)', fontWeight: 400, margin: '-6px 0 4px 4px'}}>to the Family</div>
            <div style={{fontFamily: "'Cinzel Decorative', serif", fontSize: 'clamp(1.4rem,4vw,2.6rem)', color: 'var(--accent-teal-light)', marginTop: '2px'}}>10<sup style={{fontSize: '0.55em'}}>th</sup> Batch</div>

            <div className="gold-dot-line" style={{margin: '20px 0'}}><span>✦</span></div>

            <p style={{color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto'}}>
              You are not just joining a university. You are joining a legacy, a family, a story that continues with you.
              We are beyond excited to have you here.
            </p>

            <div style={{display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '28px', justifyContent: 'center'}}>
              <Link href="/quiz" className="btn-gold">Take the Quiz 🧠</Link>
              <Link href="/questions" className="btn-outline">Ask Questions ❓</Link>
            </div>

            <div style={{display: 'flex', gap: '10px', marginTop: '28px', justifyContent: 'center', flexWrap: 'wrap'}}>
              <Link href="/quiz" className="icon-btn" title="Quiz" style={{width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-gold-light)', fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', textDecoration: 'none'}}>🧠</Link>
              <Link href="/questions" className="icon-btn" title="Ask Questions" style={{width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-gold-light)', fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', textDecoration: 'none'}}>❓</Link>
              <Link href="/leaderboard" className="icon-btn" title="Full Leaderboard" style={{width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-gold-light)', fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', textDecoration: 'none'}}>🏆</Link>
              <Link href="/feedback" className="icon-btn" title="Feedback" style={{width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-gold-light)', fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', textDecoration: 'none'}}>💌</Link>
            </div>
          </div>

          <div className="scroll-indicator" style={{position: 'absolute', bottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.6, animation: 'bobble 2.5s ease-in-out infinite'}}>
            <span style={{fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)'}}>Scroll</span>
            <div style={{width: '24px', height: '24px', borderRight: '2px solid var(--accent-gold)', borderBottom: '2px solid var(--accent-gold)', transform: 'rotate(45deg)'}}></div>
          </div>
        </section>

        {/* SECTION 2 — ABOUT UNIVERSITY */}
        <section className="section" id="about" data-idx="1" style={{height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', scrollSnapAlign: 'start', position: 'relative', overflow: 'hidden'}}>
          <div className="popup-animate" style={{textAlign: 'center', marginBottom: '24px', opacity: 0, transform: 'scale(0.9) translateY(40px)', transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'}}>
            <div style={{fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-teal-light)', opacity: 0.8}}>Discover Your Campus</div>
            <div className="gold-dot-line"><span>✦</span></div>
            <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 600, color: 'var(--accent-gold-light)'}}>About Our University</div>
          </div>

          <div className="card popup-animate" style={{maxWidth: '700px', width: '100%', opacity: 0, transform: 'scale(0.9) translateY(40px)', transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)', padding: '28px 32px'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px'}} className="about-cards">
              {/* University Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)',
                  border: '1px solid rgba(201,162,39,0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '20px 16px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(201,162,39,0.25)';
                  e.currentTarget.style.borderColor = 'var(--accent-gold)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(201,162,39,0.3)';
                }}
              >
                <div style={{fontSize: '2.5rem', marginBottom: '12px'}}>🏛️</div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '12px', lineHeight: 1.2}}>
                  University of Ruhuna
                </div>
                <a
                  href="https://www.ruh.ac.lk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                  style={{fontSize: '0.7rem', padding: '8px 20px', width: '100%', justifyContent: 'center'}}
                  onClick={(e) => e.stopPropagation()}
                >
                  Visit Website →
                </a>
              </div>

              {/* Faculty Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(0,180,216,0.15) 0%, rgba(0,180,216,0.05) 100%)',
                  border: '1px solid rgba(0,180,216,0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '20px 16px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,180,216,0.25)';
                  e.currentTarget.style.borderColor = 'var(--accent-teal)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(0,180,216,0.3)';
                }}
              >
                <div style={{fontSize: '2.5rem', marginBottom: '12px'}}>🎓</div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--accent-teal-light)', marginBottom: '12px', lineHeight: 1.2}}>
                  Faculty of Technology
                </div>
                <a
                  href="https://www.tec.ruh.ac.lk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                  style={{fontSize: '0.7rem', padding: '8px 20px', width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, var(--accent-teal), #0090b0)'}}
                  onClick={(e) => e.stopPropagation()}
                >
                  Visit Website →
                </a>
              </div>
            </div>

            <div className="gold-line" style={{margin: '16px 0'}}></div>

            {/* Quick Stats */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'}} className="about-stats">
              <div style={{textAlign: 'center', padding: '12px 8px', background: 'rgba(20,8,60,0.4)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(201,162,39,0.15)'}}>
                <div style={{fontFamily: "'Cinzel Decorative', serif", fontSize: '1.5rem', color: 'var(--accent-gold-light)', marginBottom: '2px'}}>1978</div>
                <div style={{fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)'}}>Est.</div>
              </div>
              <div style={{textAlign: 'center', padding: '12px 8px', background: 'rgba(20,8,60,0.4)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(201,162,39,0.15)'}}>
                <div style={{fontFamily: "'Cinzel Decorative', serif", fontSize: '1.5rem', color: 'var(--accent-gold-light)', marginBottom: '2px'}}>9</div>
                <div style={{fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)'}}>Faculties</div>
              </div>
              <div style={{textAlign: 'center', padding: '12px 8px', background: 'rgba(20,8,60,0.4)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(201,162,39,0.15)'}}>
                <div style={{fontFamily: "'Cinzel Decorative', serif", fontSize: '1.5rem', color: 'var(--accent-gold-light)', marginBottom: '2px'}}>15K+</div>
                <div style={{fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)'}}>Students</div>
              </div>
            </div>
          </div>

          <div className="scroll-indicator" style={{position: 'absolute', bottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.6, animation: 'bobble 2.5s ease-in-out infinite'}}>
            <span style={{fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)'}}>Scroll</span>
            <div style={{width: '24px', height: '24px', borderRight: '2px solid var(--accent-gold)', borderBottom: '2px solid var(--accent-gold)', transform: 'rotate(45deg)'}}></div>
          </div>
        </section>

        {/* SECTION 3 — FAQ */}
        <section className="section" id="faq" data-idx="2" style={{height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', scrollSnapAlign: 'start', position: 'relative', overflow: 'hidden'}}>
          <div className="popup-animate" style={{textAlign: 'center', marginBottom: '30px', opacity: 0, transform: 'scale(0.9) translateY(40px)', transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'}}>
            <div style={{fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-teal-light)', opacity: 0.8}}>Got Questions?</div>
            <div className="gold-dot-line"><span>✦</span></div>
            <div className="section-heading-mobile" style={{fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 600, color: 'var(--accent-gold-light)'}}>Frequently Asked Questions</div>
          </div>

          <div className="card popup-animate" style={{maxWidth: '700px', width: '100%', opacity: 0, transform: 'scale(0.9) translateY(40px)', transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px'}}>
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="faq-item"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).openFaqModal) {
                      (window as any).openFaqModal(index);
                    }
                  }}
                  style={{
                    background: 'rgba(20,8,60,0.4)',
                    border: '1px solid rgba(201,162,39,0.2)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '18px',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-gold)';
                    e.currentTarget.style.background = 'rgba(201,162,39,0.08)';
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201,162,39,0.2)';
                    e.currentTarget.style.background = 'rgba(20,8,60,0.4)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  <div className="faq-q" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', gap: '12px'}}>
                    <span>{['When does orientation week begin?', 'How do I join clubs and societies?', 'Where do I find my class schedule?', 'What facilities are available on campus?'][index]}</span>
                    <span style={{color: 'var(--accent-gold)', fontSize: '1.3rem', flexShrink: 0}}>→</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="gold-line" style={{margin: '16px 0'}}></div>
            <div style={{textAlign: 'center', marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center'}}>
              <Link href="/questions" className="btn-outline" style={{flex: 1, minWidth: '180px', justifyContent: 'center', fontSize: '0.75rem', padding: '11px 24px'}}>Ask Question →</Link>
              <Link href="/all-questions" className="btn-outline" style={{flex: 1, minWidth: '180px', justifyContent: 'center', fontSize: '0.75rem', padding: '11px 24px'}}>View All Q&A 💬</Link>
            </div>
          </div>

          <div className="scroll-indicator" style={{position: 'absolute', bottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.6, animation: 'bobble 2.5s ease-in-out infinite'}}>
            <span style={{fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)'}}>Scroll</span>
            <div style={{width: '24px', height: '24px', borderRight: '2px solid var(--accent-gold)', borderBottom: '2px solid var(--accent-gold)', transform: 'rotate(45deg)'}}></div>
          </div>
        </section>

        {/* SECTION 4 — TOP 3 LEADERBOARD */}
        <section className="section" id="leaderboard" data-idx="3" style={{height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', scrollSnapAlign: 'start', position: 'relative', overflow: 'hidden'}}>
          <div className="popup-animate" style={{textAlign: 'center', marginBottom: '30px', opacity: 0, transform: 'scale(0.9) translateY(40px)', transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'}}>
            <div style={{fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-teal-light)', opacity: 0.8}}>Quiz Champions</div>
            <div className="gold-dot-line"><span>✦</span></div>
            <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 600, color: 'var(--accent-gold-light)'}}>Top 3 Leaderboard</div>
            <p style={{color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '12px', lineHeight: 1.7}}>See who's leading the pack!</p>
          </div>

          <div className="card popup-animate" style={{maxWidth: '600px', width: '100%', opacity: 0, transform: 'scale(0.9) translateY(40px)', transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'}}>
            <div>
              {[
                { medal: '🥇', rank: 1, name: 'Sarah Johnson', score: 95, rankClass: 'gold' },
                { medal: '🥈', rank: 2, name: 'Michael Chen', score: 92, rankClass: 'silver' },
                { medal: '🥉', rank: 3, name: 'Emma Williams', score: 88, rankClass: 'bronze' }
              ].map((entry) => (
                <div
                  key={entry.rank}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '14px 20px',
                    borderBottom: '1px solid rgba(201,162,39,0.1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(201,162,39,0.1)';
                    e.currentTarget.style.transform = 'translateX(8px) scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0) scale(1)';
                  }}
                >
                  <div style={{fontSize: '1.3rem'}}>{entry.medal}</div>
                  <div style={{
                    width: '32px',
                    textAlign: 'center',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: entry.rankClass === 'gold' ? '#ffd700' : entry.rankClass === 'silver' ? '#c0c0c0' : '#cd7f32'
                  }}>
                    {entry.rank}
                  </div>
                  <div style={{flex: 1, fontWeight: 500, fontSize: '0.92rem'}}>{entry.name}</div>
                  <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--accent-gold-light)'}}>
                    {entry.score}
                  </div>
                </div>
              ))}
            </div>

            <div className="gold-line"></div>
            <div style={{textAlign: 'center', marginTop: '20px'}}>
              <Link href="/leaderboard" className="btn-gold" style={{width: '100%', justifyContent: 'center'}}>
                View Full Leaderboard →
              </Link>
            </div>
          </div>

          <div className="scroll-indicator" style={{position: 'absolute', bottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.6, animation: 'bobble 2.5s ease-in-out infinite'}}>
            <span style={{fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)'}}>Scroll</span>
            <div style={{width: '24px', height: '24px', borderRight: '2px solid var(--accent-gold)', borderBottom: '2px solid var(--accent-gold)', transform: 'rotate(45deg)'}}></div>
          </div>
        </section>

        {/* SECTION 5 — FEEDBACK */}
        <section className="section" id="feedback" data-idx="4" style={{height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', scrollSnapAlign: 'start', position: 'relative', overflow: 'hidden'}}>
          <div className="popup-animate" style={{textAlign: 'center', marginBottom: '30px', opacity: 0, transform: 'scale(0.9) translateY(40px)', transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'}}>
            <div style={{fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-teal-light)', opacity: 0.8}}>We Value Your Opinion</div>
            <div className="gold-dot-line"><span>✦</span></div>
            <div className="section-heading-mobile" style={{fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 600, color: 'var(--accent-gold-light)'}}>Share Your Feedback</div>
          </div>

          <div className="card popup-animate" style={{maxWidth: '600px', width: '100%', textAlign: 'center', opacity: 0, transform: 'scale(0.9) translateY(40px)', transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'}}>
            <div style={{fontSize: '3rem', marginBottom: '20px'}}>💌</div>
            
            <p style={{color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '30px'}}>
              Your thoughts and suggestions matter to us. Share your experience and help us make the welcome program even better.
            </p>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px'}}>
              <div style={{background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 'var(--radius-sm)', padding: '20px'}}>
                <div style={{fontSize: '2rem', marginBottom: '8px'}}>⭐</div>
                <div style={{fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)'}}>Rate Experience</div>
              </div>
              <div style={{background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.3)', borderRadius: 'var(--radius-sm)', padding: '20px'}}>
                <div style={{fontSize: '2rem', marginBottom: '8px'}}>💭</div>
                <div style={{fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)'}}>Share Thoughts</div>
              </div>
            </div>

            <div className="gold-line" style={{margin: '16px 0'}}></div>
            
            <Link href="/feedback" className="btn-gold" style={{width: '100%', justifyContent: 'center'}}>
              Give Feedback →
            </Link>
          </div>
        </section>
      </div>

      {/* FAQ Modal */}
      <div className="faq-modal" id="faq-modal" style={{display: 'none', position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(8,4,25,0.92)', backdropFilter: 'blur(12px)', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
        <div className="faq-modal-content" style={{background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius)', backdropFilter: 'blur(18px)', padding: '40px', maxWidth: '600px', width: '100%', position: 'relative', maxHeight: '80vh', overflowY: 'auto'}}>
          <button className="faq-modal-close" onClick={() => {}} style={{position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '2rem', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'}}>×</button>
          <div className="faq-modal-question" id="modal-question" style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '20px', paddingRight: '40px', lineHeight: 1.3}}></div>
          <div className="gold-line"></div>
          <div className="faq-modal-answer" id="modal-answer" style={{color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.8}}></div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes featherSway {
          0% { transform: rotate(-5deg) translateY(0); }
          100% { transform: rotate(5deg) translateY(-20px); }
        }
        @keyframes bobble {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(8px); opacity: 0.9; }
        }
        .popup-animate.visible {
          opacity: 1 !important;
          transform: scale(1) translateY(0) !important;
        }
        .nav-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(201,162,39,0.3);
          border: 1px solid rgba(201,162,39,0.5);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-dot.active {
          background: var(--accent-gold);
          transform: scale(1.5);
          box-shadow: 0 0 15px rgba(201,162,39,0.6);
        }
        .nav-dot:hover {
          background: rgba(201,162,39,0.7);
          transform: scale(1.3);
          box-shadow: 0 0 10px rgba(201,162,39,0.4);
        }
        .icon-btn:hover {
          background: rgba(201,162,39,0.25) !important;
          transform: scale(1.1) rotate(5deg) !important;
          box-shadow: 0 8px 20px rgba(201,162,39,0.3);
        }
        .faq-modal.show {
          display: flex !important;
        }
        
        /* Responsive FAQ Grid */
        @media (max-width: 768px) {
          #faq .card > div:first-child {
            grid-template-columns: 1fr !important;
          }
          #feedback .card > div:nth-child(3) {
            grid-template-columns: 1fr !important;
          }
          .about-cards {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .about-stats {
            gap: 8px !important;
          }
          #about .card {
            padding: 20px 16px !important;
          }
          .section {
            padding: 30px 16px !important;
          }
          /* Hide 4th FAQ item on mobile */
          .faq-item:nth-child(4) {
            display: none !important;
          }
          /* Compact FAQ items on mobile */
          .faq-item {
            padding: 14px 16px !important;
          }
          .faq-item .faq-q {
            font-size: 0.95rem !important;
          }
          /* Compact feedback cards */
          #feedback .card {
            padding: 24px 20px !important;
          }
          #feedback .card > div:first-child {
            font-size: 2.5rem !important;
            margin-bottom: 12px !important;
          }
          #feedback .card p {
            font-size: 0.85rem !important;
            margin-bottom: 20px !important;
          }
          /* Compact section headings */
          .popup-animate {
            margin-bottom: 20px !important;
          }
          .section-heading-mobile {
            font-size: clamp(1.4rem, 4vw, 2rem) !important;
          }
        }
        
        @media (max-width: 480px) {
          .about-stats > div {
            padding: 10px 6px !important;
          }
          .about-stats > div > div:first-child {
            font-size: 1.3rem !important;
          }
          .about-stats > div > div:last-child {
            font-size: 0.6rem !important;
          }
          /* Extra compact for small phones */
          .section {
            padding: 20px 12px !important;
          }
          #faq .card, #feedback .card {
            padding: 20px 16px !important;
          }
          .faq-item {
            padding: 12px 14px !important;
          }
          .popup-animate {
            margin-bottom: 16px !important;
          }
        }
      `}</style>
    </>
  );
}
