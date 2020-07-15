import * as React from 'react';
import Head from "next/head";
import { FaRuler as RulerIcon } from "react-icons/fa";
import { GiPalette as PaletteIcon, GiTreasureMap as MapIcon, GiRibbonMedal as MedalIcon } from "react-icons/gi";
import { AiOutlineQuestion as QuestionIcon } from "react-icons/ai";
import { MdOpenInNew as ExternalLinkIcon } from "react-icons/md";

class LandingPage extends React.Component<{}> {
  public render() {
    return (
      <section className="container">
        <Head>
          <title>Landing: Mealie.Moe</title>
        </Head>
        <main className="hero">
          <section className="text">
            <h1 className="title">
              Mealie.Moe
            </h1>
            <p className="subtitle">
              The r/Anime_IRL Discord server! Though mostly not much about anime at all.
            </p>
            <a href="https://discord.gg/anime" className="join-button" target="__blank">
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
              <RulerIcon className="icon rules" /> Rules
            </a>
            <a href="/palette" className="nav-link">
              <PaletteIcon className="icon palette" /> Color Palette
            </a>
            <a href="/map" className="nav-link">
              <MapIcon className="icon map" /> Server Map
            </a>
            <a href="https://danbo.space" target="__blank" className="nav-link">
              <MedalIcon className="icon medal" /> Leaderboards <ExternalLinkIcon className="external-link-icon" />
            </a>
            <a href="/faq" className="nav-link">
              <QuestionIcon className="icon faq" /> Frequently Asked Questions
            </a>
          </section>
        </aside>
      </section>
    );
  }
}

export default LandingPage;