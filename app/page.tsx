'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import './styles/home.css';
import {
  initGSAPScrollSnap,
  initAuroraParticles,
  initMagneticCards,
  initGlassShimmer,
  initNavDotPulse,
  initFaqModal,
} from '@/lib/gsap-animations';

export default function Home() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

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

    initFaqModal(faqData);
    initAuroraParticles();
    initMagneticCards();
    initGlassShimmer();
    initNavDotPulse();
    const cleanupScrollSnap = initGSAPScrollSnap();

    // Cleanup function to restore scroll when leaving the page
    return () => {
      // Remove GSAP scroll snap event listeners
      cleanupScrollSnap();
      
      // Restore scroll styles
      document.documentElement.style.scrollSnapType = '';
      document.documentElement.style.overflowY = '';
      document.body.style.overflowY = '';
    };
  }, []);

  return (
    <>
      {/* Aurora particle canvas — sits above bg, below content */}
      {/* <canvas id="aurora-canvas" aria-hidden="true" /> */}

      {/* Background image layer */}
      <div className="bg-canvas">
        
      </div>

      {/* Nav Dots */}
      <nav id="nav-dots" className="nav-dots-container" aria-label="Section navigation">
        <div className="nav-dot active" data-section="0" title="Home" role="button" tabIndex={0} />
        <div className="nav-dot" data-section="1" title="About University" role="button" tabIndex={0} />
        <div className="nav-dot" data-section="2" title="FAQ" role="button" tabIndex={0} />
        <div className="nav-dot" data-section="3" title="Leaderboard" role="button" tabIndex={0} />
        <div className="nav-dot" data-section="4" title="Feedback" role="button" tabIndex={0} />
      </nav>

      <div className="page-container">

        {/* ── SECTION 1 — HERO ── */}
        <section className="home-section" id="hero" data-idx="0">
          <div className="hero-section">
            <div className="hero-badge">🦚 9th Batch Presents</div>
            <div className="hero-title">WELCOME</div>
            <div className="hero-subtitle">to the Family</div>
            <div className="hero-batch">
              10<sup>th</sup> Batch
            </div>

            <div className="gold-dot-line"><span>✦</span></div>

            <p className="hero-description">
              You are not just joining a university. You are joining a legacy, a family, a story
              that continues with you. We are beyond excited to have you here.
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

          <div className="scroll-indicator" aria-hidden="true">
            <span className="scroll-indicator-text">Scroll</span>
            <div className="scroll-indicator-arrow" />
          </div>
        </section>

        {/* ── SECTION 2 — ABOUT ── */}
        <section className="home-section" id="about" data-idx="1">
          <div className="about-section-header">
            <div className="section-label">Discover Your Campus</div>
            <div className="gold-dot-line"><span>✦</span></div>
            <div className="section-heading">About Our University</div>
          </div>

          <div className="card about-card-container">
            <div className="about-cards-grid">
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

            <div className="gold-line" />

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

          <div className="scroll-indicator" aria-hidden="true">
            <span className="scroll-indicator-text">Scroll</span>
            <div className="scroll-indicator-arrow" />
          </div>
        </section>

        {/* ── SECTION 3 — FAQ ── */}
        <section className="home-section" id="faq" data-idx="2">
          <div className="faq-section-header">
            <div className="section-label">Got Questions?</div>
            <div className="gold-dot-line"><span>✦</span></div>
            <div className="section-heading-mobile">Frequently Asked Questions</div>
          </div>

          <div className="card faq-card-container">
            <div className="faq-grid">
              {[
                'When does orientation week begin?',
                'How do I join clubs and societies?',
                'Where do I find my class schedule?',
                'What facilities are available on campus?',
              ].map((question, index) => (
                <div
                  key={index}
                  className="faq-item"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).openFaqModal) {
                      (window as any).openFaqModal(index);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (window as any).openFaqModal) {
                      (window as any).openFaqModal(index);
                    }
                  }}
                >
                  <div className="faq-question">
                    <span>{question}</span>
                    <span className="faq-arrow">→</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="gold-line" />
            <div className="faq-actions">
              <Link href="/questions" className="btn-outline faq-action-button">Ask Question →</Link>
              <Link href="/all-questions" className="btn-outline faq-action-button">View All Q&amp;A 💬</Link>
            </div>
          </div>

          <div className="scroll-indicator" aria-hidden="true">
            <span className="scroll-indicator-text">Scroll</span>
            <div className="scroll-indicator-arrow" />
          </div>
        </section>

        {/* ── SECTION 4 — LEADERBOARD ── */}
        <section className="home-section" id="leaderboard" data-idx="3">
          <div className="leaderboard-section-header">
            <div className="section-label">Quiz Champions</div>
            <div className="gold-dot-line"><span>✦</span></div>
            <div className="section-heading">Top 3 Leaderboard</div>
            <p className="leaderboard-description">See who&apos;s leading the pack!</p>
          </div>

          <div className="card leaderboard-card-container">
            {[
              { medal: '🥇', rank: 1, name: 'Sarah Johnson', score: 95, rankClass: 'gold' },
              { medal: '🥈', rank: 2, name: 'Michael Chen', score: 92, rankClass: 'silver' },
              { medal: '🥉', rank: 3, name: 'Emma Williams', score: 88, rankClass: 'bronze' },
            ].map((entry) => (
              <div key={entry.rank} className="leaderboard-entry">
                <div className="leaderboard-medal">{entry.medal}</div>
                <div className={`leaderboard-rank ${entry.rankClass}`}>{entry.rank}</div>
                <div className="leaderboard-name">{entry.name}</div>
                <div className="leaderboard-score">{entry.score}</div>
              </div>
            ))}

            <div className="gold-line" />
            <div className="leaderboard-action">
              <Link href="/leaderboard" className="btn-gold leaderboard-button">
                View Full Leaderboard →
              </Link>
            </div>
          </div>

          <div className="scroll-indicator" aria-hidden="true">
            <span className="scroll-indicator-text">Scroll</span>
            <div className="scroll-indicator-arrow" />
          </div>
        </section>

        {/* ── SECTION 5 — FEEDBACK ── */}
        <section className="home-section" id="feedback" data-idx="4">
          <div className="feedback-section-header">
            <div className="section-label">We Value Your Opinion</div>
            <div className="gold-dot-line"><span>✦</span></div>
            <div className="section-heading-mobile">Share Your Feedback</div>
          </div>

          <div className="card feedback-card-container">
            <div className="feedback-icon">💌</div>

            <p className="feedback-description">
              Your thoughts and suggestions matter to us. Share your experience and help us make
              the welcome program even better.
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

            <div className="gold-line" />

            <Link href="/feedback" className="btn-gold feedback-button">
              Give Feedback →
            </Link>
          </div>
        </section>

      </div>

      {/* FAQ Modal */}
      <div className="faq-modal" id="faq-modal" role="dialog" aria-modal="true">
        <div className="faq-modal-content">
          <button
            className="faq-modal-close"
            aria-label="Close"
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).closeFaqModal) {
                (window as any).closeFaqModal();
              }
            }}
          >
            ×
          </button>
          <div className="faq-modal-question" id="modal-question" />
          <div className="gold-line" />
          <div className="faq-modal-answer" id="modal-answer" />
        </div>
      </div>
    </>
  );
}
