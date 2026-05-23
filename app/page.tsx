'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import './styles/home.css';

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
      <link rel="stylesheet" href="/assets/styles-tablet.css" />
      <link rel="stylesheet" href="/assets/styles-mobile.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-small.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-extra-small.css" />
      
      {/* Background */}
      <div className="bg-canvas">
        <svg className="feather-bg" viewBox="0 0 200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <div id="nav-dots" className="nav-dots-container">
        <div className="nav-dot active" data-section="0" title="Home"></div>
        <div className="nav-dot" data-section="1" title="About University"></div>
        <div className="nav-dot" data-section="2" title="FAQ"></div>
        <div className="nav-dot" data-section="3" title="Leaderboard"></div>
        <div className="nav-dot" data-section="4" title="Feedback"></div>
      </div>

      <div className="page-container">
        {/* SECTION 1 — HERO WELCOME */}
        <section className="home-section" id="hero" data-idx="0">
          <div className="popup-animate hero-section">
            <div className="hero-badge">🦚 9th Batch Presents</div>
            <div className="hero-title">WELCOME</div>
            <div className="hero-subtitle">to the Family</div>
            <div className="hero-batch">10<sup>th</sup> Batch</div>

            <div className="gold-dot-line"><span>✦</span></div>

            <p className="hero-description">
              You are not just joining a university. You are joining a legacy, a family, a story that continues with you.
              We are beyond excited to have you here.
            </p>

            <div className="hero-buttons">
              <Link href="/quiz" className="btn-gold">Take the Quiz 🧠</Link>
              <Link href="/questions" className="btn-outline">Ask Questions ❓</Link>
            </div>

            <div className="hero-icon-buttons">
              <Link href="/quiz" className="icon-btn" title="Quiz">🧠</Link>
              <Link href="/questions" className="icon-btn" title="Ask Questions">❓</Link>
              <Link href="/leaderboard" className="icon-btn" title="Full Leaderboard">🏆</Link>
              <Link href="/feedback" className="icon-btn" title="Feedback">💌</Link>
            </div>
          </div>

          <div className="scroll-indicator">
            <span className="scroll-indicator-text">Scroll</span>
            <div className="scroll-indicator-arrow"></div>
          </div>
        </section>

        {/* SECTION 2 — ABOUT UNIVERSITY */}
        <section className="home-section" id="about" data-idx="1">
          <div className="popup-animate about-section-header">
            <div className="section-label">Discover Your Campus</div>
            <div className="gold-dot-line"><span>✦</span></div>
            <div className="section-heading">About Our University</div>
          </div>

          <div className="card popup-animate about-card-container">
            <div className="about-cards-grid">
              {/* University Card */}
              <div className="about-card-item">
                <div className="about-card-icon">🏛️</div>
                <div className="about-card-title">University of Ruhuna</div>
                <a
                  href="https://www.ruh.ac.lk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold about-card-button"
                  onClick={(e) => e.stopPropagation()}
                >
                  Visit Website →
                </a>
              </div>

              {/* Faculty Card */}
              <div className="about-card-item teal">
                <div className="about-card-icon">🎓</div>
                <div className="about-card-title teal">Faculty of Technology</div>
                <a
                  href="https://www.tec.ruh.ac.lk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold about-card-button teal"
                  onClick={(e) => e.stopPropagation()}
                >
                  Visit Website →
                </a>
              </div>
            </div>

            <div className="gold-line"></div>

            {/* Quick Stats */}
            <div className="about-stats-grid">
              <div className="about-stat-item">
                <div className="about-stat-value">1978</div>
                <div className="about-stat-label">Est.</div>
              </div>
              <div className="about-stat-item">
                <div className="about-stat-value">9</div>
                <div className="about-stat-label">Faculties</div>
              </div>
              <div className="about-stat-item">
                <div className="about-stat-value">15K+</div>
                <div className="about-stat-label">Students</div>
              </div>
            </div>
          </div>

          <div className="scroll-indicator">
            <span className="scroll-indicator-text">Scroll</span>
            <div className="scroll-indicator-arrow"></div>
          </div>
        </section>

        {/* SECTION 3 — FAQ */}
        <section className="home-section" id="faq" data-idx="2">
          <div className="popup-animate faq-section-header">
            <div className="section-label">Got Questions?</div>
            <div className="gold-dot-line"><span>✦</span></div>
            <div className="section-heading-mobile">Frequently Asked Questions</div>
          </div>

          <div className="card popup-animate faq-card-container">
            <div className="faq-grid">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="faq-item"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).openFaqModal) {
                      (window as any).openFaqModal(index);
                    }
                  }}
                >
                  <div className="faq-question">
                    <span>{['When does orientation week begin?', 'How do I join clubs and societies?', 'Where do I find my class schedule?', 'What facilities are available on campus?'][index]}</span>
                    <span className="faq-arrow">→</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="gold-line"></div>
            <div className="faq-actions">
              <Link href="/questions" className="btn-outline faq-action-button">Ask Question →</Link>
              <Link href="/all-questions" className="btn-outline faq-action-button">View All Q&A 💬</Link>
            </div>
          </div>

          <div className="scroll-indicator">
            <span className="scroll-indicator-text">Scroll</span>
            <div className="scroll-indicator-arrow"></div>
          </div>
        </section>

        {/* SECTION 4 — TOP 3 LEADERBOARD */}
        <section className="home-section" id="leaderboard" data-idx="3">
          <div className="popup-animate leaderboard-section-header">
            <div className="section-label">Quiz Champions</div>
            <div className="gold-dot-line"><span>✦</span></div>
            <div className="section-heading">Top 3 Leaderboard</div>
            <p className="leaderboard-description">See who's leading the pack!</p>
          </div>

          <div className="card popup-animate leaderboard-card-container">
            <div>
              {[
                { medal: '🥇', rank: 1, name: 'Sarah Johnson', score: 95, rankClass: 'gold' },
                { medal: '🥈', rank: 2, name: 'Michael Chen', score: 92, rankClass: 'silver' },
                { medal: '🥉', rank: 3, name: 'Emma Williams', score: 88, rankClass: 'bronze' }
              ].map((entry) => (
                <div key={entry.rank} className="leaderboard-entry">
                  <div className="leaderboard-medal">{entry.medal}</div>
                  <div className={`leaderboard-rank ${entry.rankClass}`}>{entry.rank}</div>
                  <div className="leaderboard-name">{entry.name}</div>
                  <div className="leaderboard-score">{entry.score}</div>
                </div>
              ))}
            </div>

            <div className="gold-line"></div>
            <div className="leaderboard-action">
              <Link href="/leaderboard" className="btn-gold leaderboard-button">
                View Full Leaderboard →
              </Link>
            </div>
          </div>

          <div className="scroll-indicator">
            <span className="scroll-indicator-text">Scroll</span>
            <div className="scroll-indicator-arrow"></div>
          </div>
        </section>

        {/* SECTION 5 — FEEDBACK */}
        <section className="home-section" id="feedback" data-idx="4">
          <div className="popup-animate feedback-section-header">
            <div className="section-label">We Value Your Opinion</div>
            <div className="gold-dot-line"><span>✦</span></div>
            <div className="section-heading-mobile">Share Your Feedback</div>
          </div>

          <div className="card popup-animate feedback-card-container">
            <div className="feedback-icon">💌</div>
            
            <p className="feedback-description">
              Your thoughts and suggestions matter to us. Share your experience and help us make the welcome program even better.
            </p>

            <div className="feedback-features-grid">
              <div className="feedback-feature-item">
                <div className="feedback-feature-icon">⭐</div>
                <div className="feedback-feature-label">Rate Experience</div>
              </div>
              <div className="feedback-feature-item teal">
                <div className="feedback-feature-icon">💭</div>
                <div className="feedback-feature-label">Share Thoughts</div>
              </div>
            </div>

            <div className="gold-line"></div>
            
            <Link href="/feedback" className="btn-gold feedback-button">
              Give Feedback →
            </Link>
          </div>
        </section>
      </div>

      {/* FAQ Modal */}
      <div className="faq-modal" id="faq-modal">
        <div className="faq-modal-content">
          <button className="faq-modal-close" onClick={() => {}}>×</button>
          <div className="faq-modal-question" id="modal-question"></div>
          <div className="gold-line"></div>
          <div className="faq-modal-answer" id="modal-answer"></div>
        </div>
      </div>
    </>
  );
}
