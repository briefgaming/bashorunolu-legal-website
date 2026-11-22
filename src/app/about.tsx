import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function About() {
  return (
    <section id="firm" className="about-band">
        <div className="wrap about-grid">
          <figure className="frame about-image reveal reveal-clip">
            <img src="https://htmlhost.co/photo/landscape/quiet-legal-office-with-walnut-table" alt="Law books and brass scales behind a desk" loading="lazy" />
          </figure>
          <div className="reveal" style={{ '--d': '.12s' } as CSSProperties}>
            <span className="tag mark">The firm</span>
            <h2 className="section-title">Know where you stand.</h2>
            <p>Whether you’re reviewing an agreement or working through a family matter, we start by understanding what you want to achieve. We explain your options, what each involves and what to consider before making a decision.</p>
            <a className="line-link" href="#contact">Get in touch <ArrowUpRight aria-hidden="true" /></a>
          </div>
        </div>
      </section>
  );
}
