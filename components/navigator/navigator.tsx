import * as React from 'react';
import { MdOpenInNew } from "react-icons/md";
import Link from "next/link";
import { API_BASE } from '../../utils/api-fetch';

export interface NavigatorProps {
  loggedIn?: boolean;
  centered?: boolean;
  admin?: boolean;
}

function conditionalRender(loggedIn: boolean): React.ReactNode {
  if (loggedIn) {
    return (
      <>
        <Link href="/logout"><a className="link">Logout</a></Link>
      </>
    );
  }
  return (
    <a className="link" href={`${API_BASE}/auth/login`}>Login</a>
  );
}

export const Navigator: React.FunctionComponent<NavigatorProps> = ({ admin, loggedIn, centered }): JSX.Element => {
  if (admin) {
    return (
      <section className={`navigator ${centered && "centered"}`}>
        <label className="navigator-title">
          Navigate: Admin
        </label>
        <section className="links">
          <Link href="/admin/users">
            <a className="link">Users</a>
          </Link>
          <Link href="/admin/pages">
            <a className="link">Pages</a>
          </Link>
          <Link href="/admin/faq/create">
            <a className="link">FAQs</a>
          </Link>
          <Link href="/">
            <a className="link">Non-Admin dashboard</a>
          </Link>
        </section>
      </section>
    );
  }

  return (
    <section className={`navigator ${centered && "centered"}`}>
      <label className="navigator-title">
        Navigate
      </label>
      <section className="links">
        <Link href="/faq"><a className="link">FAQ</a></Link>
        <Link href="/pages"><a className="link">Pages</a></Link>
        <Link href="/palette"><a className="link">Palette</a></Link>
        <Link href="/server-map"><a className="link">Server Map</a></Link>
        <a className="link" target="__blank" href="https://www.danbo.space">Leaderboards <MdOpenInNew /></a>
        {conditionalRender(Boolean(loggedIn))}
      </section>
    </section>
  );
}