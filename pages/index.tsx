import * as React from 'react';
import Head from "next/head";
import { FaRuler as RulerIcon } from "react-icons/fa";
import { GiPalette as PaletteIcon, GiTreasureMap as MapIcon, GiRibbonMedal as MedalIcon } from "react-icons/gi";
import { AiOutlineQuestion as QuestionIcon } from "react-icons/ai";
import { MdOpenInNew as ExternalLinkIcon } from "react-icons/md";
import { DraggablePanel } from '../components/panel-drag/draggable-panel';

class LandingPage extends React.Component<Record<string, unknown>> {
  public render(): React.ReactNode {
    return (
      <main className="index-container">
        <Head>
          <title>Landing: Mealie.Moe</title>
        </Head>
        <div className="hero">
          <section className="text">
            <h1 className="title">
              <img src="/images/mealie.png" className="mealie" />
              Mealie.Moe
            </h1>
            <p className="subtitle">
              The r/Anime_IRL Discord server! Though mostly not much about anime at all.
            </p>
            <a href="https://discord.gg/anime" className="join-button" target="_blank" rel="noreferrer">
              Join Server
            </a>
          </section>
          <span className="photo-credit">
            Photo by Paweł Czerwiński on Unsplash
          </span>
        </div>
        <DraggablePanel className="links" noBottomNav>
          <nav className="psudeo-links">
            <a href="/pages/server-info" className="nav-link">
              <RulerIcon className="icon rules" /> Rules
            </a>
            <a href="/palette" className="nav-link">
              <PaletteIcon className="icon palette" /> Color Palette
            </a>
            <a href="/server-map" className="nav-link">
              <MapIcon className="icon map" /> Server Map
            </a>
            <a href="https://www.danbo.space/leaderboards/148606162810568704" target="_blank" rel="noreferrer" className="nav-link">
              <MedalIcon className="icon medal" /> Leaderboards <ExternalLinkIcon className="external-link-icon" />
            </a>
            <a href="/faq" className="nav-link">
              <QuestionIcon className="icon faq" /> Frequently Asked Questions
            </a>
          </nav>
        </DraggablePanel>
      </main>
    );
  }
}

export default LandingPage;