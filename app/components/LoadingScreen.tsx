'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loading screen after page loads
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loading-screen ${!isLoading ? 'hidden' : ''}`}>
      <div className="loading-logo">
        Welcome 10th Batch
      </div>
      
      <div className="loading-spinner"></div>
      
      <div className="loading-text">
        Loading
        <span className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
    </div>
  );
}
