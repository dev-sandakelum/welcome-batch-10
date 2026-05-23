'use client';

import { useEffect } from 'react';
import { initPageEntrance, initGlassShimmer, initAuroraParticles } from '@/lib/page-animations';

interface PageShellProps {
  children: React.ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  useEffect(() => {
    initAuroraParticles();
    initGlassShimmer();
    // Small delay so DOM is fully painted before animating
    const t = setTimeout(initPageEntrance, 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <canvas id="aurora-canvas" aria-hidden="true" />
      <div className="bg-canvas" />
      {children}
    </>
  );
}
