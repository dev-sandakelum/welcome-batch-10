/* ============================================
   GSAP Animation Engine — bundled by Next.js
   ============================================ */

import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

/* ── Per-section staggered entrance ─────── */
function animateSection(section: Element) {
  if (!section || (section as any)._gsapDone) return;
  (section as any)._gsapDone = true;

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  const badge = section.querySelector('.hero-badge, .section-label');
  if (badge)
    tl.fromTo(badge,
      { opacity: 0, y: -18 },
      { opacity: 1, y: 0, duration: 0.75 }, 0);

  const title = section.querySelector('.hero-title, .section-heading, .section-heading-mobile');
  if (title)
    tl.fromTo(title,
      { opacity: 0, y: 45, skewY: 2 },
      { opacity: 1, y: 0, skewY: 0, duration: 0.9 }, 0.12);

  const sub = section.querySelector('.hero-subtitle, .hero-batch');
  if (sub)
    tl.fromTo(sub,
      { opacity: 0, x: -28 },
      { opacity: 1, x: 0, duration: 0.75 }, 0.28);

  const desc = section.querySelector('.hero-description, .leaderboard-description');
  if (desc)
    tl.fromTo(desc,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.65 }, 0.42);

  const divider = section.querySelector('.gold-dot-line');
  if (divider)
    tl.fromTo(divider,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.7, transformOrigin: 'center' }, 0.18);

  const cards = section.querySelectorAll(
    '.about-card-item, .faq-item, .leaderboard-entry, .feedback-feature-item, .about-stat-item'
  );
  if (cards.length)
    tl.fromTo(cards,
      { opacity: 0, y: 28, scale: 0.93 },
      { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.07 }, 0.38);

  const mainCard = section.querySelector('.card');
  if (mainCard && !cards.length)
    tl.fromTo(mainCard,
      { opacity: 0, y: 48, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.85 }, 0.28);

  const btns = section.querySelectorAll(
    '.hero-buttons .btn-gold, .hero-buttons .btn-outline, .hero-icon-buttons .icon-btn'
  );
  if (btns.length)
    tl.fromTo(btns,
      { opacity: 0, y: 18, scale: 0.88 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.06 }, 0.55);
}

/* ── GSAP Scroll Snap ────────────────────── */
export function initGSAPScrollSnap() {
  const sections = Array.from(document.querySelectorAll('.home-section'));
  if (!sections.length) return;

  // Disable native scroll snap — GSAP owns it
  document.documentElement.style.scrollSnapType = 'none';
  document.documentElement.style.overflowY = 'hidden';
  document.body.style.overflowY = 'hidden';

  let current = 0;
  let busy = false;
  const DUR = 1.05;

  function snap(next: number, dir: number) {
    if (busy || next < 0 || next >= sections.length || next === current) return;
    busy = true;

    const leaving = sections[current];
    const entering = sections[next];

    gsap.to(leaving, {
      opacity: 0, y: dir > 0 ? -50 : 50, scale: 0.97,
      duration: DUR * 0.45, ease: 'power2.in',
    });

    gsap.to(window, {
      scrollTo: { y: entering, autoKill: false },
      duration: DUR,
      ease: 'expo.inOut',
      onComplete() {
        gsap.fromTo(entering,
          { opacity: 0, y: dir > 0 ? 70 : -70, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: DUR * 0.65, ease: 'expo.out',
            onComplete() {
              busy = false;
              gsap.set(leaving, { opacity: 1, y: 0, scale: 1 });
            },
          }
        );

        document.querySelectorAll('.nav-dot').forEach((d, i) =>
          d.classList.toggle('active', i === next)
        );

        current = next;
        animateSection(entering);
      },
    });
  }

  // Wheel
  let wDelta = 0;
  let wTimer: ReturnType<typeof setTimeout>;
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (busy) return;
    wDelta += e.deltaY;
    clearTimeout(wTimer);
    wTimer = setTimeout(() => {
      if (Math.abs(wDelta) > 20) snap(current + (wDelta > 0 ? 1 : -1), wDelta > 0 ? 1 : -1);
      wDelta = 0;
    }, 40);
  }, { passive: false });

  // Touch
  let ty = 0;
  window.addEventListener('touchstart', (e) => { ty = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if (busy) return;
    const d = ty - e.changedTouches[0].clientY;
    if (Math.abs(d) > 35) snap(current + (d > 0 ? 1 : -1), d > 0 ? 1 : -1);
  }, { passive: true });

  // Keyboard
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') snap(current + 1, 1);
    if (e.key === 'ArrowUp'   || e.key === 'PageUp')   snap(current - 1, -1);
  });

  // Nav dots
  document.querySelectorAll('.nav-dot').forEach((dot, i) =>
    dot.addEventListener('click', () => snap(i, i > current ? 1 : -1))
  );

  // Animate first section
  animateSection(sections[0]);
}

/* ── Aurora particle canvas ──────────────── */
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

  const pts = Array.from({ length: 55 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 2.2 + 0.4,
    vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    col: COLS[Math.floor(Math.random() * COLS.length)],
    a: Math.random() * 0.45 + 0.1,
    ph: Math.random() * Math.PI * 2, ps: Math.random() * 0.018 + 0.004,
  }));

  const blobs = Array.from({ length: 4 }, (_, i) => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 280 + 180,
    vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12,
    col: i % 2 === 0 ? 'rgba(201,162,39,' : 'rgba(0,180,216,',
    a: 0.022 + Math.random() * 0.018,
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
        if (dist < 110) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = p.col + (0.07 * (1 - dist / 110)) + ')';
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    });

    requestAnimationFrame(frame);
  }
  frame();
}

/* ── 3-D tilt on hover ───────────────────── */
export function initMagneticCards() {
  document.querySelectorAll<HTMLElement>('.about-card-item, .faq-item, .feedback-feature-item').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform =
        `perspective(700px) rotateX(${(-y / r.height) * 9}deg) rotateY(${(x / r.width) * 9}deg) translateZ(10px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
      el.style.transform = '';
      setTimeout(() => { el.style.transition = ''; }, 560);
    });
  });
}

/* ── Shimmer sweep on .card hover ────────── */
export function initGlassShimmer() {
  document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
    if (card.querySelector('.glass-shimmer')) return;
    const s = document.createElement('div');
    s.className = 'glass-shimmer';
    card.appendChild(s);
    card.addEventListener('mouseenter', () => {
      s.style.animation = 'none';
      requestAnimationFrame(() => { s.style.animation = 'shimmerSweep 0.75s ease forwards'; });
    });
  });
}

/* ── Nav dot ripple observer ─────────────── */
export function initNavDotPulse() {
  const obs = new MutationObserver((muts) => {
    muts.forEach((m) => {
      const t = m.target as HTMLElement;
      if (m.attributeName === 'class' && t.classList.contains('active')) {
        t.style.animation = 'none';
        requestAnimationFrame(() => { t.style.animation = ''; });
      }
    });
  });
  document.querySelectorAll('.nav-dot').forEach((d) =>
    obs.observe(d, { attributes: true })
  );
}

/* ── FAQ Modal ───────────────────────────── */
export function initFaqModal(faqData: { question: string; answer: string }[]) {
  (window as any).openFaqModal = (index: number) => {
    const modal = document.getElementById('faq-modal')!;
    const q = document.getElementById('modal-question')!;
    const a = document.getElementById('modal-answer')!;
    if (!faqData[index]) return;
    q.textContent = faqData[index].question;
    a.textContent = faqData[index].answer;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    const c = modal.querySelector('.faq-modal-content') as HTMLElement;
    gsap.fromTo(c,
      { opacity: 0, scale: 0.86, y: 36 },
      { opacity: 1, scale: 1, y: 0, duration: 0.48, ease: 'back.out(1.5)' }
    );
  };

  (window as any).closeFaqModal = () => {
    const modal = document.getElementById('faq-modal')!;
    gsap.to(modal.querySelector('.faq-modal-content') as HTMLElement, {
      opacity: 0, scale: 0.9, y: 20, duration: 0.28, ease: 'power2.in',
      onComplete() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
      },
    });
  };

  const modal = document.getElementById('faq-modal');
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) (window as any).closeFaqModal?.();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') (window as any).closeFaqModal?.();
  });
}
