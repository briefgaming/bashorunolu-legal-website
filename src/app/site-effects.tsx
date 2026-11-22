'use client';

import { useEffect } from 'react';

/**
 * Page-wide behaviour: scroll reveals, the header's solid state, parallax
 * layers and the wordmark's return-to-top. Renders nothing.
 */
export default function SiteEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionOK = !reduceMotion.matches && 'IntersectionObserver' in window;
    const controller = new AbortController();
    const { signal } = controller;

    let revealer: IntersectionObserver | undefined;
    if (motionOK) {
      document.documentElement.classList.add('motion');
      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in');
              observer.unobserve(entry.target);
            }
          }),
        { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
      );
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
      revealer = observer;
    }

    const header = document.querySelector<HTMLElement>('.site-header');
    let resizeObserver: ResizeObserver | undefined;
    if (header) {
      const setHeaderHeight = () =>
        document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
      setHeaderHeight();
      if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(setHeaderHeight);
        resizeObserver.observe(header);
      }
    }

    const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        header?.classList.toggle('is-solid', window.scrollY > 24);
        if (!motionOK) return;
        const vh = window.innerHeight;
        for (const el of layers) {
          const box = el.parentElement?.getBoundingClientRect();
          if (!box || box.bottom < 0 || box.top > vh || !box.height) continue;
          const shift =
            el.dataset.parallax === 'hero'
              ? Math.max(0, Math.min(-box.top, box.height)) * 0.14
              : Math.max(-80, Math.min(80, (box.top + box.height / 2 - vh / 2) * -0.12));
          el.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0)';
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true, signal });
    window.addEventListener('resize', onScroll, { signal });

    // The wordmark returns to the very top of the page.
    document.querySelectorAll('a[href="#home"]').forEach((link) =>
      link.addEventListener(
        'click',
        (event) => {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
          history.pushState(null, '', '#home');
        },
        { signal },
      ),
    );

    onScroll();

    return () => {
      controller.abort();
      revealer?.disconnect();
      resizeObserver?.disconnect();
    };
  }, []);

  return null;
}
