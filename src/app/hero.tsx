import type { CSSProperties } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="front-hero" aria-labelledby="home-title">
        <div className="hero-media">
          <div className="layer" data-parallax="hero">
            <div className="settle">
              <img src="/images/lagos-island-1280.jpg" srcSet="/images/lagos-island-960.jpg 960w, /images/lagos-island-1280.jpg 1280w" sizes="(max-width:760px) 100vw, 66vw" alt="Morning light over the lagoon and the Lagos Island skyline" {...{ fetchpriority: 'high' }} />
            </div>
          </div>
        </div>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="tag eyebrow" style={{ '--d': '.2s' } as CSSProperties}><span></span> Law firm in Lekki, Lagos</span>
            <h1 id="home-title" style={{ '--d': '.32s' } as CSSProperties}>Legal counsel for <em>what comes next.</em></h1>
            <p style={{ '--d': '.5s' } as CSSProperties}>Olu Bashorun &amp; Co advises businesses, individuals and families on property, commercial transactions and personal legal matters.</p>
            <div className="hero-actions" style={{ '--d': '.66s' } as CSSProperties}>
              <a className="site-button gold" href="#contact">Discuss your matter <ArrowUpRight aria-hidden="true" /></a>
              <a className="quiet-link" href="#practice">Explore our practice <ArrowDown aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </section>
  );
}
