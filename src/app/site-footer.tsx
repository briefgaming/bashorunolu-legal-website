import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer id="contact" className="site-footer" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="footer-cta">
          <div>
            <h2 className="footer-title" id="contact-title">Let’s discuss your matter.</h2>
            <p>Email or call to arrange a consultation.</p>
          </div>
          <a className="site-button gold" href="mailto:olu.bash.law@gmail.com?subject=Consultation%20enquiry">Request a consultation <ArrowUpRight aria-hidden="true" /></a>
        </div>
        <div className="footer-grid">
          <div className="footer-col">
            <h2 className="footer-heading">Contact</h2>
            <address className="footer-contact">
              <p><MapPin aria-hidden="true" /><span>Lekki, Eti-Osa<br />Lagos, Nigeria</span></p>
              <p><Mail aria-hidden="true" /><a href="mailto:olu.bash.law@gmail.com">olu.bash.law@gmail.com</a></p>
              <p><Phone aria-hidden="true" /><span><a href="tel:+2348025903012">+234 802 590 3012</a><br /><a href="tel:+2347042871925">+234 704 287 1925</a></span></p>
            </address>
          </div>
          <div className="footer-col">
            <h2 className="footer-heading">Services</h2>
            <ul className="footer-list">
              <li><Link href="/#practice">Corporate, Commercial &amp; Contract Law</Link></li>
              <li><Link href="/#practice">Energy, Renewables &amp; Infrastructure</Link></li>
              <li><Link href="/#practice">Property, Construction &amp; Conveyancing</Link></li>
              <li><Link href="/#practice">Family &amp; Estates</Link></li>
              <li><Link href="/#practice">Data Protection &amp; Compliance</Link></li>
              <li><Link href="/#practice">AI Advisory</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h2 className="footer-heading">Resources</h2>
              <ul className="footer-list">
                <li><Link href="/#firm">The Firm</Link></li>
                <li><Link href="/#practice">Practice Areas</Link></li>
                <li><Link href="/blog">The Stable</Link></li>
              </ul>
          </div>
          <div className="footer-col footer-social">
            <h2 className="footer-heading">Follow</h2>
              <div className="social">
                {/* Placeholder profile links: replace with the firm's real URLs */}
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="Olu Bashorun &amp; Co on LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z"/></svg></a>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Olu Bashorun &amp; Co on Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><g className="outline"><rect width="18" height="18" x="3" y="3" rx="5"/><circle cx="12" cy="12" r="3.8"/></g><circle cx="17.3" cy="6.7" r="1.2"/></svg></a>
                <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="Olu Bashorun &amp; Co on X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.25 6.93zm-1.29 19.5h2.04L6.49 3.24H4.3z"/></svg></a>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Olu Bashorun &amp; Co on Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.33-.04-1.56-.14-2.86-.14C11.93 2 10 3.66 10 6.7v2.8H7v4h3V22h4z"/></svg></a>
              </div>
            <p>Insights and news from us.</p>
          </div>
        </div>
        <div className="footer-legal">
          <nav aria-label="Legal"><a href="#">Privacy Policy</a><a href="#">Terms of Use</a></nav>
          <span>All rights reserved. © 2026 Olu Bashorun &amp; Co</span>
        </div>
      </div>
    </footer>
  );
}
