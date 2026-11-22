'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Swiper from 'swiper';
import { A11y, Navigation } from 'swiper/modules';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { practiceAreas } from './practice-areas';

const pad = (n: number) => String(n).padStart(2, '0');

/** "Where we can help": an expanding index with a crossfading image panel (desktop) and a slider (phones). */
export default function HelpIndex() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const rows = Array.from(root.querySelectorAll<HTMLElement>('.help-row'));
    const rule = root.querySelector<HTMLElement>('.help-rule');
    const frames = Array.from(root.querySelectorAll<HTMLElement>('.help-frame img'));
    const stage = root.querySelector<HTMLElement>('.help-stage');
    const capNum = root.querySelector<HTMLElement>('.help-caption .help-num');
    const capTitle = root.querySelector<HTMLElement>('.help-caption-title');
    const index = root.querySelector<HTMLElement>('.help-index');
    const swiperEl = root.querySelector<HTMLElement>('.help-swiper');
    const countEl = root.querySelector<HTMLElement>('#help-count');
    const prevEl = root.querySelector<HTMLElement>('.help-prev');
    const nextEl = root.querySelector<HTMLElement>('.help-next');
    if (!rule || !stage || !capNum || !capTitle || !index || !swiperEl || !countEl || !prevEl || !nextEl) return;

    const bodies = rows.map((row) => row.querySelector<HTMLElement>('.help-body')!);
    const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const controller = new AbortController();
    const { signal } = controller;
    const moveY = gsap.quickTo(rule, 'y', { duration: instant ? 0 : 0.45, ease: 'power3.out' });
    const moveH = gsap.quickTo(rule, 'height', { duration: instant ? 0 : 0.45, ease: 'power3.out' });
    let active = -1;
    let hoverTimer: number | undefined;

    const syncRule = () => {
      const row = rows[active];
      if (!row) return;
      moveY(row.offsetTop);
      moveH(row.offsetHeight);
    };

    const activate = (i: number) => {
      if (i === active) return;
      active = i;
      rows.forEach((row, n) => {
        const open = n === i;
        row.classList.toggle('is-active', open);
        row.querySelector('.help-head')?.setAttribute('aria-expanded', String(open));
        gsap.to(bodies[n], {
          height: open ? 'auto' : 0,
          duration: instant ? 0 : 0.65,
          ease: 'power3.inOut',
          overwrite: true,
          onUpdate: syncRule,
          onComplete: syncRule,
        });
      });
      frames.forEach((img, n) => {
        const on = n === i;
        gsap.to(img, {
          opacity: on ? 1 : 0,
          scale: on ? 1 : 1.06,
          duration: instant ? 0 : 1.4,
          ease: 'power2.out',
          overwrite: true,
        });
      });
      capNum.textContent = pad(i + 1);
      capTitle.textContent = rows[i].querySelector('.help-title')?.textContent ?? '';
      syncRule();
    };

    const canHover = window.matchMedia('(hover: hover)').matches;
    rows.forEach((row, i) => {
      const head = row.querySelector('.help-head');
      head?.addEventListener('click', () => activate(i), { signal });
      head?.addEventListener('focus', () => activate(i), { signal });
      if (canHover) {
        row.addEventListener(
          'pointermove',
          (event) => {
            if ((event as PointerEvent).pointerType !== 'mouse' || i === active) return;
            window.clearTimeout(hoverTimer);
            hoverTimer = window.setTimeout(() => activate(i), 120);
          },
          { signal },
        );
        row.addEventListener('mouseleave', () => window.clearTimeout(hoverTimer), { signal });
      }
    });

    activate(0);
    window.addEventListener('resize', syncRule, { signal });

    let io: IntersectionObserver | undefined;
    if (!instant && 'IntersectionObserver' in window) {
      gsap.set(rows, { opacity: 0, y: 26 });
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            gsap.to(rows, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out', onUpdate: syncRule });
            gsap.fromTo(stage, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
            io?.disconnect();
          }
        },
        { threshold: 0.12 },
      );
      io.observe(index);
    }

    const swiper = new Swiper(swiperEl, {
      modules: [Navigation, A11y],
      slidesPerView: 1.08,
      spaceBetween: 14,
      speed: instant ? 0 : 450,
      navigation: { prevEl, nextEl },
      a11y: { prevSlideMessage: 'Previous practice area', nextSlideMessage: 'Next practice area' },
      on: {
        slideChange: (sw) => {
          countEl.textContent = pad(sw.activeIndex + 1) + ' / ' + pad(sw.slides.length);
        },
      },
    });

    return () => {
      controller.abort();
      window.clearTimeout(hoverTimer);
      io?.disconnect();
      swiper.destroy(true, true);
      const targets = [...rows, ...bodies, ...frames, rule, stage];
      gsap.killTweensOf(targets);
      gsap.set(targets, { clearProps: 'all' });
    };
  }, []);

  return (
    <section id="practice" className="help" aria-labelledby="help-title" ref={rootRef}>
      <div className="wrap">
        <div className="section-intro reveal">
          <h2 className="section-title" id="help-title">
            Where we can help
          </h2>
          <p>Six practices, one standard of care. Choose a need to see how we work.</p>
        </div>

        <div className="help-index">
          <ol className="help-rows">
            {practiceAreas.map((area, i) => (
              <li className="help-row" key={area.title}>
                <button
                  className="help-head"
                  type="button"
                  id={`help-tab-${pad(i + 1)}`}
                  aria-expanded="false"
                  aria-controls={`help-panel-${pad(i + 1)}`}
                >
                  <span className="help-num">{pad(i + 1)}</span>
                  <span className="help-title">{area.title}</span>
                  <span className="help-plus" aria-hidden="true"></span>
                </button>
                <div
                  className="help-body"
                  id={`help-panel-${pad(i + 1)}`}
                  role="region"
                  aria-labelledby={`help-tab-${pad(i + 1)}`}
                >
                  <div className="help-body-inner">
                    <p className="help-line">{area.line}</p>
                    <ul className="help-list">
                      {area.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <a className="help-link" href="#contact">
                      Speak with us <ArrowUpRight aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </li>
            ))}
            <li className="help-rule" aria-hidden="true"></li>
          </ol>
          <div className="help-stage" aria-hidden="true">
            <figure className="help-frame">
              {practiceAreas.map((area) => (
                <img key={area.title} src={area.image} alt="" loading="lazy" decoding="async" />
              ))}
            </figure>
            <p className="help-caption">
              <span className="help-num">01</span>
              <span className="help-caption-title">{practiceAreas[0].title}</span>
            </p>
          </div>
        </div>

        <div className="help-swiper swiper" aria-label="Practice areas">
          <div className="swiper-wrapper">
            {practiceAreas.map((area, i) => (
              <div className="swiper-slide help-slide" key={area.title}>
                <figure className="help-slide-img">
                  <img src={area.image} alt={area.alt} loading="lazy" decoding="async" />
                </figure>
                <div className="help-slide-copy">
                  <span className="help-num">{pad(i + 1)}</span>
                  <h3>{area.title}</h3>
                  <p className="help-line">{area.line}</p>
                  <ul className="help-list">
                    {area.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <a className="help-link" href="#contact">
                    Speak with us <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="help-swiper-nav">
            <span className="tag mark" id="help-count" aria-live="polite">
              01 / {pad(practiceAreas.length)}
            </span>
            <div className="control-buttons">
              <button type="button" className="help-prev" aria-label="Previous practice area">
                <ArrowLeft aria-hidden="true" />
              </button>
              <button type="button" className="help-next" aria-label="Next practice area">
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
