
export default function CityBand() {
  return (
    <section className="city-band" aria-labelledby="city-title">
        <div className="city-media"><img data-parallax="band" src="/images/lagos-boulevard-1480.jpg" srcSet="/images/lagos-boulevard-900.jpg 900w, /images/lagos-boulevard-1480.jpg 1480w" sizes="100vw" alt="Traffic flows along a tree-lined Lagos boulevard, with towers stretching to the Atlantic" loading="lazy" /></div>
        <div className="wrap city-copy reveal">
          <span className="tag eyebrow"><span></span> Rooted in Lagos</span>
          <h2 className="section-title" id="city-title">Business moves fast. <em>Good counsel keeps pace.</em></h2>
          <p>Based in Lekki, we meet clients remotely and by appointment, and keep matters moving with clear advice at every step.</p>
        </div>
      </section>
  );
}
