'use client';

import { useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Animation variant */
  animation?: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right';
  /** Delay in ms — useful for staggering children */
  delay?: number;
  /** How much of the element should be visible before triggering (0-1) */
  threshold?: number;
  /** Play animation immediately on mount (for above-the-fold content) */
  immediate?: boolean;
}

export function ScrollReveal({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  threshold = 0.15,
  immediate = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (immediate) {
      const timer = setTimeout(() => el.classList.add('revealed'), delay);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('revealed'), delay);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold, immediate]);

  return (
    <div ref={ref} className={`scroll-reveal scroll-reveal--${animation} ${className}`}>
      {children}
    </div>
  );
}
