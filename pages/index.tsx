import * as React from 'react';

class LandingPage extends React.Component<{}> {
  public render() {
    return (
      <section className="container">
        <main className="hero">
          <section className="text">
            <h1 className="title">
              Mealie.Moe
            </h1>
            <p className="subtitle">
              The r/Anime_IRL Discord server! Though mostly not much about anime at all.
            </p>
            <a href="#" className="join-button">
              Join Server
            </a>
          </section>
          <span className="photo-credit">
            Photo by Paweł Czerwiński on Unsplash
          </span>
        </main>
        <aside className="links">
          <section className="psudeo-links">
            <a href="/rules" className="nav-link">
              Rules
            </a>
            <a href="/palette" className="nav-link">
              Color Palette
            </a>
            <a href="/map" className="nav-link">
              Server Map
            </a>
            <a href="https://danbo.space" target="__blank" className="nav-link">
              Leaderboards
            </a>
            <a href="/faq" className="nav-link">
              Frequently Asked Questions
            </a>
          </section>
        </aside>
      </section>
    );
  }
}

export default LandingPage;