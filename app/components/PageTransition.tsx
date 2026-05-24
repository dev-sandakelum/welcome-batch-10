'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Smooth page-transition overlay.
 *
 * - On link clicks: flashes a dark curtain (fade-in) before navigation,
 *   then fades it out once the new page mounts.
 * - Intercepts all <a> clicks that point to internal routes so the exit
 *   animation plays before Next.js swaps the page.
 */
export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const pendingNav = useRef<string | null>(null);

  /** Fade the curtain in, then navigate */
  const navigateWithTransition = useCallback(
    (href: string) => {
      const overlay = overlayRef.current;
      if (!overlay) {
        router.push(href);
        return;
      }
      pendingNav.current = href;
      overlay.style.transition = 'opacity 0.32s cubic-bezier(0.4, 0, 0.2, 1)';
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

      // Only intercept same-origin internal links (not hash-only, not external)
      const isInternal =
        href.startsWith('/') && !href.startsWith('//');
      const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
      const opensNewTab =
        target.target === '_blank' || target.rel?.includes('noopener');

      if (!isInternal || isModified || opensNewTab) return;

      e.preventDefault();
      navigateWithTransition(href);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [navigateWithTransition]);

  /** Fade the curtain OUT once the new route has mounted */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Small delay so the new page's DOM is painted before we reveal it
    const t = setTimeout(() => {
      overlay.style.transition = 'opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    }, 60);

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
          'radial-gradient(ellipse at center, rgba(20,8,60,0.94) 0%, rgba(0,0,0,0.98) 100%)',
        opacity: 0,
        pointerEvents: 'none',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    />
  );
}
