import About from './about';
import CityBand from './city-band';
import Hero from './hero';
import HelpIndex from './help-index';
import LatestPosts from './latest-posts';
import SiteEffects from './site-effects';
import SiteFooter from './site-footer';
import SiteHeader from './site-header';

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section id="firm-site">
          <Hero />
          <HelpIndex />
          <CityBand />
          <About />
          <LatestPosts />
        </section>
      </main>
      <SiteFooter />
      <SiteEffects />
    </>
  );
}
