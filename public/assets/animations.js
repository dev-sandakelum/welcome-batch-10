/* ============================================
   Welcome 10th Batch - Animation Utilities
   ============================================ */

/**
 * Popup animation observer
 * Adds 'visible' class to elements when they enter viewport
 */
export function initPopupAnimations() {
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.popup-animate').forEach(el => observer.observe(el));
}

/**
 * Smooth scroll to element
 */
export function smoothScrollTo(element) {
  if (!element) return;
  
  element.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start',
    inline: 'nearest'
  });
}

/**
 * Initialize navigation dots
 */
export function initNavDots() {
  const sections = document.querySelectorAll('.section');
  const navDots = document.querySelectorAll('.nav-dot');

  // Section observer for active state
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = entry.target.dataset.idx;
        navDots.forEach(dot => dot.classList.remove('active'));
        if (navDots[idx]) {
          navDots[idx].classList.add('active');
        }
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(section => sectionObserver.observe(section));

  // Click handlers
  navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (sections[index]) {
        smoothScrollTo(sections[index]);
      }
    });
  });
}

/**
 * Enhanced scroll snap functionality
 */
export function initScrollSnap() {
  const sections = document.querySelectorAll('.section');
  let isScrolling;
  let currentSection = 0;
  let isSnapping = false;

  function smoothScrollToSection(element) {
    if (isSnapping) return;
    isSnapping = true;
    
    smoothScrollTo(element);
    
    setTimeout(() => {
      isSnapping = false;
    }, 800);
  }

  window.addEventListener('scroll', () => {
    if (isSnapping) return;
    
    clearTimeout(isScrolling);
    
    isScrolling = setTimeout(() => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      let closestSection = 0;
      let minDistance = Infinity;
      
      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const distance = Math.abs(scrollPosition - sectionTop);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestSection = index;
        }
      });
      
      const threshold = windowHeight * 0.15;
      if (minDistance > threshold || minDistance > 30) {
        smoothScrollToSection(sections[closestSection]);
        currentSection = closestSection;
      }
    }, 100);
  }, { passive: true });

  // Touch support
  let touchStartY = 0;
  let touchStartTime = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (isSnapping) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndTime = Date.now();
    const diff = touchStartY - touchEndY;
    const timeDiff = touchEndTime - touchStartTime;
    const velocity = Math.abs(diff) / timeDiff;
    
    if (Math.abs(diff) > 30 || velocity > 0.5) {
      if (diff > 0 && currentSection < sections.length - 1) {
        currentSection++;
        smoothScrollToSection(sections[currentSection]);
      } else if (diff < 0 && currentSection > 0) {
        currentSection--;
        smoothScrollToSection(sections[currentSection]);
      }
    }
  }, { passive: true });
}

/**
 * FAQ Modal functionality
 */
export function initFaqModal(faqData) {
  window.openFaqModal = function(index) {
    const modal = document.getElementById('faq-modal');
    const question = document.getElementById('modal-question');
    const answer = document.getElementById('modal-answer');
    
    if (faqData[index]) {
      question.textContent = faqData[index].question;
      answer.textContent = faqData[index].answer;
      
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeFaqModal = function() {
    const modal = document.getElementById('faq-modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  };

  // Close on outside click
  const modal = document.getElementById('faq-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        window.closeFaqModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.closeFaqModal();
    }
  });
}

/**
 * Star rating functionality
 */
export function initStarRating(onRatingChange) {
  let selectedRating = 0;

  window.setRating = function(rating) {
    selectedRating = rating;
    
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('lit');
      } else {
        star.classList.remove('lit');
      }
    });

    if (onRatingChange) {
      onRatingChange(rating);
    }
  };

  return () => selectedRating;
}
