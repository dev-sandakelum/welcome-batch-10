'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Smooth page-transition overlay.
 *
 * - On link clicks: fades in a dark curtain with a spinner before navigation.
 * - Keeps the curtain visible until the new page has painted, then fades out.
 * - This hides the blank-screen delay users see during Next.js hydration.
 */
export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const pendingNav = useRef<string | null>(null);
  const [navigating, setNavigating] = useState(false);

  /** Fade the curtain in, show spinner, then navigate */
  const navigateWithTransition = useCallback(
    (href: string) => {
      const overlay = overlayRef.current;
      if (!overlay) {
        router.push(href);
        return;
      }
      pendingNav.current = href;
      setNavigating(true);
      overlay.style.transition = 'opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1)';
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'all';

      const onEnd = () => {
        overlay.removeEventListener('transitionend', onEnd);
        if (pendingNav.current) {
          router.push(pendingNav.current);
          pendingNav.current = null;
        }
      };
      overlay.addEventListener('transitionend', onEnd);
    },
    [router]
  );

  /** Intercept internal anchor clicks */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      const isInternal = href.startsWith('/') && !href.startsWith('//');
      const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
      const opensNewTab = target.target === '_blank' || target.rel?.includes('noopener');

      if (!isInternal || isModified || opensNewTab) return;

      e.preventDefault();
      navigateWithTransition(href);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [navigateWithTransition]);

  /** Fade the curtain OUT once the new route has mounted and painted */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Wait for the new page DOM to paint before revealing it
    const t = setTimeout(() => {
      overlay.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';

      // Hide spinner after fade-out completes
      const t2 = setTimeout(() => setNavigating(false), 520);
      return () => clearTimeout(t2);
    }, 80);

    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background:
          'radial-gradient(circle at top, rgba(201,162,39,0.14) 0%, transparent 45%),' +
          'radial-gradient(circle at bottom, rgba(0,180,216,0.10) 0%, transparent 40%),' +
          'linear-gradient(180deg, #040404 0%, #0a0a0a 100%)',
        opacity: 0,
        pointerEvents: 'none',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {navigating && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px',
        }}>
          {/* Spinner */}
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.10)',
            borderTopColor: '#c9a227',
            borderRightColor: 'rgba(0,180,216,0.5)',
            animation: 'ptSpin 0.85s linear infinite',
            boxShadow: '0 0 24px rgba(201,162,39,0.22)',
          }} />
          {/* Label */}
          <div style={{
            fontSize: '0.72rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.65)',
            fontFamily: 'Montserrat, Arial, sans-serif',
          }}>
            Loading
          </div>
          {/* Keyframes injected once */}
          <style>{`@keyframes ptSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </div>
  );
}
