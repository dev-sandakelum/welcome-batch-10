/* ============================================
   Shared page entrance animations (all routes)
   ============================================ */
import { gsap } from 'gsap';

/** Run once per page — animates the main card + header in */
export function initPageEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  // Back link
  const backLink = document.querySelector(
    '.quiz-back-link, .leaderboard-back-link, .feedback-back-link, ' +
    '.questions-back-link, .all-questions-back-link, .admin-back-link'
  );
  if (backLink)
    tl.fromTo(backLink, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6 }, 0);

  // Page label
  const label = document.querySelector(
    '.quiz-card-label, .leaderboard-card-label, .feedback-card-label, ' +
    '.questions-card-label, .all-questions-card-label, ' +
    '.admin-page-title, .admin-page-title-center, .admin-login-title'
  );
  if (label)
    tl.fromTo(label, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.7 }, 0.1);

  // Page title / card title
  const title = document.querySelector(
    '.quiz-card-title, .leaderboard-card-title, .feedback-card-title, ' +
    '.questions-card-title, .all-questions-card-title, ' +
    '.admin-page-description, .admin-page-description-center, .admin-login-description'
  );
  if (title)
    tl.fromTo(title, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.75 }, 0.2);

  // Main card
  const card = document.querySelector('.card');
  if (card)
    tl.fromTo(card,
      { opacity: 0, y: 50, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9 },
      0.15
    );

  // Stat cards stagger
  const statCards = document.querySelectorAll('.admin-stat-card, .stat-card');
  if (statCards.length)
    tl.fromTo(statCards,
      { opacity: 0, y: 30, scale: 0.93 },
      { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.07 },
      0.25
    );

  // List items stagger
  const items = document.querySelectorAll(
    '.leaderboard-entry, .all-questions-item, .admin-score-entry, ' +
    '.admin-feedback-item-card, .admin-test-result-row'
  );
  if (items.length)
    tl.fromTo(items,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.05 },
      0.4
    );
}

/** Glass shimmer on every .card */
export function initGlassShimmer() {
  document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
    if (card.querySelector('.glass-shimmer')) return;
    const s = document.createElement('div');
    s.className = 'glass-shimmer';
    card.appendChild(s);
    card.addEventListener('mouseenter', () => {
      s.style.animation = 'none';
      requestAnimationFrame(() => {
        s.style.animation = 'shimmerSweep 0.75s ease forwards';
      });
    });
  });
}

/** Aurora particle canvas */
export function initAuroraParticles() {
  const canvas = document.getElementById('aurora-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d')!;

  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);
  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const COLS = [
    'rgba(201,162,39,', 'rgba(0,180,216,',
    'rgba(240,200,74,', 'rgba(72,224,255,', 'rgba(27,107,58,',
  ];

  const pts = Array.from({ length: 45 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 2 + 0.4,
    vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
    col: COLS[Math.floor(Math.random() * COLS.length)],
    a: Math.random() * 0.4 + 0.08,
    ph: Math.random() * Math.PI * 2, ps: Math.random() * 0.016 + 0.004,
  }));

  const blobs = Array.from({ length: 3 }, (_, i) => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 260 + 160,
    vx: (Math.random() - 0.5) * 0.1, vy: (Math.random() - 0.5) * 0.1,
    col: i % 2 === 0 ? 'rgba(201,162,39,' : 'rgba(0,180,216,',
    a: 0.018 + Math.random() * 0.015,
  }));

  function frame() {
    ctx.clearRect(0, 0, W, H);
    blobs.forEach((b) => {
      b.x += b.vx; b.y += b.vy;
      if (b.x < -b.r) b.x = W + b.r; if (b.x > W + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = H + b.r; if (b.y > H + b.r) b.y = -b.r;
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, b.col + b.a + ')');
      g.addColorStop(1, b.col + '0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
    });
    pts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; p.ph += p.ps;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      const a = p.a * (0.65 + 0.35 * Math.sin(p.ph));
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + a + ')'; ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = p.col + (0.06 * (1 - dist / 100)) + ')';
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    });
    requestAnimationFrame(frame);
  }
  frame();
}
