import * as React from 'react';
import { MdOpenInNew } from "react-icons/md";
import Link from "next/link";

export const Navigator: React.FunctionComponent<{}> = ({ }): JSX.Element => (
  <section className="navigator">
    <label className="navigator-title">
      Navigate
    </label>
    <section className="links">
      <Link href="/info/rules"><a className="link">Rules</a></Link>
      <Link href="/palette"><a className="link">Palette</a></Link>
      <Link href="/server-map"><a className="link">Server Map</a></Link>
      <Link href="/faq"><a className="link">FAQ</a></Link>
      <a className="link" target="__blank" href="https://www.danbo.space">Leaderboards <MdOpenInNew /></a>
    </section>
  </section>
)