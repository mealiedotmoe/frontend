import * as React from 'react';
import { MdOpenInNew, MdAccountCircle, MdSchool, MdPages, MdDashboard, MdExitToApp } from "react-icons/md";
import Link from "next/link";
import { GiPalette as PaletteIcon, GiTreasureMap as MapIcon, GiRibbonMedal as MedalIcon } from "react-icons/gi";
import { AiOutlineQuestion as QuestionIcon } from "react-icons/ai";
import { redirectToLogin } from '../../utils/login';

export interface NavigatorProps {
  loggedIn?: boolean;
  centered?: boolean;
  admin?: boolean;
}

function conditionalRender(loggedIn: boolean, isMobile: boolean): React.ReactNode {
  if (loggedIn) {
    return (
      <Link href="/logout">
        <a className="link">
          {isMobile ? (
            <>
              <MdExitToApp className="icon" />
              Logout
            </>
          ): (
            "Logout"
          )}
        </a>
      </Link>
    );
  }
  return (
    <a className="link" onClick={() => redirectToLogin()}>
      {
        isMobile ? (
          <>
            <MdAccountCircle className="icon" />
            Login
          </>
        ) : (
          "Login"
        )
      }
    </a>
  );
}

export const Navigator: React.FunctionComponent<NavigatorProps> = ({ admin, loggedIn }: NavigatorProps): JSX.Element => {
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => setIsMobile(mobileRegex.test(navigator.userAgent.toLowerCase())), []);

  if (admin) {
    if (isMobile) {
      return (
        <section className={`navigator centered`}>
          <Link href="/admin/users">
            <a className="link">
              <MdAccountCircle className="icon" />
            </a>
          </Link>
          <Link href="/admin/faq/create">
            <a className="link">
              <MdSchool className="icon" />
            </a>
          </Link>
          <Link href="/admin/pages">
            <a className="link">
              <MdPages className="icon" />
            </a>
          </Link>
          <Link href="/">
            <a className="link">
              <MdDashboard className="icon" />
            </a>
          </Link>
        </section>
      );
    }
    return (
      <section className={`navigator centered`}>
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

  if (isMobile) {
    return (
      <section className={`navigator centered`}>
        <Link href="/faq">
          <a className="link">
            <QuestionIcon className="icon" />
            FAQs
          </a>
        </Link>
        <Link href="/pages">
          <a className="link">
            <MdPages className="icon" />
            Pages
          </a>
        </Link>
        <Link href="/palette">
          <a className="link">
            <PaletteIcon className="icon" />
            Palettes
          </a>
        </Link>
        <Link href="/server-map">
          <a className="link">
            <MapIcon className="icon" />
            Server Map
          </a>
        </Link>
        <a className="link" target="__blank" href="https://www.danbo.space/leaderboards/148606162810568704">
          <MedalIcon className="icon" />
          Leaderboards
        </a>
        {conditionalRender(Boolean(loggedIn), isMobile)}
      </section>
    )
  }

  return (
    <section className={`navigator centered`}>
      <label className="navigator-title">
        Navigate
      </label>
      <section className="links">
        <Link href="/faq"><a className="link">FAQ</a></Link>
        <Link href="/pages"><a className="link">Pages</a></Link>
        <Link href="/palette"><a className="link">Palette</a></Link>
        <Link href="/server-map"><a className="link">Server Map</a></Link>
        <a className="link" target="__blank" href="https://www.danbo.space/leaderboards/148606162810568704">Leaderboards <MdOpenInNew /></a>
        {conditionalRender(Boolean(loggedIn), isMobile)}
      </section>
    </section>
  );
}